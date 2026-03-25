// utils/dateUtils.ts

/**
 * Convert UTC ISO string → Local Date object
 */
export const utcToLocal = (utcString: string): Date => {
  return new Date(utcString); // JS auto localize
};

/**
 * Convert Local Date → UTC ISO string
 */
export const localToUtc = (localDate: Date): string => {
  return new Date(
    localDate.getTime() - localDate.getTimezoneOffset() * 60000
  ).toISOString();
};

/**
 * Format date for display (local)
 */
export const formatLocalDate = (date: Date, withTime = false): string => {
  return date.toLocaleString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "2-digit",
    ...(withTime && { hour: "2-digit", minute: "2-digit" }),
  });
};
