import type { Activity, ActivityCategory, ActivityDate, ActivityPeriod } from '@/types/activities';
import { assert } from '@/lib/assert';
import { ensureObject, toNumber, toString } from '@/lib/validation';

const MIN_MONTH = 1;
const MAX_MONTH = 12;
const MIN_DAY = 1;
const MAX_DAY = 31;
const activityCategoryValues = ['work', 'research', 'others'] as const satisfies readonly ActivityCategory[];
const activityCategorySet: ReadonlySet<string> = new Set(activityCategoryValues);

const isInteger = (value: number): boolean => Number.isInteger(value);

const isActivityCategory = (value: string): value is ActivityCategory =>
  activityCategorySet.has(value);

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

export const validateActivityDate = (raw: unknown, context: string): ActivityDate => {
  const obj = ensureObject(raw, context);
  const year = toNumber(obj.year, `${context}.year`);
  const monthValue = obj.month;
  const dayValue = obj.day;

  const date: ActivityDate = { year };
  if (monthValue !== undefined && monthValue !== null) {
    date.month = toNumber(monthValue, `${context}.month`);
  }
  if (dayValue !== undefined && dayValue !== null) {
    date.day = toNumber(dayValue, `${context}.day`);
  }

  assertActivityDateValid(date, context);
  return date;
};

export const validateActivityPeriod = (raw: unknown, context: string): ActivityPeriod => {
  const obj = ensureObject(raw, `${context}.period`);
  const start = validateActivityDate(obj.start, `${context}.period.start`);
  const period: ActivityPeriod = { start };

  if (obj.end === undefined || obj.end === null) {
    if (obj.end === null) {
      period.end = null;
    }
    return period;
  }

  period.end = validateActivityDate(obj.end, `${context}.period.end`);

  const startValue = activityDateToComparableValue(period.start);
  const endValue = activityDateToComparableValue(period.end);

  assert(
    endValue >= startValue,
    `${context}.period.end must not be earlier than ${context}.period.start`,
  );

  return period;
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

export type FormattedPeriodParts = {
  start: string;
  end: string;
};

export const formatActivityPeriodParts = (period: ActivityPeriod): FormattedPeriodParts => {
  const start = formatActivityDate(period.start);
  const end =
    period.end === undefined || period.end === null
      ? 'Present'
      : formatActivityDate(period.end);
  return { start, end };
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

export const validateActivity = (raw: unknown): Activity => {
  const obj = ensureObject(raw, 'Activity');
  const id = toString(obj.id, 'Activity.id');
  const context = `Activity(${id})`;
  const title = toString(obj.title, `${context}.title`);
  const period = validateActivityPeriod(obj.period, context);
  const description = toString(obj.description, `${context}.description`);
  const categoryValue = toString(obj.category, `${context}.category`);

  assert(
    isActivityCategory(categoryValue),
    `${context}.category must be one of: ${activityCategoryValues.join(', ')}`,
  );

  return {
    id,
    title,
    period,
    description,
    category: categoryValue,
  };
};

// 後方互換性のための関数エイリアス
export const validateProjectActivity = validateActivity;
