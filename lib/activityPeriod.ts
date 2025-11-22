import { ActivityDate, ActivityPeriod, Activity } from '@/types/activities';
import { assert } from '@/lib/assert';

const MIN_MONTH = 1;
const MAX_MONTH = 12;
const MIN_DAY = 1;
const MAX_DAY = 31;

const isInteger = (value: number): boolean => Number.isInteger(value);

export const activityDateToComparableValue = (date: ActivityDate): number => {
  const month = date.month ?? 1;
  const day = date.day ?? 1;
  return Date.UTC(date.year, month - 1, day);
};

const assertActivityDateValid = (date: ActivityDate, context: string): void => {
  assert(isInteger(date.year), `${context}.year must be an integer year`);
  assert(date.year >= 0, `${context}.year must be >= 0`);

  if (date.month !== undefined) {
    assert(isInteger(date.month), `${context}.month must be an integer month`);
    assert(
      date.month >= MIN_MONTH && date.month <= MAX_MONTH,
      `${context}.month must be between ${MIN_MONTH} and ${MAX_MONTH}`,
    );
  }

  if (date.day !== undefined) {
    assert(isInteger(date.day), `${context}.day must be an integer day`);
    assert(
      date.day >= MIN_DAY && date.day <= MAX_DAY,
      `${context}.day must be between ${MIN_DAY} and ${MAX_DAY}`,
    );
  }
};

const isSameActivityDate = (a: ActivityDate, b: ActivityDate): boolean => {
  return a.year === b.year && a.month === b.month && a.day === b.day;
};

export const validateActivityPeriod = (period: ActivityPeriod, context: string): void => {
  assertActivityDateValid(period.start, `${context}.period.start`);

  if (period.end === undefined || period.end === null) {
    return;
  }

  assertActivityDateValid(period.end, `${context}.period.end`);

  const startValue = activityDateToComparableValue(period.start);
  const endValue = activityDateToComparableValue(period.end);

  assert(
    endValue >= startValue,
    `${context}.period.end must not be earlier than ${context}.period.start`,
  );
};

export const formatActivityDate = (date: ActivityDate, options?: { omitYear?: boolean }): string => {
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

export const formatActivityPeriod = (period: ActivityPeriod): string => {
  const start = formatActivityDate(period.start);

  if (period.end === undefined || period.end === null) {
    return `${start} - Present`;
  }

  if (isSameActivityDate(period.start, period.end)) {
    return start;
  }

  const shouldOmitYear =
    period.start.year === period.end.year &&
    (period.end.month !== undefined || period.end.day !== undefined);

  const end = formatActivityDate(period.end, { omitYear: shouldOmitYear });
  return `${start} - ${end}`;
};

export const getActivityPeriodEndValue = (period: ActivityPeriod): number => {
  if (period.end === undefined || period.end === null) {
    return Number.POSITIVE_INFINITY;
  }

  return activityDateToComparableValue(period.end);
};

export const getActivityPeriodStartValue = (period: ActivityPeriod): number => {
  return activityDateToComparableValue(period.start);
};

export const validateActivity = (activity: Activity): Activity => {
  validateActivityPeriod(activity.period, `Activity(${activity.id})`);
  return activity;
};

// 後方互換性のための関数エイリアス
export const validateProjectActivity = validateActivity;
