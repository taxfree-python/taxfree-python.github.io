import { describe, expect, it } from 'vitest';
import { approxTextWidth, axes, formatCount, formatPercent } from './chart';

describe('2026-09-19 chart helpers', () => {
  it('places the plot box inside the given margins', () => {
    expect(axes(800, 300, { left: 52, right: 14, top: 44, bottom: 54 })).toEqual({ left: 52, right: 786, top: 44, bottom: 246 });
  });

  it('formats counts and percentages for labels', () => {
    expect(formatCount(1273)).toBe('1,273');
    expect(formatPercent(0.8845)).toBe('88.5');
    expect(formatPercent(0.5, 0)).toBe('50');
  });

  it('estimates label widths for legend layout', () => {
    expect(approxTextWidth('chance level', 13)).toBeCloseTo(81.12);
  });
});
