// Save Menu validation helpers

export const formatDateISO = (date: Date) =>
  date.toISOString().split('T')[0];

export const isPastDate = (date: Date) => {
  const today = new Date();
  today.setHours(0,0,0,0);
  const d = new Date(date);
  d.setHours(0,0,0,0);
  return d < today;
};

export const isWeekend = (date: Date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

export const isHoliday = (date: Date, holidays: {date: string}[]) => {
  const dStr = formatDateISO(date);
  return holidays.some(h => h.date === dStr);
};

export const isFutureLimitExceeded = (date: Date) => {
  const limit = new Date();
  limit.setMonth(limit.getMonth() + 3);
  return date > limit;
};

export const isSaturday = (date: Date) => date.getDay() === 6;

export const isSunday = (date: Date) => date.getDay() === 0;

/**
 * Returns true if the date is within 48 hours from now (i.e. locked for edits).
 */
export const isWithin48Hours = (date: Date): boolean => {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  return diffMs < 48 * 60 * 60 * 1000;
};


// -------------------- Main Validation (non-holiday dates) --------------------

/**
 * Validates that a date is eligible for saving a regular (non-holiday) meal.
 * Does NOT block holidays — holiday dates must reach the PAY flow instead.
 */
export const validateMenuDate = (
  date: Date,
  holidays: {date: string}[]
): string | null => {
  if (isPastDate(date)) return 'You cannot save meals for past dates.';
  if (isFutureLimitExceeded(date)) return 'You can only schedule meals within the next 3 months.';
  if (isWeekend(date)) return 'Weekends are not allowed for regular meal plans.';
  if (isSaturday(date)) return 'Saturdays are not allowed for regular meal plans.';
  if (isSunday(date)) return 'Sundays are not allowed for regular meal plans.';
  // NOTE: Holiday dates are intentionally allowed through here;
  //       the caller is responsible for routing to the payment flow instead.
  return null;
};
