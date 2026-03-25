export interface Holiday {
    id: string;
    name: string;
    date: string;
}

export interface ChildWithMeals {
  id: string;
  name: string;
  meals: { date: string; food: string }[];
};


export interface CalendarProps {

  onDateChange?: (date: string) => void;
  holidays?: Holiday[];
  currentMonth: number;
  currentYear: number;
  onMonthChange: (month: number, year: number) => void;
}


export interface BookedInfo {

  date: string;
  editable: boolean;
  childName: string;
  meal: string;
};