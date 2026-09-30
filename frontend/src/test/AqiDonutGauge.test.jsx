import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AqiDonutGauge } from '../components/charts/AqiDonutGauge';

describe('AqiDonutGauge Component', () => {
  it('renders with accessibility meter role and attributes', () => {
    render(<AqiDonutGauge value={342} size={200} title="LIVE TEST" />);
    const meter = screen.getByRole('meter');
    expect(meter).toBeInTheDocument();
    expect(meter).toHaveAttribute('aria-valuenow', '342');
    expect(meter).toHaveAttribute('aria-valuemin', '0');
    expect(meter).toHaveAttribute('aria-valuemax', '500');
  });

  it('displays the title and statutory tier badge', () => {
    render(<AqiDonutGauge value={118} size={200} title="BENGALURU AQI" />);
    expect(screen.getByText('BENGALURU AQI')).toBeInTheDocument();
    expect(screen.getByText('Moderate')).toBeInTheDocument();
  });

  it('renders successfully with default fallback on undefined value', () => {
    render(<AqiDonutGauge value={undefined} />);
    const meter = screen.getByRole('meter');
    expect(meter).toBeInTheDocument();
    expect(meter).toHaveAttribute('aria-valuenow', '342');
  });
});
