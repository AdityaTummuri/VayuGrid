"""
VayuGrid Pydantic Models for Physical Dispersion Simulation.
Defines schemas for Gaussian Steady-State, Transient Puff Advection,
Isopleth Contours, and Critical Receptor Impacts.
"""

from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class EmissionSourceType(str, Enum):
    """Categorization of environmental pollution emission sources."""
    OPEN_MUNICIPAL_WASTE_BURNING = "OPEN_MUNICIPAL_WASTE_BURNING"
    CONSTRUCTION_DUST_SUSPENSION = "CONSTRUCTION_DUST_SUSPENSION"
    INDUSTRIAL_STACK_EMISSION = "INDUSTRIAL_STACK_EMISSION"
    AGRICULTURAL_BIOMASS_BURNING = "AGRICULTURAL_BIOMASS_BURNING"
    TRAFFIC_CORRIDOR_EXHAUST = "TRAFFIC_CORRIDOR_EXHAUST"
    ROAD_RESUSPENSION = "ROAD_RESUSPENSION"
    GENERIC_POINT_SOURCE = "GENERIC_POINT_SOURCE"


class HazardLevel(str, Enum):
    """Statutory Air Quality impact severity tiers based on CPCB / WHO guidelines."""
    HAZARDOUS = "HAZARDOUS"      # Critical emergency (> 250 µg/m³ PM2.5 / equivalent)
    SEVERE = "SEVERE"            # Actionable threat (> 120 µg/m³)
    MODERATE = "MODERATE"        # Unhealthy for sensitive groups (> 60 µg/m³)
    ADVISORY = "ADVISORY"        # Detectable perimeter corridor (> 25 µg/m³)


class GeoPoint(BaseModel):
    """Geographic point with latitude and longitude."""
    lat: float = Field(..., description="Latitude in decimal degrees", ge=-90.0, le=90.0)
    lon: float = Field(..., description="Longitude in decimal degrees", ge=-180.0, le=180.0)


class PlumeDynamics(BaseModel):
    """Physical plume dynamics derived from Briggs formulations."""
    physical_stack_height_m: float = Field(..., description="Physical height of release (m)")
    buoyancy_flux_m4_s3: float = Field(..., description="Briggs buoyancy flux Fb (m^4/s^3)")
    momentum_flux_m4_s2: float = Field(..., description="Briggs momentum flux Fm (m^4/s^2)")
    plume_rise_delta_h_m: float = Field(..., description="Computed thermal/momentum plume rise ΔH (m)")
    effective_release_height_m: float = Field(..., description="Effective emission height Heff = Hs + ΔH (m)")
    effective_wind_speed_ms: float = Field(..., description="Wind speed evaluated at effective release height (m/s)")
    stability_class: str = Field(..., description="Atmospheric stability category (A through F)")
    mixing_height_capping_m: float = Field(..., description="Planetary Boundary Layer capping lid (m)")
    inversion_reflection_active: bool = Field(..., description="True if ground-lid multi-reflection is evaluated")


class IsoplethContour(BaseModel):
    """Iso-concentration aerodynamic boundary polygon representing a hazard threshold."""
    tier: HazardLevel = Field(..., description="Hazard severity tier")
    threshold_ug_m3: float = Field(..., description="Concentration threshold value (µg/m³)")
    area_sq_km: float = Field(..., description="Surface area bounded by contour in square kilometers")
    max_downwind_reach_km: float = Field(..., description="Maximum downwind distance reached by this contour (km)")
    max_lateral_width_m: float = Field(..., description="Maximum crosswind lateral spread width (meters)")
    boundary_polygon: List[GeoPoint] = Field(..., description="Ordered polygon vertices enclosing this isopleth")


class PuffSnapshot(BaseModel):
    """Discrete Lagrangian puff state for transient time-stepping simulation."""
    puff_id: int = Field(..., description="Sequential puff identification index")
    age_seconds: float = Field(..., description="Elapsed time since puff emission (seconds)")
    center: GeoPoint = Field(..., description="Current centroid latitude and longitude")
    downwind_distance_m: float = Field(..., description="Distance travelled along downwind vector (meters)")
    sigma_horizontal_m: float = Field(..., description="Horizontal dispersion radius σx = σy (meters)")
    sigma_vertical_m: float = Field(..., description="Vertical dispersion radius σz (meters)")
    peak_concentration_ug_m3: float = Field(..., description="Concentration at puff centroid (µg/m³)")


class TimeSeriesSnapshot(BaseModel):
    """Simulation state at a specific elapsed duration."""
    elapsed_minutes: int = Field(..., description="Elapsed duration from start of release (minutes)")
    leading_edge_distance_km: float = Field(..., description="Distance reached by smoke front (km)")
    active_puffs_count: int = Field(..., description="Number of active tracking particles/puffs")
    perimeter_polygon: List[GeoPoint] = Field(..., description="Envelope of the advancing plume at this timestamp")


