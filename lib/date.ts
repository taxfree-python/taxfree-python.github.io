import type { CalendarDate, CalendarPeriod } from '@/types';
import { assert } from '@/lib/assert';
import { ensureObject, toNumber } from '@/lib/validation';

const MIN_MONTH = 1;
const MAX_MONTH = 12;
const MIN_DAY = 1;
const MAX_DAY = 31;

export const calendarDateValue = (date: CalendarDate): number => {
  const month = date.month ?? 1;
  const day = date.day ?? 1;
  return Date.UTC(date.year, month - 1, day);
};

const assertCalendarDateValid = (date: CalendarDate, context: string): void => {
  assert(Number.isInteger(date.year), `${context}.year must be an integer year`);
  assert(date.year >= 0, `${context}.year must be >= 0`);

  if (date.month !== undefined) {
    assert(Number.isInteger(date.month), `${context}.month must be an integer month`);
    assert(
      date.month >= MIN_MONTH && date.month <= MAX_MONTH,
      `${context}.month must be between ${MIN_MONTH} and ${MAX_MONTH}`,
    );
  }

  if (date.day !== undefined) {
    assert(Number.isInteger(date.day), `${context}.day must be an integer day`);
    assert(
      date.day >= MIN_DAY && date.day <= MAX_DAY,
      `${context}.day must be between ${MIN_DAY} and ${MAX_DAY}`,
    );
  }
};

export const validateCalendarDate = (raw: unknown, context: string): CalendarDate => {
  const obj = ensureObject(raw, context);

  const date: CalendarDate = { year: toNumber(obj.year, `${context}.year`) };
  if (obj.month !== undefined && obj.month !== null) {
    date.month = toNumber(obj.month, `${context}.month`);
  }
  if (obj.day !== undefined && obj.day !== null) {
    date.day = toNumber(obj.day, `${context}.day`);
  }

  assertCalendarDateValid(date, context);
  return date;
};

export const validateCalendarPeriod = (raw: unknown, context: string): CalendarPeriod => {
  const obj = ensureObject(raw, `${context}.period`);
  const start = validateCalendarDate(obj.start, `${context}.period.start`);

  // An absent or explicitly null end both mean "ongoing".
  if (obj.end === undefined || obj.end === null) {
    return { start };
  }

  const end = validateCalendarDate(obj.end, `${context}.period.end`);
  assert(
    calendarDateValue(end) >= calendarDateValue(start),
    `${context}.period.end must not be earlier than ${context}.period.start`,
  );

  return { start, end };
};

export const formatCalendarDate = (
  date: CalendarDate,
  options?: { omitYear?: boolean },
): string => {
  const omitYear = options?.omitYear ?? false;
  const hasMonthOrDay = date.month !== undefined || date.day !== undefined;
  const parts: string[] = [];

  if (!omitYear || !hasMonthOrDay) {
    parts.push(`${date.year}`);
  }

  if (date.month !== undefined) {
    parts.push(String(date.month).padStart(2, '0'));
  }

  if (date.day !== undefined) {
    parts.push(String(date.day).padStart(2, '0'));
  }

  return parts.join('/');
};

export const formatCalendarPeriod = (period: CalendarPeriod): { start: string; end: string } => {
  return {
    start: formatCalendarDate(period.start),
    end: period.end === undefined ? 'Present' : formatCalendarDate(period.end),
  };
};

export const calendarPeriodStartValue = (period: CalendarPeriod): number => {
  return calendarDateValue(period.start);
};

export const calendarPeriodEndValue = (period: CalendarPeriod): number => {
  return period.end === undefined ? Number.POSITIVE_INFINITY : calendarDateValue(period.end);
};
