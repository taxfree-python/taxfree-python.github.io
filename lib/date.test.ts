import { describe, expect, it } from 'vitest';

import {
  calendarPeriodEndValue,
  formatCalendarPeriod,
  validateCalendarDate,
  validateCalendarPeriod,
} from '@/lib/date';

describe('calendar date validation', () => {
  it('normalizes a date and drops null month/day', () => {
    expect(validateCalendarDate({ year: 2026, month: 1, day: null }, 'date')).toEqual({
      year: 2026,
      month: 1,
    });
  });

  it('rejects invalid calendar fields', () => {
    expect(() => validateCalendarDate({ year: 2026, month: 13 }, 'activity.start')).toThrow(
      'activity.start.month must be between 1 and 12',
    );
    expect(() => validateCalendarDate({ year: 2026, day: 0 }, 'date')).toThrow(
      'date.day must be between 1 and 31',
    );
  });
});

describe('calendar period validation', () => {
  it('treats an explicit null end as ongoing', () => {
    expect(
      validateCalendarPeriod({ start: { year: 2025, month: 9 }, end: null }, 'Activity(x)'),
    ).toEqual({ start: { year: 2025, month: 9 } });
  });

  it('rejects an end earlier than the start', () => {
    expect(() =>
      validateCalendarPeriod(
        { start: { year: 2026 }, end: { year: 2025 } },
        'Activity(x)',
      ),
    ).toThrow('Activity(x).period.end must not be earlier than Activity(x).period.start');
  });

  it('formats and sorts open-ended periods as current', () => {
    const period = validateCalendarPeriod(
      { start: { year: 2025, month: 9 }, end: null },
      'Activity(current)',
    );

    expect(formatCalendarPeriod(period)).toEqual({
      start: '2025/09',
      end: 'Present',
    });
    expect(calendarPeriodEndValue(period)).toBe(Number.POSITIVE_INFINITY);
  });
});
