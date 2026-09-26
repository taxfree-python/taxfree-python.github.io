import { describe, expect, it } from 'vitest';
import { approxTextWidth, axes, formatCount, formatPercent, niceMax, ticksTo } from './chart';

describe('2026-09-19 chart helpers', () => {
  it('rounds axis maxima up to readable values', () => {
    expect(niceMax(890)).toBe(900);
    expect(niceMax(7520)).toBe(8000);
    expect(niceMax(206)).toBe(250);
    expect(niceMax(72)).toBe(80);
    expect(niceMax(49.1)).toBe(50);
    expect(niceMax(100)).toBe(100);
    expect(niceMax(0)).toBe(1);
  });

  it('divides an axis into evenly spaced ticks', () => {
    expect(ticksTo(50, 5)).toEqual([0, 10, 20, 30, 40, 50]);
    expect(ticksTo(900, 2)).toEqual([0, 450, 900]);
  });

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
