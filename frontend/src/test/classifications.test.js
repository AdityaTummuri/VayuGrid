import { describe, it, expect } from 'vitest';
import { getAqiTier, CPCB_AQI_TIERS, LANGUAGE_META } from '../constants/classifications';

describe('CPCB NAQI Classifications & Standards', () => {
  it('correctly classifies Good AQI (0-50)', () => {
    const tier = getAqiTier(35);
    expect(tier.label).toBe('Good');
    expect(tier.color).toBe(CPCB_AQI_TIERS.GOOD.color);
  });

  it('correctly classifies Moderate AQI (101-200)', () => {
    const tier = getAqiTier(118);
    expect(tier.label).toBe('Moderate');
    expect(tier.color).toBe(CPCB_AQI_TIERS.MODERATE.color);
  });

  it('correctly classifies Very Poor AQI (301-400)', () => {
    const tier = getAqiTier(342);
    expect(tier.label).toBe('Very Poor');
    expect(tier.color).toBe(CPCB_AQI_TIERS.VERY_POOR.color);
  });

  it('correctly classifies Severe AQI (401-500+)', () => {
    const tier = getAqiTier(450);
    expect(tier.label).toBe('Severe');
    expect(tier.color).toBe(CPCB_AQI_TIERS.SEVERE.color);
  });

  it('handles negative or out of bound values gracefully', () => {
    const tierLow = getAqiTier(-10);
    expect(tierLow.label).toBe('Good');
    const tierHigh = getAqiTier(999);
    expect(tierHigh.label).toBe('Severe');
  });

  it('verifies statutory multi-lingual language codes', () => {
    const codes = LANGUAGE_META.map((l) => l.code);
    expect(codes).toContain('hi');
    expect(codes).toContain('en');
    expect(codes).toContain('kn');
    expect(codes).toContain('pa');
    expect(codes).toContain('mr');
    expect(codes).toContain('te');
    expect(codes).toContain('ta');
  });
});
