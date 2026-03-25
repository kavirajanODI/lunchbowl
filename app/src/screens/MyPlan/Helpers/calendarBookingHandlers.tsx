import { ToastPayload } from 'components/Modal/toastTypes';
import { Colors } from 'assets/styles/colors';
import {
  isHoliday,
  isStartDate,
  isEndDate,
  isInBetweenRange,
  isWeekend,
} from '../../../utils/calendarUtils';
import { BookedInfo, ChildWithMeals } from 'src/model/calendarModels';

export const handleDayPress = ({
  dayNumber,
  currentYear,
  currentMonth,
  foodList,
  startDate,
  endDate,
  isPastDate,
  isWithinRange,
  isBookedDate,
  handleDateSelect,
  showToast,
}: {
  dayNumber: number;
  currentYear: number;
  currentMonth: number;
  foodList: ChildWithMeals[];
  startDate: string;
  endDate: string;
  isPastDate: (d: number, y: number, m: number) => boolean;
  isWithinRange: (
    d: number,
    s: string,
    e: string,
    y: number,
    m: number
  ) => boolean;
  isBookedDate: (
    d: number,
    y: number,
    m: number,
    list: ChildWithMeals[]
  ) => BookedInfo | null;
  handleDateSelect: (d: number) => void;
  showToast: (p: ToastPayload) => void;
}) => {
  const booked = isBookedDate(dayNumber, currentYear, currentMonth, foodList);

  if (isPastDate(dayNumber, currentYear, currentMonth)) {
    showToast({
      type: 'warning',
      title: 'Invalid Selection',
      message: 'You cannot select a past date.',
    });
    return;
  }

  if (!isWithinRange(dayNumber, startDate, endDate, currentYear, currentMonth)) {
    showToast({
      type: 'info',
      title: 'Out of Plan',
      message: 'This date is not included in your plan.',
    });
    return;
  }

  if (booked && !booked.editable) {
    showToast({
      type: 'error',
      title: 'Locked',
      message: `Meal already booked and locked on ${booked.date}`,
    });
    return;
  }

  if (booked && booked.editable) {
    showToast({
      type: 'info',
      title: 'Edit Meal',
      message: `You can update booking for ${booked.date}`,
    });
    handleDateSelect(dayNumber);
    return;
  }

  if (new Date(currentYear, currentMonth, dayNumber).getDay() === 0) {
  showToast({
    type: 'info',
    title: 'Closed',
    message: 'Sunday: LunchBowl is closed',
  });
  return;
}

//   FRESH SELECTION PANGU .. 
  handleDateSelect(dayNumber);
  showToast({
    type: 'success',
    title: 'Date Selected',
    message: `You have selected ${dayNumber}/${currentMonth + 1}/${currentYear}`,
  });
};

export const getGradientColors = (
  day: number,
  index: number,
  currentMonth: number,
  currentYear: number,
  startDate: string,
  endDate: string,
  holidays: { date: string; name: string }[],
  foodList: ChildWithMeals[],
  isBookedDate: (
    d: number,
    y: number,
    m: number,
    list: ChildWithMeals[]
  ) => BookedInfo | null
) => {
  const isSunday = index % 7 === 6;
  const isSaturday = index % 7 === 5;

  // 1️⃣ Start or End date (highest priority)
  if (isStartDate(day, startDate, currentYear, currentMonth)) return [Colors.green, Colors.green];
  if (isEndDate(day, endDate, currentYear, currentMonth)) return [Colors.red, Colors.red];
  const booked = isBookedDate(day, currentYear, currentMonth, foodList);
  if (booked) {
    return booked.editable
      ? [Colors.lightRed, Colors.lightRed] // editable booking
      : [Colors.greeFadd, Colors.greeFadd]; // locked booking
  }

  if (
    isInBetweenRange(day, startDate, endDate, currentYear, currentMonth, holidays) &&
    !isSaturday &&
    !isSunday
  ) {
    return [Colors.lightRed, Colors.lightRed];
  }

  if (isSunday || isHoliday(day, holidays, currentYear, currentMonth)) {
    return [Colors.hoiday, Colors.hoiday];
  }

  if (isSaturday) return [Colors.hoiday, Colors.hoiday];

  return ['transparent', 'transparent'];
};


export const getTooltipText = (
  day: number,
  index: number,
  currentMonth: number,
  currentYear: number,
  startDate: string,
  endDate: string,
  holidays: { date: string; name: string }[],
  foodList: ChildWithMeals[],
  formatDate: (year: number, month: number, day: number) => string,
  isBookedDate: any
) => {

  if (index % 7 === 6) return `Sunday: LunchBowl is closed`;
  const dateStr = formatDate(currentYear, currentMonth, day);
  const booked = isBookedDate(day, currentYear, currentMonth, foodList);

  if (booked) {
    return booked.editable
      ? `Meal Booked (Editable): ${booked.childName}'s ${booked.meal} (${booked.date})`
      : `Meal Booked (Locked): ${booked.childName}'s ${booked.meal} (${booked.date})\nOrders must be placed at least 48 hours in advance.`;
  }

  if (isStartDate(day, startDate, currentYear, currentMonth)) return `Plan Started: ${dateStr}`;
  if (isEndDate(day, endDate, currentYear, currentMonth)) return `Plan Ends: ${dateStr}`;
  if (
    isInBetweenRange(day, startDate, endDate, currentYear, currentMonth, holidays) &&
    !isWeekend(index)
  )
    return `Plan Ongoing: ${dateStr}`;
  if (isWeekend(index)) return `Weekend Holiday: ${dateStr}`;

  const holiday = holidays.find(h => h.date === dateStr);
  if (holiday) return `Holiday: ${holiday.name} (${dateStr})`;

  // ✅ fallback for dates outside plan
  if (
    !isInBetweenRange(day, startDate, endDate, currentYear, currentMonth, holidays) &&
    !isWeekend(index) &&
    !holiday
  ) {
    return `This date is not part of your plan: ${dateStr}`;
  }

  return `Available for Booking: ${dateStr}`;
};


