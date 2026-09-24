import { describe, expect, it } from 'vitest';

import { getActivities, validateActivity } from '@/lib/activities';

describe('validateActivity', () => {
  it('normalizes a valid activity from unknown input', () => {
    expect(
      validateActivity({
        id: 'layerx-ai-workforce-intern',
        title: 'LayerX Ai Workforce R&D Intern',
        period: {
          start: { year: 2026, month: 1 },
          end: null,
        },
        category: 'work',
      }),
    ).toEqual({
      id: 'layerx-ai-workforce-intern',
      title: 'LayerX Ai Workforce R&D Intern',
      period: {
        start: { year: 2026, month: 1 },
      },
      category: 'work',
    });
  });

  it('rejects unknown categories', () => {
    expect(() =>
      validateActivity({
        id: 'invalid',
        title: 'Invalid',
        period: { start: { year: 2026 } },
        category: 'others',
      }),
    ).toThrow('Activity(invalid).category must be one of: work, research, community');
  });
});

describe('getActivities', () => {
  it('reads the real activities data without throwing', () => {
    expect(getActivities().length).toBeGreaterThan(0);
  });
});
