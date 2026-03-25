import React, {createContext, useContext, useState, useEffect} from 'react';
import {Holiday} from 'src/model/calendarModels';
import HolidayService from 'services/MyPlansApi/HolidayService';

interface DateContextType {
  selectedDate: string;
  isHoliday: boolean;
  holidays: Holiday[];
  setSelectedDate: (date: string, isHoliday: boolean) => void;
  refreshHolidays: () => void;
}

const DateContext = createContext<DateContextType>({
  selectedDate: '',
  isHoliday: false,
  holidays: [],
  setSelectedDate: () => {},
  refreshHolidays: () => {},
});

export const useDate = () => useContext(DateContext);

export const HolidayDateProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [selectedDate, setSelectedDateState] = useState('');
  const [isHoliday, setIsHoliday] = useState(false);
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  const setSelectedDate = (date: string, holiday: boolean) => {
    setSelectedDateState(date);
    setIsHoliday(holiday);
  };

  const fetchHolidays = async () => {
    try {
      const response: any = await HolidayService.getAllHolidays();
      if (response?.data) {
        const formattedHolidays = response.data.map((holiday: any) => ({
          id: holiday._id,
          name: holiday.name,
          date: new Date(holiday.date).toISOString().split('T')[0],
        }));
        setHolidays(formattedHolidays);
      } else {
        console.error('Invalid holiday data:', response);
      }
    } catch (error) {
      console.error('Error fetching holidays:', error);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  return (
    <DateContext.Provider
      value={{
        selectedDate,
        isHoliday,
        holidays,
        setSelectedDate,
        refreshHolidays: fetchHolidays,
      }}>
      {children}
    </DateContext.Provider>
  );
};

// import React, { createContext, useContext, useState, ReactNode } from 'react';

// interface DateContextType {
//   selectedDate: string;
//   setSelectedDate: (date: string) => void;
// }

// const CalendarContext = createContext<DateContextType | undefined>(undefined);

// export const CalendarDateProvider = ({ children }: { children: ReactNode }) => {
//   const [selectedDate, setSelectedDate] = useState<string>('');

//   return (
//     <CalendarContext.Provider value={{ selectedDate, setSelectedDate }}>
//       {children}
//     </CalendarContext.Provider>
//   );
// };

// export const useDate = (): DateContextType => {
//   const context = useContext(CalendarContext);
//   if (!context) {
//     throw new Error('useDate must be used within a DateProvider');
//   }
//   return context;
// };
