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
        details: ['Prototyped workflow generation'],
      }),
    ).toEqual({
      id: 'layerx-ai-workforce-intern',
      title: 'LayerX Ai Workforce R&D Intern',
      period: {
        start: { year: 2026, month: 1 },
      },
      category: 'work',
      details: ['Prototyped workflow generation'],
    });
  });

  it('accepts the education category and an empty details list', () => {
    expect(
      validateActivity({
        id: 'degree',
        title: 'Degree',
        period: { start: { year: 2022, month: 4 } },
        category: 'education',
        details: [],
      }).details,
    ).toEqual([]);
  });

  it('rejects missing or non-string details', () => {
    const base = { id: 'bad', title: 'Bad', period: { start: { year: 2026 } }, category: 'work' };
    expect(() => validateActivity(base)).toThrow('Activity(bad).details must be an array');
    expect(() => validateActivity({ ...base, details: [1] })).toThrow(
      'Activity(bad).details[0] must be a string',
    );
  });

  it('rejects unknown categories', () => {
    expect(() =>
      validateActivity({
        id: 'invalid',
        title: 'Invalid',
        period: { start: { year: 2026 } },
        category: 'others',
        details: [],
      }),
    ).toThrow('Activity(invalid).category must be one of: education, work, research, community');
  });
});

describe('getActivities', () => {
  it('reads the real activities data without throwing', () => {
    expect(getActivities().length).toBeGreaterThan(0);
  });
});
