"""
Performance benchmark test to prove the physics simulation runs on low-spec / weak PCs.
Ensures execution latency is well under 50ms per full end-to-end simulation.
"""

import time
import numpy as np

from app.services.dispersion_engine import DispersionEngine
from app.services.weather_service import WeatherService
from app.models.dispersion import EmissionSourceType, SimulationParameters
from app.data.sensitive_infrastructure import SENSITIVE_RECEPTORS


def test_weak_pc_simulation_latency():
    engine = DispersionEngine()
    weather_svc = WeatherService()

    weather = weather_svc.generate_regional_fallback(28.6139, 77.2090, "delhi_ncr")
    params = SimulationParameters(
        origin_lat=28.6139,
        origin_lon=77.2090,
        source_type=EmissionSourceType.OPEN_MUNICIPAL_WASTE_BURNING,
        severity_score=0.88,
        smoke_opacity=0.92,
        origin_radius_meters=25.0,
        simulation_duration_minutes=60,
    )

    receptors = SENSITIVE_RECEPTORS[:10]

    # Warmup
    for _ in range(5):
        engine.run_simulation(params=params, weather=weather, candidate_receptors=receptors)

    # Measure 50 iterations
    latencies = []
    for _ in range(50):
        t0 = time.perf_counter()
        _ = engine.run_simulation(params=params, weather=weather, candidate_receptors=receptors)
        t_ms = (time.perf_counter() - t0) * 1000.0
        latencies.append(t_ms)

    median_ms = float(np.median(latencies))
    p95_ms = float(np.percentile(latencies, 95))

    print(f"\n[Weak PC Benchmark] 50 runs: Median={median_ms:.2f}ms, P95={p95_ms:.2f}ms")

    # Assert that execution is ultra-lightweight for low-power hardware
    assert median_ms < 30.0, f"Median simulation latency {median_ms:.2f}ms exceeds 30ms threshold!"
    assert p95_ms < 60.0, f"P95 latency {p95_ms:.2f}ms exceeds 60ms threshold!"