class ImpactedReceptor(BaseModel):
    """Vulnerable community or urban asset intersecting the modeled hazard corridor."""
    id: str = Field(..., description="Unique infrastructure asset identifier")
    name: str = Field(..., description="Official name of facility / ward")
    category: str = Field(..., description="Receptor type (e.g., EDUCATION_FACILITY, HEALTHCARE_FACILITY, RESIDENTIAL)")
    lat: float = Field(..., description="Receptor latitude")
    lon: float = Field(..., description="Receptor longitude")
    distance_meters: float = Field(..., description="Direct distance from emission origin (meters)")
    downwind_distance_meters: float = Field(..., description="Distance along plume centerline (meters)")
    crosswind_offset_meters: float = Field(..., description="Orthogonal offset from plume centerline (meters)")
    estimated_arrival_minutes: int = Field(..., description="Estimated time until leading edge arrival (minutes)")
    modeled_concentration_ug_m3: float = Field(..., description="Peak ground-level modeled concentration at receptor (µg/m³)")
    hazard_level: HazardLevel = Field(..., description="Severity classification at receptor location")
    vulnerable_population_estimate: int = Field(..., description="Estimated individuals at risk")


class DownwindExposureCone(BaseModel):
    """
    Backwards-compatible legacy exposure representation.
    Ensures existing UI clients and integration points continue operating seamlessly.
    """
    bearing_degrees: float = Field(..., description="Downwind travel bearing (degrees)")
    max_reach_km: float = Field(..., description="Maximum distance reached by advisory boundary (km)")
    angular_spread_deg: float = Field(..., description="Effective lateral angular spread angle (degrees)")
    boundary_polygon: List[Dict[str, float]] = Field(..., description="Polygon coordinates [{'lat': ..., 'lon': ...}]")


class SimulationParameters(BaseModel):
    """Input configuration for running an atmospheric dispersion simulation."""
    origin_lat: float = Field(..., ge=-90.0, le=90.0)
    origin_lon: float = Field(..., ge=-180.0, le=180.0)
    source_type: EmissionSourceType = Field(EmissionSourceType.OPEN_MUNICIPAL_WASTE_BURNING)
    severity_score: float = Field(0.8, ge=0.0, le=1.0, description="Severity rating from Gemini Forensics")
    smoke_opacity: float = Field(0.7, ge=0.0, le=1.0, description="Optical opacity index")
    origin_radius_meters: float = Field(15.0, ge=1.0, le=500.0, description="Estimated emission footprint radius")
    physical_stack_height_m: Optional[float] = Field(None, description="Release height in meters (defaults based on source)")
    source_temperature_k: Optional[float] = Field(None, description="Combustion / flue temperature in Kelvin")
    simulation_duration_minutes: int = Field(60, ge=5, le=360, description="Duration for transient puff advection")
    grid_resolution_meters: float = Field(50.0, ge=10.0, le=250.0, description="Spatial mesh step for weak PC efficiency")


class DispersionSimulationResult(BaseModel):
    """Complete physical dispersion simulation output."""
    simulation_id: str = Field(..., description="Unique simulation execution identifier")
    timestamp: str = Field(..., description="ISO 8601 execution timestamp")
    source_parameters: Dict[str, Any] = Field(..., description="Echo of input parameters and emission rates")
    plume_dynamics: PlumeDynamics = Field(..., description="Briggs effective rise and boundary layer diagnostics")
    max_ground_concentration_ug_m3: float = Field(..., description="Maximum ground-level concentration at receptor height (µg/m³)")
    distance_of_max_ground_concentration_m: float = Field(..., description="Distance downwind where maximum ground concentration occurs (m)")
    downwind_reach_km: float = Field(..., description="Maximum reach of detectable plume (km)")
    downwind_exposure_cone: DownwindExposureCone = Field(
        ...,
        description="Backwards-compatible envelope polygon for legacy Map layers"
    )
    isopleth_contours: List[IsoplethContour] = Field(
        ...,
        description="Multi-tier statutory concentration isopleths (Hazardous, Severe, Moderate, Advisory)"
    )
    time_series_snapshots: List[TimeSeriesSnapshot] = Field(
        ...,
        description="Transient advection time-steps showing plume front progression"
    )
    puff_sample: List[PuffSnapshot] = Field(
        ...,
        description="Sample active Lagrangian puffs for lightweight particle visualization"
    )
    impacted_infrastructure: List[ImpactedReceptor] = Field(
        ...,
        description="Receptors intersected by hazardous or advisory plume boundaries"
    )
    execution_time_ms: float = Field(..., description="Computational latency in milliseconds (proves weak PC optimization)")
