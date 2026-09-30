import { describe, it, expect } from 'vitest';
import { getCityBroadcastData, CITY_BROADCAST_CONFIG } from '../constants/cityBroadcasts';

describe('City-Matched Vernacular Broadcast Registry', () => {
  it('correctly associates Bengaluru with Kannada and Bellandur landmarks', () => {
    const blr = getCityBroadcastData('bengaluru');
    expect(blr.primaryLanguage).toBe('kn');
    expect(blr.hotspots).toContain('Bellandur Wetland Buffer');
    expect(blr.scenarios).toHaveLength(3);

    // Verify Kannada text exists
    const incidentScenario = blr.scenarios.find((s) => s.id === 'incident');
    expect(incidentScenario.texts.kn).toContain('ಬೆಳ್ಳಂದೂರು');
    expect(incidentScenario.texts.en).toContain('Bellandur');
  });

  it('correctly associates Delhi with Hindi and Bhalaswa landmarks', () => {
    const del = getCityBroadcastData('delhi');
    expect(del.primaryLanguage).toBe('hi');
    expect(del.hotspots).toContain('Bhalaswa Landfill Fringe');
    
    const incidentScenario = del.scenarios.find((s) => s.id === 'incident');
    expect(incidentScenario.texts.hi).toContain('भलस्वा');
  });

  it('correctly associates Punjab with Punjabi and Sangrur agrarian landmarks', () => {
    const pjb = getCityBroadcastData('punjab');
    expect(pjb.primaryLanguage).toBe('pa');
    expect(pjb.hotspots).toContain('Sangrur Agrarian Field Belt');
    
    const incidentScenario = pjb.scenarios.find((s) => s.id === 'incident');
    expect(incidentScenario.texts.pa).toContain('ਸੰਗਰੂਰ');
  });

  it('correctly associates Mumbai with Marathi and BKC/Chembur landmarks', () => {
    const mum = getCityBroadcastData('mumbai');
    expect(mum.primaryLanguage).toBe('mr');
    expect(mum.hotspots).toContain('Bandra-Kurla Complex (BKC)');

    const ambientScenario = mum.scenarios.find((s) => s.id === 'ambient');
    expect(ambientScenario.texts.mr).toContain('मुंबई');
  });

  it('defaults smoothly to Delhi config for unknown city IDs', () => {
    const unknown = getCityBroadcastData('atlantis');
    expect(unknown.primaryLanguage).toBe('hi');
  });
});
