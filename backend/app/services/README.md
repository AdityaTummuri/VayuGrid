# VayuGrid Core Computational Services

This directory contains the computational core of the VayuGrid atmospheric modeling platform:
1. `dispersion_engine.py` — Vectorized Atmospheric Dispersion and Transient Puff Simulation Engine.
2. `weather_service.py` — Micro-Meteorological Telemetry Ingestion, Stability Estimation, and Regional Fallback Engine.

---

## 1. `dispersion_engine.py`

### Key Class: `DispersionEngine`

#### Core Methods:
* `calculate_emission_rate_q(...) -> float`: Computes source mass emission rate $Q$ ($g/s$) from source classification, severity score ($0.0 \dots 1.0$), and fire footprint radius.
* `compute_wind_at_height(...) -> float`: Evaluates the Deacon/Irwin power-law wind shear profile $u(z) = u_{10}(z/10)^p$ with stability-calibrated exponents.
* `compute_briggs_plume_rise(...) -> Tuple[float, float, float]`: Computes convective thermal buoyancy flux $F_b$, momentum flux $F_m$, and effective plume rise $\Delta H$ across neutral, unstable, and stable nocturnal inversions.
* `evaluate_dispersion_coefficients(...) -> Tuple[np.ndarray, np.ndarray]`: Evaluates continuous rational Briggs formulas for horizontal ($\sigma_y(x)$) and vertical ($\sigma_z(x)$) dispersion across all 6 Pasquill-Gifford stability classes (A through F) in Urban and Rural terrains.
* `evaluate_vertical_reflection(...) -> np.ndarray`: Implements the 5-term method-of-images formulation ($n \in [-2, 2]$) for ground and capping inversion reflection, transitioning to uniform vertical mixing ($\sigma_z \ge 1.6 z_i$).
* `compute_steady_state_concentration(...) -> np.ndarray`: Vectorized Gaussian plume concentration evaluation at ground or receptor inhalation height ($z = 1.5\text{ m}$).
* `extract_isopleth_contours(...) -> List[IsoplethContour]`: Analytically inverts the Gaussian distribution to extract lateral half-widths $y_{half}(x)$ for regulatory concentration tiers (`HAZARDOUS`, `SEVERE`, `MODERATE`, `ADVISORY`).
* `simulate_transient_puffs(...) -> Tuple[List[PuffSnapshot], List[TimeSeriesSnapshot]]`: Models non-stationary Lagrangian Gaussian puff advection tracking advancing smoke fronts at $5, 15, 30, \text{and } 60$ minutes.
* `evaluate_receptor_impacts(...) -> List[ImpactedReceptor]`: Evaluates spatial downwind/crosswind proximity and arrival countdown timers for sensitive infrastructure.
* `run_simulation(...) -> DispersionSimulationResult`: High-level entrypoint orchestrating the complete end-to-end simulation in $< 15\text{ ms}$.

---

## 2. `weather_service.py`

### Key Class: `WeatherService`

#### Core Methods:
* `compute_downwind_bearing(wind_direction_deg) -> float`: Calculates the advective downwind vector direction $(wind\_dir + 180^\circ) \pmod{360^\circ}$.
* `determine_stability_class(wind_speed_ms, is_day, solar_radiation_w_m2) -> StabilityClass`: Classifies atmospheric stability into Pasquill-Gifford classes A through F based on 10m wind speed and daytime insolation or nocturnal radiative cooling.
* `estimate_friction_velocity(wind_speed_ms, terrain) -> float`: Evaluates surface friction velocity $u_* = (\kappa \cdot u_{10}) / \ln(10 / z_0)$ using aerodynamic roughness lengths.
* `generate_regional_fallback(lat, lon, city_id) -> WeatherTelemetry`: Generates physically coherent microclimates for Delhi-NCR, Bengaluru, Kanpur, Mumbai, and Punjab during offline or air-gapped operations.
* `get_live_weather(lat, lon, city_id) -> WeatherTelemetry`: Ingests live boundary layer height and wind telemetry from the Open-Meteo forecast API with automated fallback handling.
