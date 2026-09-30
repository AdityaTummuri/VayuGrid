"""
VayuGrid Weather & Micrometeorological Telemetry Service.
Fetches live boundary layer and wind vector fields from Open-Meteo API with
robust offline regional fallback, solar insolation stability classification,
and friction velocity estimation.
"""

import math
import logging
from typing import Optional, Dict, Any, List
import httpx

from app.models.weather import (
    WeatherTelemetry,
    StabilityClass,
    TerrainCategory,
    CityMetadata,
)

logger = logging.getLogger("vayugrid.weather")

# Flagship Regional Archetypes across India
REGIONAL_ARCHETYPES: Dict[str, CityMetadata] = {
    "delhi_ncr": CityMetadata(
        id="delhi_ncr",
        name="Delhi-NCR",
        center={"lat": 28.6139, "lon": 77.2090},
        default_zoom=12,
        archetype="High Density Urban & Municipal Solid Waste Burning",
        ulb_authority="Municipal Corporation of Delhi (MCD)",
        terrain=TerrainCategory.URBAN,
        typical_pbl_winter_m=420.0,
        typical_pbl_summer_m=1350.0,
    ),
    "bengaluru": CityMetadata(
        id="bengaluru",
        name="Bengaluru",
        center={"lat": 12.9716, "lon": 77.5946},
        default_zoom=12,
        archetype="Construction Corridor & Transit Resuspension",
        ulb_authority="Bruhat Bengaluru Mahanagara Palike (BBMP)",
        terrain=TerrainCategory.URBAN,
        typical_pbl_winter_m=750.0,
        typical_pbl_summer_m=1500.0,
    ),
    "kanpur": CityMetadata(
        id="kanpur",
        name="Kanpur",
        center={"lat": 26.4499, "lon": 80.3319},
        default_zoom=12,
        archetype="Tannery & Industrial Stack Emission Corridor",
        ulb_authority="Kanpur Municipal Corporation (KMC)",
        terrain=TerrainCategory.URBAN,
        typical_pbl_winter_m=480.0,
        typical_pbl_summer_m=1200.0,
    ),
    "mumbai": CityMetadata(
        id="mumbai",
        name="Mumbai Metropolitan",
        center={"lat": 19.0760, "lon": 72.8777},
        default_zoom=12,
        archetype="Coastal Inversion & High-Rise Construction Dust",
        ulb_authority="Brihanmumbai Municipal Corporation (BMC)",
        terrain=TerrainCategory.COASTAL,
        typical_pbl_winter_m=600.0,
        typical_pbl_summer_m=1100.0,
    ),
    "punjab": CityMetadata(
        id="punjab",
        name="Punjab Agrarian Belt (Ludhiana-Sangrur)",
        center={"lat": 30.9010, "lon": 75.8573},
        default_zoom=11,
        archetype="Seasonal Biomass & Agricultural Stubble Burning",
        ulb_authority="Punjab Pollution Control Board (PPCB)",
        terrain=TerrainCategory.RURAL_OPEN,
        typical_pbl_winter_m=520.0,
        typical_pbl_summer_m=1400.0,
    ),
}

# Aerodynamic roughness length z0 (meters) per terrain category
ROUGHNESS_LENGTHS: Dict[TerrainCategory, float] = {
    TerrainCategory.URBAN: 1.20,
    TerrainCategory.SUBURBAN: 0.40,
    TerrainCategory.RURAL_OPEN: 0.03,
    TerrainCategory.COASTAL: 0.005,
}


