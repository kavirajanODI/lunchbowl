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
