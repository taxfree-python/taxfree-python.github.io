import { describe, expect, it } from 'vitest';

import {
  formatActivityPeriodParts,
  getActivityPeriodEndValue,
  validateActivity,
  validateActivityDate,
} from '@/lib/activityPeriod';

describe('activity period validation', () => {
  it('normalizes a valid activity from unknown input', () => {
    expect(
      validateActivity({
        id: 'layerx-ai-workforce-intern',
        title: 'LayerX Ai Workforce R&D Intern',
        period: {
          start: { year: 2026, month: 1 },
          end: null,
        },
        description: 'Applied R&D',
        category: 'work',
      }),
    ).toEqual({
      id: 'layerx-ai-workforce-intern',
      title: 'LayerX Ai Workforce R&D Intern',
      period: {
        start: { year: 2026, month: 1 },
        end: null,
      },
      description: 'Applied R&D',
      category: 'work',
    });
  });

  it('rejects invalid calendar fields and categories', () => {
    expect(() => validateActivityDate({ year: 2026, month: 13 }, 'activity.start')).toThrow(
      'activity.start.month must be between 1 and 12',
    );

    expect(() =>
      validateActivity({
        id: 'invalid',
        title: 'Invalid',
        period: { start: { year: 2026 } },
        description: 'Invalid',
        category: 'volunteer',
      }),
    ).toThrow('Activity(invalid).category must be one of: work, research, others');
  });

  it('formats and sorts open-ended periods as current', () => {
    const activity = validateActivity({
      id: 'current',
      title: 'Current',
      period: { start: { year: 2025, month: 9 }, end: null },
      description: 'Current role',
      category: 'work',
    });

    expect(formatActivityPeriodParts(activity.period)).toEqual({
      start: '2025/09',
      end: 'Present',
    });
    expect(getActivityPeriodEndValue(activity.period)).toBe(Number.POSITIVE_INFINITY);
  });
});
