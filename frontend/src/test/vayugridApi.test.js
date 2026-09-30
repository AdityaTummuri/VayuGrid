import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchCities, fetchActiveIncidents, fetchWeatherTelemetry } from '../api/vayugridApi';

describe('VayuGrid Frontend API Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches cities and guarantees normalized coordinates', async () => {
    const cities = await fetchCities();
    expect(cities.length).toBeGreaterThanOrEqual(5);

    cities.forEach((city) => {
      expect(city).toHaveProperty('id');
      expect(city).toHaveProperty('name');
      expect(city.center).toHaveProperty('lat');
      expect(city.center).toHaveProperty('lng');
      expect(typeof city.center.lat).toBe('number');
      expect(typeof city.center.lng).toBe('number');
      expect(city).toHaveProperty('current_aqi');
    });
  });

  it('generates incidents centered on the selected city (Bengaluru)', async () => {
    const incidents = await fetchActiveIncidents('bengaluru');
    expect(incidents.length).toBeGreaterThan(0);
    
    // Bengaluru latitude is ~12.97
    const firstInc = incidents[0];
    expect(firstInc.city_id).toBe('bengaluru');
    expect(firstInc.location.lat).toBeGreaterThan(12.0);
    expect(firstInc.location.lat).toBeLessThan(14.0);
    expect(firstInc.location.lng).toBeGreaterThan(76.0);
    expect(firstInc.location.lng).toBeLessThan(79.0);
  });

  it('generates incidents centered on Delhi for delhi_ncr alias', async () => {
    const incidents = await fetchActiveIncidents('delhi_ncr');
    expect(incidents.length).toBeGreaterThan(0);
    
    // Delhi latitude is ~28.6
    const firstInc = incidents[0];
    expect(firstInc.location.lat).toBeGreaterThan(28.0);
    expect(firstInc.location.lat).toBeLessThan(29.5);
  });

  it('provides safe fallback telemetry on weather service failure', async () => {
    // Force a fetch failure
    globalThis.fetch = vi.fn().mockRejectedValueOnce(new Error('Network offline'));
    const weather = await fetchWeatherTelemetry(28.6139, 77.2090);
    expect(weather).toHaveProperty('wind_bearing_deg');
    expect(weather).toHaveProperty('wind_direction');
    expect(weather).toHaveProperty('wind_speed_mps');
  });
});
