export const formatDate = (
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short", // Jan, Feb, etc. → change to "long" for full name
    year: "numeric",
    weekday: "long",
  },
  locale: string = "en-IN"
): string => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, options);
  } catch (error) {
    console.error("Invalid date:", dateString);
    return dateString;
  }
};

/**
 * Returns the next calendar day from the given time (tomorrow at midnight).
 * This is the effective start date for all user actions
 * (new subscription, add child, meal delete, meal edit, renewal, etc.).
 *
 * Rule: Any action performed at any time today → effective date is TOMORROW.
 *   - 7:30 AM  → next day
 *   - 11:59 PM → next day
 *   - 12:01 AM → next day (still next calendar day)
 */
export const getNextCalendarDay = (currentTime: Date = new Date()): Date => {
  const next = new Date(currentTime);
  next.setDate(next.getDate() + 1);
  next.setHours(0, 0, 0, 0);
  return next;
};

/** @deprecated Use `getNextCalendarDay` instead. */
export const getEffectiveStartDate = getNextCalendarDay;

/**
 * Returns true when two dates fall on the same local calendar day.
 * Uses local date components so timezone offset doesn't shift the day.
 */
export const isSameCalendarDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
