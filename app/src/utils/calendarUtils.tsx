// --------------------
// Helpers for Menu Calendar
// --------------------
import { differenceInHours, parseISO } from 'date-fns';

export const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const formatDate = (year: number, month: number, day: number) =>
  `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

export const getDaysInMonth = (month: number, year: number) =>
  new Date(year, month + 1, 0).getDate();

export const getFirstDayOfMonth = (month: number, year: number) => {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday = 0
};

// --------------------
// Check Functions
// --------------------
export const isHoliday = (day: number, holidays: { date: string }[], year: number, month: number) =>
  holidays.some(h => h.date === formatDate(year, month, day));

export const isStartDate = (day: number, startDate: string, year: number, month: number) =>
  formatDate(year, month, day) === startDate;

export const isEndDate = (day: number, endDate: string, year: number, month: number) =>
  formatDate(year, month, day) === endDate;

export const isWeekend = (index: number) => index % 7 === 5 || index % 7 === 6;

export const isInBetweenRange = (
  day: number,
  startDate: string,
  endDate: string,
  year: number,
  month: number,
  holidays: { date: string }[],
) => {
  if (!startDate || !endDate) return false;
  const dayDate = new Date(formatDate(year, month, day));
  return (
    dayDate > new Date(startDate) &&
    dayDate < new Date(endDate) &&
    !isHoliday(day, holidays, year, month)
  );
};

export const isWithinRange = (day: number, startDate: string, endDate: string, year: number, month: number) => {
  const d = new Date(formatDate(year, month, day));
  return d >= new Date(startDate) && d <= new Date(endDate);
};

export const isPastDate = (day: number, year: number, month: number) => {
  const d = new Date(formatDate(year, month, day));
  const today = new Date();
  d.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return d < today;
};

export const isBookedDate = (
  day: number,
  year: number,
  month: number,
  foodlist: { id: string; name: string; meals: { date: string; food: string }[] }[]
) => {
  const dateStr = formatDate(year, month, day);

  for (const child of foodlist) {
    const meal = child.meals.find(m => m.date === dateStr);
    if (meal) {
      // Check if the date is within 48 hours from now
      const now = new Date();
      const bookedDate = parseISO(dateStr);
      const diff = differenceInHours(bookedDate, now);

      return {
        childName: child.name,
        meal: meal.food,
        date: dateStr,
        editable: diff >= 48, 
      };
    }
  }

  return null;
};