class WeatherService:
    """Micrometeorological telemetry ingestion and stability estimation engine."""

    def __init__(self, timeout_seconds: float = 4.0):
        self.timeout_seconds = timeout_seconds
        self.open_meteo_url = "https://api.open-meteo.com/v1/forecast"

    def compute_downwind_bearing(self, wind_direction_deg: float) -> float:
        """
        Calculates downwind advection travel direction from wind bearing.
        Wind direction is where wind blows FROM; plume travels downwind TOWARDS (wind + 180°).
        """
        return round((wind_direction_deg + 180.0) % 360.0, 2)

    def determine_stability_class(
        self,
        wind_speed_ms: float,
        is_day: bool,
        solar_radiation_w_m2: Optional[float] = None
    ) -> StabilityClass:
        """
        Determines Pasquill-Gifford atmospheric stability class (A-F) based on
        surface wind speed at 10m and incoming daytime solar insolation or nighttime radiative cooling.
        """
        u = max(0.1, wind_speed_ms)

        if is_day:
            radiation = solar_radiation_w_m2 if solar_radiation_w_m2 is not None else 500.0
            if radiation >= 600.0:
                # Strong Daytime Solar Insolation
                if u < 2.0:
                    return StabilityClass.A
                elif u < 3.0:
                    return StabilityClass.A  # A-B conservative
                elif u < 5.0:
                    return StabilityClass.B
                else:
                    return StabilityClass.C
            elif radiation >= 300.0:
                # Moderate Daytime Solar Insolation
                if u < 2.0:
                    return StabilityClass.B
                elif u < 5.0:
                    return StabilityClass.B  # B-C
                else:
                    return StabilityClass.C
            else:
                # Slight Daytime Insolation (Overcast or Winter Smog haze)
                if u < 2.0:
                    return StabilityClass.B
                elif u < 5.0:
                    return StabilityClass.C
                else:
                    return StabilityClass.D
        else:
            # Nighttime Radiative Cooling
            if u < 2.0:
                return StabilityClass.F  # Extremely stable, severe inversion trapping
            elif u < 3.0:
                return StabilityClass.E
            elif u < 5.0:
                return StabilityClass.D
            else:
                return StabilityClass.D  # High mechanical turbulence neutralizes

    def estimate_friction_velocity(
        self,
        wind_speed_ms: float,
        terrain: TerrainCategory
    ) -> float:
        """
        Estimates surface friction velocity u* (m/s) using the logarithmic wind profile:
        u* = (kappa * u10) / ln(10 / z0) where kappa = 0.40 (von Karman constant).
        """
        z0 = ROUGHNESS_LENGTHS.get(terrain, 0.40)
        kappa = 0.40
        ratio = max(1.1, 10.0 / z0)
        u_star = (kappa * max(0.2, wind_speed_ms)) / math.log(ratio)
        return round(u_star, 3)

    def identify_closest_city(self, lat: float, lon: float) -> CityMetadata:
        """Finds closest regional archetype by Euclidean distance."""
        best_city = None
        min_dist_sq = float("inf")
        for city in REGIONAL_ARCHETYPES.values():
            d2 = (city.center["lat"] - lat) ** 2 + (city.center["lon"] - lon) ** 2
            if d2 < min_dist_sq:
                min_dist_sq = d2
                best_city = city
        return best_city or REGIONAL_ARCHETYPES["delhi_ncr"]

    def generate_regional_fallback(
        self,
        lat: float,
        lon: float,
        city_id: Optional[str] = None
    ) -> WeatherTelemetry:
        """
        Synthesizes physically coherent microclimate parameters when external APIs
        are unreachable or rate-limited. Essential for air-gapped / offline deployments.
        """
        matched_city = None
        if city_id and city_id.lower() in REGIONAL_ARCHETYPES:
            matched_city = REGIONAL_ARCHETYPES[city_id.lower()]
        else:
            matched_city = self.identify_closest_city(lat, lon)

        # Region-specific meteorological parameters reflecting Indian climatology
        archetype_params = {
            "delhi_ncr": {
                "wind_speed_kmh": 14.5,
                "wind_dir": 285.0,  # North-westerly winter advection
                "temp_c": 29.5,
                "rh": 56.0,
                "pbl_m": 480.0,     # Strong capping inversion
                "terrain": TerrainCategory.URBAN,
            },
            "bengaluru": {
                "wind_speed_kmh": 16.0,
                "wind_dir": 240.0,  # South-westerly breeze
                "temp_c": 25.5,
                "rh": 64.0,
                "pbl_m": 850.0,
                "terrain": TerrainCategory.URBAN,
            },
            "kanpur": {
                "wind_speed_kmh": 11.0,
                "wind_dir": 295.0,
                "temp_c": 31.0,
                "rh": 60.0,
                "pbl_m": 520.0,
                "terrain": TerrainCategory.URBAN,
            },
            "mumbai": {
                "wind_speed_kmh": 18.0,
                "wind_dir": 260.0,  # Marine onshore breeze
                "temp_c": 32.0,
                "rh": 76.0,
                "pbl_m": 650.0,
                "terrain": TerrainCategory.COASTAL,
            },
            "punjab": {
                "wind_speed_kmh": 13.0,
                "wind_dir": 315.0,  # Post-monsoon stubble advection corridor
                "temp_c": 28.0,
                "rh": 52.0,
                "pbl_m": 580.0,
                "terrain": TerrainCategory.RURAL_OPEN,
            },
        }

        cfg = archetype_params.get(matched_city.id, archetype_params["delhi_ncr"])
        u_ms = cfg["wind_speed_kmh"] / 3.6
        downwind_bearing = self.compute_downwind_bearing(cfg["wind_dir"])
        stab = self.determine_stability_class(u_ms, is_day=True, solar_radiation_w_m2=450.0)
        u_star = self.estimate_friction_velocity(u_ms, cfg["terrain"])

        return WeatherTelemetry(
            latitude=lat,
            longitude=lon,
            wind_speed_kmh=cfg["wind_speed_kmh"],
            wind_speed_ms=round(u_ms, 2),
            wind_direction_deg=cfg["wind_dir"],
            downwind_bearing_deg=downwind_bearing,
            temperature_c=cfg["temp_c"],
            temperature_k=round(cfg["temp_c"] + 273.15, 2),
            humidity_pct=cfg["rh"],
            planetary_boundary_layer_height_m=cfg["pbl_m"],
            surface_pressure_hpa=1011.0,
            solar_radiation_w_m2=450.0,
            is_day=True,
            stability_class=stab,
            terrain=cfg["terrain"],
            friction_velocity_u_star_ms=u_star,
            source_attribution=f"REGIONAL_ARCHETYPE_FALLBACK_{matched_city.id.upper()}",
        )

    async def get_live_weather(
        self,
        lat: float,
        lon: float,
        city_id: Optional[str] = None
    ) -> WeatherTelemetry:
        """
        Fetches live boundary layer and vector wind telemetry from Open-Meteo.
        Automatically falls back to regional microclimate archetypes on error or timeout.
        """
        params = {
            "latitude": lat,
            "longitude": lon,
            "current": [
                "temperature_2m",
                "relative_humidity_2m",
                "surface_pressure",
                "wind_speed_10m",
                "wind_direction_10m",
                "is_day",
                "direct_normal_irradiance",
                "diffuse_radiation",
                "shortwave_radiation",
            ],
            "hourly": ["boundary_layer_height"],
            "forecast_days": 1,
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
                resp = await client.get(self.open_meteo_url, params=params)

            if resp.status_code != 200:
                logger.warning(
                    f"Open-Meteo API returned status {resp.status_code}. Using regional fallback."
                )
                return self.generate_regional_fallback(lat, lon, city_id)

            data = resp.json()
            current = data.get("current", {})

            temp_c = float(current.get("temperature_2m", 28.0))
            rh = float(current.get("relative_humidity_2m", 55.0))
            pressure = float(current.get("surface_pressure", 1013.25))
            wind_speed_kmh = float(current.get("wind_speed_10m", 12.0))
            wind_dir = float(current.get("wind_direction_10m", 270.0))
            is_day_val = bool(current.get("is_day", 1))

            # Solar radiation extraction
            solar_rad = current.get("shortwave_radiation")
            if solar_rad is None:
                solar_rad = 500.0 if is_day_val else 0.0
            else:
                solar_rad = float(solar_rad)

            # Boundary layer height from hourly current index or fallback
            hourly = data.get("hourly", {})
            blh_list = hourly.get("boundary_layer_height", [])
            pbl_height = 800.0
            if blh_list and len(blh_list) > 0:
                # Pick middle or current hour
                pbl_height = float(blh_list[0])
            if pbl_height < 100.0:
                pbl_height = 450.0  # Physical minimum for Indian urban conditions

            u_ms = wind_speed_kmh / 3.6
            downwind_bearing = self.compute_downwind_bearing(wind_dir)
            stab = self.determine_stability_class(
                wind_speed_ms=u_ms,
                is_day=is_day_val,
                solar_radiation_w_m2=solar_rad,
            )

            matched_city = (
                REGIONAL_ARCHETYPES.get(city_id.lower())
                if city_id and city_id.lower() in REGIONAL_ARCHETYPES
                else self.identify_closest_city(lat, lon)
            )
            terrain = matched_city.terrain if matched_city else TerrainCategory.URBAN
            u_star = self.estimate_friction_velocity(u_ms, terrain)

            return WeatherTelemetry(
                latitude=lat,
                longitude=lon,
                wind_speed_kmh=round(wind_speed_kmh, 2),
                wind_speed_ms=round(u_ms, 2),
                wind_direction_deg=round(wind_dir, 2),
                downwind_bearing_deg=downwind_bearing,
                temperature_c=round(temp_c, 2),
                temperature_k=round(temp_c + 273.15, 2),
                humidity_pct=round(rh, 2),
                planetary_boundary_layer_height_m=round(pbl_height, 1),
                surface_pressure_hpa=round(pressure, 2),
                solar_radiation_w_m2=round(solar_rad, 1),
                is_day=is_day_val,
                stability_class=stab,
                terrain=terrain,
                friction_velocity_u_star_ms=u_star,
                source_attribution="OPEN_METEO_LIVE",
            )

        except Exception as exc:
            logger.warning(
                f"Exception during Open-Meteo telemetry fetch ({exc}). Using regional fallback."
            )
            return self.generate_regional_fallback(lat, lon, city_id)

    @staticmethod
    def get_supported_cities() -> List[CityMetadata]:
        """Returns the catalog of configured flagship cities."""
        return list(REGIONAL_ARCHETYPES.values())
