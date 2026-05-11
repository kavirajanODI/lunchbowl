import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import {useMenu} from 'context/MenuContext';
import React, {useCallback, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {heightPercentageToDP as hp,widthPercentageToDP as wp,} from 'react-native-responsive-screen';
import {SvgXml} from 'react-native-svg';
import {BackIcon} from 'styles/svg-icons';
import {useFocusEffect} from '@react-navigation/native';
import {useToast} from 'components/Error/Toast/ToastProvider';
import {useFood} from 'context/FoodContext';
import {
  getGradientColors,
  getTooltipText,
  handleDayPress,
} from 'screens/MyPlan/Helpers/calendarBookingHandlers';
import {CalendarProps} from 'src/model/calendarModels';
import {
  daysOfWeek,
  formatDate,
  getDaysInMonth,
  getFirstDayOfMonth,
  isBookedDate,
  isHoliday,
  isPastDate,
  isWeekend,
  isWithinRange,
  monthNames,
} from '../../../utils/calendarUtils';

// --------------------
// Component
// --------------------

export default function MenueCalendar({
  onDateChange,
  holidays = [],
  currentMonth,
  currentYear,
  onMonthChange,
}: CalendarProps) {
  // --------------------
  // Context & Hooks
  // --------------------
  const {showToast} = useToast();
  const {startDate, endDate} = useMenu();
  const {foodList, onViewFoodList} = useFood();

  // --------------------
  // Component State
  // --------------------
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipText, setTooltipText] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  // --------------------
  // Refs & Timers
  // --------------------
  let holdTimeout: NodeJS.Timeout;

  // ---------------------------
  // Better For AUTO FETCH DTA  WHEN NAVIGATION
  // ----------------------------

  useFocusEffect(
    useCallback(() => {
      onViewFoodList();
    }, [onViewFoodList]),
  );

  // --------------------
  // Early Return (must be after all hooks)
  // --------------------
  if (!startDate || !endDate) return <Text>Loading calendar...</Text>;

  const handleDateSelect = (day: number) => {
    const dateStr = formatDate(currentYear, currentMonth, day);
    const holiday = holidays.find(h => h.date === dateStr);
    setTooltipText(
      holiday ? `Holiday: ${holiday.name}` : `Selected  Date: ${dateStr}`,
    );
    setSelectedDate(dateStr);
    onDateChange?.(dateStr);
  };

  // --------------------
  // Calendar Logic
  // --------------------

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayIndex = getFirstDayOfMonth(currentMonth, currentYear);

  const calendarDays: (string | number)[] = [];
  for (let i = 0; i < firstDayIndex; i++) calendarDays.push('');
  for (let day = 1; day <= daysInMonth; day++) calendarDays.push(day);

  // Group calendar days into rows of 7
  const calendarRows: (string | number)[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    calendarRows.push(calendarDays.slice(i, i + 7));
  }

  // Pad the last row to 7 cells if needed
  if (calendarRows.length > 0) {
    const lastRow = calendarRows[calendarRows.length - 1];
    while (lastRow.length < 7) {
      lastRow.push('');
    }
  }

  // --------------------
  // Render
  // --------------------
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            onMonthChange(
              currentMonth === 0 ? 11 : currentMonth - 1,
              currentMonth === 0 ? currentYear - 1 : currentYear,
            )
          }>
          <SvgXml xml={BackIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {monthNames[currentMonth].toUpperCase()}, {currentYear}
        </Text>
        <TouchableOpacity
          onPress={() =>
            onMonthChange(
              currentMonth === 11 ? 0 : currentMonth + 1,
              currentMonth === 11 ? currentYear + 1 : currentYear,
            )
          }>
          <SvgXml xml={BackIcon} style={{transform: [{rotate: '180deg'}]}} />
        </TouchableOpacity>
      </View>

      {/* Week Days */}
      <View style={styles.weekRow}>
        {daysOfWeek.map((day, index) => (
          <Text
            key={index}
            style={[
              styles.weekDay,
              (day === 'Sat' || day === 'Sun') && styles.weekendText,
            ]}>
            {day}
          </Text>
        ))}
      </View>

      {/* Dates — rendered row by row to avoid fractional-width wrapping bugs */}
      {calendarRows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.weekRow}>
          {row.map((day, colIndex) => {
            const cellIndex = rowIndex * 7 + colIndex;
            if (day === '') return <View key={colIndex} style={styles.dayCell} />;

            const dayNumber = day as number;
            const dateStr = formatDate(currentYear, currentMonth, dayNumber);
            const selected = selectedDate === dateStr;

            const isSundayCell = colIndex === 6;
            const outOfPlan =
              !isWithinRange(dayNumber, startDate, endDate, currentYear, currentMonth);
            const isDisabled = isSundayCell || outOfPlan;

            return (
              <TouchableOpacity
                key={colIndex}
                style={[styles.dayCell, isDisabled && styles.disabledCell]}
                activeOpacity={isDisabled ? 1 : 0.7}
                onPress={() =>
                  handleDayPress({
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
                  })
                }
                onPressIn={() => {
                  holdTimeout = setTimeout(() => {
                    setTooltipText(
                      getTooltipText(
                        dayNumber,
                        cellIndex,
                        currentMonth,
                        currentYear,
                        startDate,
                        endDate,
                        holidays,
                        foodList,
                        formatDate,
                        isBookedDate,
                      ),
                    );
                    setTooltipVisible(true);
                  }, 1000);
                }}
                onPressOut={() => {
                  clearTimeout(holdTimeout);
                  setTooltipVisible(false);
                }}>
                <LinearGradient
                  colors={getGradientColors(
                    dayNumber,
                    cellIndex,
                    currentMonth,
                    currentYear,
                    startDate,
                    endDate,
                    holidays,
                    foodList,
                    isBookedDate,
                  )}
                  style={[styles.dayCircle, isDisabled && styles.disabledCircle]}>
                  <Text
                    style={[
                      styles.dayText,
                      isDisabled && styles.disabledText,
                      selected && !isDisabled && styles.selectedText,
                      !isDisabled && isBookedDate(
                        dayNumber,
                        currentYear,
                        currentMonth,
                        foodList,
                      ) && styles.bookedText,
                      !isDisabled && (isHoliday(
                        dayNumber,
                        holidays,
                        currentYear,
                        currentMonth,
                      ) ||
                        isWeekend(cellIndex)) &&
                        styles.holidayText,
                    ]}>
                    {dayNumber}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      {/* Tooltip */}
      {tooltipVisible && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>{tooltipText}</Text>
        </View>
      )}
    </View>
  );
}

// --------------------
// Styles
// --------------------
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 20,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: hp('0.2%')},
    shadowOpacity: 0.1,
    shadowRadius: wp('2%'),
    elevation: 0.9,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    padding: 10,
  },
  headerText: {
    fontSize: 18,
    color: Colors.primaryOrange,
    fontFamily: Fonts.Urbanist.bold,
  },
  weekRow: {flexDirection: 'row'},
  weekDay: {
    flex: 1,
    textAlign: 'center',
    color: Colors.black,
    paddingVertical: 10,
    fontFamily: Fonts.Urbanist.bold,
    textTransform: 'uppercase',
  },
  weekendText: {color: Colors.red},
  dayCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  disabledCell: {
    opacity: 0.35,
  },
  dayCircle: {
    width: '80%',
    aspectRatio: 1,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledCircle: {
    backgroundColor: Colors.default,
  },
  dayText: {fontSize: 16, color: Colors.black},
  disabledText: {color: Colors.bodyText},
  selectedText: {fontWeight: 'bold', color: Colors.green},
  holidayText: {color: Colors.red, fontWeight: 'bold'},
  tooltip: {
    position: 'absolute',
    top: hp('2%'),
    left: wp('10%'),
    right: wp('10%'),
    backgroundColor: Colors.primaryOrange,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    zIndex: 9999,
    elevation: 10,
  },
  tooltipText: {
    color: Colors.white,
    fontFamily: Fonts.Urbanist.bold,
    fontSize: wp('4%'),
    lineHeight: wp('6%'),
  },
  bookedText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
});
