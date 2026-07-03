import { describe, expect, it } from 'vitest';

import { validateActivity } from '@/lib/activities';

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
        description: 'Applied R&D',
        category: 'work',
      }),
    ).toEqual({
      id: 'layerx-ai-workforce-intern',
      title: 'LayerX Ai Workforce R&D Intern',
      period: {
        start: { year: 2026, month: 1 },
      },
      description: 'Applied R&D',
      category: 'work',
    });
  });

  it('rejects unknown categories', () => {
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
});
