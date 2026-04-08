import CheckBox from '@react-native-community/checkbox';
import {useFocusEffect} from '@react-navigation/native';
import {Colors} from 'assets/styles/colors';
import PrimaryButton from 'components/buttons/PrimaryButton';
import ErrorMessage from 'components/Error/BoostrapStyleError';
import {LoadingModal} from 'components/LoadingModal/LoadingModal';
import {useAuth} from 'context/AuthContext';
import {useAppConfig} from 'context/AppConfigContext';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import HolidayService from 'services/MyPlansApi/HolidayService';
import RegistrationService from 'services/RegistartionService/registartion';
import {Holiday} from 'src/model/calendarModels';
import {getNextCalendarDay} from 'utils/dateUtils';
import {getDaysInMonth, getFirstDayOfMonth} from 'utils/calendarUtils';

//####################### HELPER FUNCTIONS   ######################

type Plan = {
  days: number;
  price: number;
  basePrice: number;
  discountPercent: number;
  discountAmount: number;
  startDate: Date;
  endDate: Date;
};

/** Format a Date as "DD MMM YYYY" (e.g. "08 Apr 2026"). */
const formatDateShort = (d: Date): string => {
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

/**
 * Format a Date as a local YYYY-MM-DD string WITHOUT timezone conversion.
 *
 * `.toISOString()` converts to UTC first, which in positive-offset timezones
 * (e.g. IST = UTC+5:30) shifts midnight local time to the previous calendar
 * day in UTC. This helper avoids that by reading the date components directly
 * from the local clock so the string always matches what the user sees.
 */
const toLocalDateStr = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dateNum = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dateNum}`;
};

const addWorkingDays = (
  start: Date,
  requiredDays: number,
  holidays: Holiday[] = [],
): Date => {
  // Holiday dates come from the backend as midnight UTC strings (e.g. "2026-04-03"),
  // so .toISOString().split('T')[0] is correct for them.
  const holidaySet = new Set(
    holidays.map(h => new Date(h.date).toISOString().split('T')[0]),
  );

  let count = 0;
  let temp = new Date(start);

  while (count < requiredDays) {
    const day = temp.getDay();
    // Use local date string so the comparison is always in the user's timezone
    const dateStr = toLocalDateStr(temp);

    if (day !== 0 && day !== 6 && !holidaySet.has(dateStr)) {
      count++;
    }

    if (count < requiredDays) {
      temp.setDate(temp.getDate() + 1);
    }
  }

  return temp;
};

const isWorkingDay = (date: Date, holidays: Holiday[] = []): boolean => {
  const day = date.getDay();
  if (day === 0 || day === 6) return false;
  const holidaySet = new Set(
    holidays.map(h => new Date(h.date).toISOString().split('T')[0]),
  );
  // Use local date string for the same reason as in addWorkingDays
  return !holidaySet.has(toLocalDateStr(date));
};

/**
 * Returns the next working day starting from `base`, using `getNextCalendarDay`
 * as the base and then advancing past weekends and holidays.
 *
 * Next-day logic: any action performed today → effective start date is tomorrow.
 */
const getEffectiveStartDate = (base: Date, holidays: Holiday[] = []): Date => {
  let newDate = getNextCalendarDay(base);
  while (!isWorkingDay(newDate, holidays)) {
    newDate.setDate(newDate.getDate() + 1);
  }
  return newDate;
};

/**
 * Returns true when two dates fall on the same local calendar day.
 * Uses local date components so timezone offset doesn't shift the day.
 */
const isSameCalendarDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

// ── Working Days Preview Modal ──────────────────────────────────────────────

const MODAL_MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

type WorkingDaysModalProps = {
  visible: boolean;
  onClose: () => void;
  startDate: Date;
  endDate: Date;
  holidays: Holiday[];
  totalWorkingDays: number;
};

function WorkingDaysModal({
  visible,
  onClose,
  startDate,
  endDate,
  holidays,
  totalWorkingDays,
}: WorkingDaysModalProps) {
  const [viewMonth, setViewMonth] = useState<number>(startDate.getMonth());
  const [viewYear, setViewYear] = useState<number>(startDate.getFullYear());

  // Reset to plan start month whenever modal opens or startDate changes
  useEffect(() => {
    if (visible) {
      setViewMonth(startDate.getMonth());
      setViewYear(startDate.getFullYear());
    }
  }, [visible, startDate]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const planStart = new Date(startDate);
  planStart.setHours(0, 0, 0, 0);
  const planEnd = new Date(endDate);
  planEnd.setHours(0, 0, 0, 0);

  // Holiday set uses YYYY-MM-DD strings (UTC-based from backend — correct for same calendar day)
  const holidaySet = new Set(holidays.map(h => h.date));

  const daysInCurrentMonth = getDaysInMonth(viewMonth, viewYear);
  const firstDayIdx = getFirstDayOfMonth(viewMonth, viewYear); // 0 = Monday

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayIdx; i++) cells.push(null);
  for (let d = 1; d <= daysInCurrentMonth; d++) cells.push(d);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const getDayInfo = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    date.setHours(0, 0, 0, 0);
    const dow = date.getDay(); // 0=Sun, 6=Sat
    const isWeekendDay = dow === 0 || dow === 6;
    const isTodayDay = date.getTime() === today.getTime();
    const isHolidayDay = holidaySet.has(toLocalDateStr(date));
    const inPlanRange = date >= planStart && date <= planEnd;
    const isWorkDay = inPlanRange && !isWeekendDay && !isHolidayDay;
    return {isWeekendDay, isTodayDay, isHolidayDay, inPlanRange, isWorkDay};
  };

  const getCircleBg = (day: number): string => {
    const {isTodayDay, isWeekendDay, isWorkDay} = getDayInfo(day);
    if (isTodayDay) return Colors.primaryOrange;
    if (isWorkDay) return Colors.green;
    if (isWeekendDay) return Colors.lightRed;
    return Colors.Storke; // past / outside range / holiday in range
  };

  const getDayTextColor = (day: number): string => {
    const {isTodayDay, isWorkDay} = getDayInfo(day);
    return isTodayDay || isWorkDay ? Colors.white : Colors.bodyText;
  };

  const formatDateRange = (d: Date): string => {
    const M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${d.getDate()} ${M[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={modalSt.overlay}>
        <View style={modalSt.card}>
          {/* Title + Close */}
          <View style={modalSt.titleRow}>
            <Text style={modalSt.title}>YOUR SUBSCRIPTION WORKING DAYS</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{top: 8, left: 8, bottom: 8, right: 8}}>
              <Text style={modalSt.closeX}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Month navigation */}
          <View style={modalSt.monthNav}>
            <TouchableOpacity
              onPress={prevMonth}
              hitSlop={{top: 8, left: 8, bottom: 8, right: 8}}>
              <Text style={modalSt.navArrow}>‹</Text>
            </TouchableOpacity>
            <Text style={modalSt.monthLabel}>
              {MODAL_MONTH_NAMES[viewMonth]}, {viewYear}
            </Text>
            <TouchableOpacity
              onPress={nextMonth}
              hitSlop={{top: 8, left: 8, bottom: 8, right: 8}}>
              <Text style={modalSt.navArrow}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Weekday headers */}
          <View style={modalSt.weekRow}>
            {['MON','TUE','WED','THU','FRI','SAT','SUN'].map(d => (
              <Text
                key={d}
                style={[modalSt.weekHeader, (d === 'SAT' || d === 'SUN') && modalSt.weekendHeader]}>
                {d}
              </Text>
            ))}
          </View>

          {/* Day grid */}
          <View style={modalSt.daysGrid}>
            {cells.map((day, idx) => {
              if (day === null) {
                return <View key={`e-${idx}`} style={modalSt.dayCell} />;
              }
              const {isHolidayDay} = getDayInfo(day);
              const bgColor = getCircleBg(day);
              const textColor = getDayTextColor(day);
              return (
                <View key={day} style={modalSt.dayCell}>
                  <View style={[modalSt.dayCircle, {backgroundColor: bgColor}]}>
                    <Text style={[modalSt.dayNum, {color: textColor}]}>{day}</Text>
                  </View>
                  {isHolidayDay && <View style={modalSt.holidayDot} />}
                </View>
              );
            })}
          </View>

          {/* Legend */}
          <View style={modalSt.legend}>
            <View style={modalSt.legendRow}>
              <View style={[modalSt.legendSwatch, {backgroundColor: Colors.green}]} />
              <Text style={modalSt.legendText}>Your Working Days</Text>
              <View style={[modalSt.legendSwatch, {backgroundColor: Colors.lightRed}]} />
              <Text style={modalSt.legendText}>Weekends</Text>
            </View>
            <View style={modalSt.legendRow}>
              <View style={modalSt.legendDotItem} />
              <Text style={modalSt.legendText}>Holidays</Text>
              <View style={[modalSt.legendSwatch, {backgroundColor: Colors.Storke}]} />
              <Text style={modalSt.legendText}>Past Dates</Text>
              <View style={[modalSt.legendSwatch, {backgroundColor: Colors.primaryOrange}]} />
              <Text style={modalSt.legendText}>Today</Text>
            </View>
          </View>

          {/* Plan info */}
          <Text style={modalSt.infoLine}>
            Subscription Period: {formatDateRange(startDate)} – {formatDateRange(endDate)}
          </Text>
          <Text style={modalSt.infoLine}>This plan activates from the next business day</Text>
          <Text style={modalSt.infoLineBold}>Total Working Days: {totalWorkingDays}</Text>
        </View>
      </View>
    </Modal>
  );
}

// ── Subscription Plan component ────────────────────────────────────────────
export default function SubscriptionPlan({
  selectedPlan,
  setSelectedPlan,
  childrenData,
  prevStep,
  nextStep,
  isRenewal,
}: any) {
  //####################### STATE VARIABLES ######################

  const {config} = useAppConfig();

  // Derive all configurable values from remote config (falls back to defaults)
  const PER_DAY_COST = config.pricePerDayPerChild;
  // Per the business rules, custom-date plans always use the single-child (base)
  // discount tier regardless of how many children are selected (spec: custom-date
  // ignores multi-child pricing). This is intentionally hardcoded rather than
  // driven by remote config because it is a pricing-contract rule, not a tunable
  // threshold — changing it would alter the meaning of the offer entirely.
  const BASE_DISCOUNT_CHILD_COUNT = 1;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Per-plan custom start dates: keyed by plan.days
  const [customStartDates, setCustomStartDates] = useState<Record<number, Date>>({});
  // Which plan's date picker is currently open (null = none)
  const [showDatePickerFor, setShowDatePickerFor] = useState<number | null>(null);
  // Which plan's working-days helper modal is currently open (null = none)
  const [workingDaysModalFor, setWorkingDaysModalFor] = useState<number | null>(null);
  // Validation errors for each plan's custom date picker
  const [customDateErrors, setCustomDateErrors] = useState<Record<number, string | null>>({});

  const {userId} = useAuth();
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  // Child selector: default all children selected
  const [selectedChildIds, setSelectedChildIds] = useState<string[]>([]);

  useEffect(() => {
    if (childrenData && childrenData.length > 0) {
      setSelectedChildIds(
        childrenData.map((c: any) => c._id).filter(Boolean),
      );
    }
  }, [childrenData]);

  const selectedCount = selectedChildIds.length;

  const toggleChild = (id: string) => {
    setSelectedChildIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  //####################### PLAN DISCOUNT  ######################

  /**
   * Returns the discount percentage to apply based on plan duration and
   * number of children.  All thresholds and percentages come from the remote
   * app config so they can be updated from the dashboard without a new release.
   *
   * NOTE: When `isCustomDate=true`, always uses single-child (base) discounts
   * regardless of the number of children selected.
   */
  const getDiscountPercent = (days: number, children: number, isCustomDate: boolean = false): number => {
    const {planDurations, singleChildDiscounts, multiChildDiscounts, multiChildThreshold} = config;
    const isMulti = !isCustomDate && children >= multiChildThreshold;
    const discounts = isMulti ? multiChildDiscounts : singleChildDiscounts;

    if (days === planDurations.oneMonth)    return discounts.oneMonth;
    if (days === planDurations.threeMonths) return discounts.threeMonths;
    if (days === planDurations.sixMonths)   return discounts.sixMonths;
    return 0;
  };

  const applyDiscount = (days: number, basePrice: number, children: number = 1, isCustomDate: boolean = false) => {
    const discountPercent = getDiscountPercent(days, children, isCustomDate);
    const discountAmount = (basePrice * discountPercent) / 100;
    const finalPrice = basePrice - discountAmount;
    return {finalPrice, discountPercent, discountAmount};
  };

  //####################### GENERATE PLAN  ######################

  const generatePlans = (holidayList: Holiday[], childrenCount: number = 1): Plan[] => {
    const today = new Date();
    const start = getEffectiveStartDate(today, holidayList);

    const {planDurations} = config;
    const planDefs = [
      planDurations.oneMonth,
      planDurations.threeMonths,
      planDurations.sixMonths,
    ];

    return planDefs.map(requiredDays => {
      const end = addWorkingDays(start, requiredDays, holidayList);

      const basePricePerChild = requiredDays * PER_DAY_COST;
      const totalBasePrice = basePricePerChild * childrenCount;
      const {finalPrice, discountPercent, discountAmount} = applyDiscount(
        requiredDays,
        totalBasePrice,
        childrenCount,
      );

      return {
        days: requiredDays,
        price: finalPrice,
        basePrice: totalBasePrice,
        discountPercent,
        discountAmount,
        startDate: start,
        endDate: end,
      };
    });
  };

  const [plans, setPlans] = useState<Plan[]>(() => generatePlans(holidays, 1));

  //######### GET HOLIDAYS API CALL ############################

  const GetHolidays = async () => {
    try {
      const response: any = await HolidayService.getAllHolidays();
      if (response && response.data) {
        const fetched = response.data.map((holiday: any) => {
          const dateObj = new Date(holiday.date);
          const formattedDate = dateObj.toISOString().split('T')[0];
          return {
            id: holiday._id,
            name: holiday.name,
            date: formattedDate,
          };
        });
        setHolidays(fetched);
      } else {
        console.error('Invalid data format', response);
      }
    } catch (err) {
      console.error('Error fetching holidays:', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      GetHolidays();
    }, []),
  );

  // Regenerate plans whenever holidays, selected child count, or remote config changes
  useEffect(() => {
    setPlans(generatePlans(holidays, selectedCount));
  }, [holidays, selectedCount, config]);

  const handleCloseError = () => {
    setError(null);
  };

  //######### PLAN SUBMIT HANDLER ############################

  const handleNext = async () => {
    if (!selectedPlan || selectedCount === 0) return;

    const customStart = customStartDates[selectedPlan.days] ?? null;
    // Treat the selection as a truly custom date only when it differs from the
    // plan's default start date.  Picking tomorrow (the same day the plan would
    // start automatically) must not strip multi-child discounts.
    const isCustomDate =
      customStart != null &&
      !isSameCalendarDay(customStart, selectedPlan.startDate);

    const effectiveStart: Date = customStart ?? selectedPlan.startDate;
    const effectiveEnd: Date = isCustomDate
      ? addWorkingDays(customStart, selectedPlan.days, holidays)
      : selectedPlan.endDate;

    const workingDays = selectedPlan.days;

    let totalPrice: number;
    if (isCustomDate) {
      // Custom start date → base discounts only, no multi-child uplift
      const basePriceTotal = workingDays * PER_DAY_COST * selectedCount;
      const {finalPrice} = applyDiscount(workingDays, basePriceTotal, BASE_DISCOUNT_CHILD_COUNT, true);
      totalPrice = finalPrice;
    } else {
      // Auto start date → price already computed with correct multi-child discount
      totalPrice = selectedPlan.price;
    }

    const planId = isCustomDate ? 'byDate' : `${selectedPlan.days}-days`;

    const payload: any = {
      step: 3,
      path: isRenewal ? 'step-Form-Renew-SubscriptionPlan' : 'step-Form-SubscriptionPlan',
      payload: {
        selectedPlan: planId,
        workingDays,
        totalPrice,
        startDate: toLocalDateStr(effectiveStart),
        endDate: toLocalDateStr(effectiveEnd),
        numberOfChildren: selectedCount,
        children: selectedChildIds,
      },
      _id: userId,
    };

    try {
      setLoading(true);
      const response = await RegistrationService.savePlans(payload);
      if (response.success) {
        nextStep();
      } else {
        setError(response.message || 'Something went wrong.');
      }
    } catch (err) {
      console.error('Error saving plan:', err);
      setError('Error saving plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isPlanSelected = selectedPlan != null;
  const isNextButtonDisabled = selectedCount === 0 || !isPlanSelected;

  return (
    <View style={{flex: 1}}>
      <LoadingModal loading={loading} setLoading={setLoading} />
      {error && <ErrorMessage error={error} onClose={handleCloseError} />}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 24}}>

        {/* ── Child Selector ─────────────────────────────────────── */}
        {childrenData && childrenData.length > 0 && (
          <View style={styles.childSelectorCard}>
            <Text style={styles.childSelectorTitle}>
              Select Children for this Plan
            </Text>
            {childrenData.map((child: any) => {
              const id = child._id;
              const isChildSelected = selectedChildIds.includes(id);
              const name =
                `${child.childFirstName || ''} ${child.childLastName || ''}`.trim() ||
                'Child';
              return (
                <TouchableOpacity
                  key={id}
                  onPress={() => toggleChild(id)}
                  style={styles.childSelectorRow}
                  activeOpacity={0.7}>
                  <CheckBox
                    value={isChildSelected}
                    onValueChange={() => toggleChild(id)}
                    tintColors={{
                      true: Colors.primaryOrange,
                      false: Colors.Storke,
                    }}
                  />
                  <Text style={styles.childSelectorName}>{name}</Text>
                </TouchableOpacity>
              );
            })}
            {selectedCount === 0 && (
              <Text style={styles.childSelectorWarn}>
                Please select at least one child.
              </Text>
            )}
          </View>
        )}

        {/* ── Plan section label ─────────────────────────────────── */}
        <Text style={styles.planSectionLabel}>
          SELECT YOUR SUBSCRIPTION PLAN*{' '}
          <Text style={styles.planSectionNote}>(All Taxes included)</Text>
        </Text>

        {/* ── Plan Cards ────────────────────────────────────────── */}
        {plans.map(plan => {
          const isSelected = selectedPlan?.days === plan.days;
          const customStart = customStartDates[plan.days] ?? null;
          // A custom date is "active" (i.e. changes pricing) only when it is
          // selected on the active plan AND it differs from the plan's default
          // start date.  Selecting the default start date should behave as if
          // no custom date was chosen — multi-child discounts still apply.
          const isCustomDate =
            isSelected &&
            customStart != null &&
            !isSameCalendarDay(customStart, plan.startDate);

          // Effective pricing: recalculate if custom date is chosen (base discounts only)
          const effectiveBasePrice = plan.days * PER_DAY_COST * selectedCount;
          let effectiveDiscountPct: number;
          let effectiveDiscountAmt: number;
          let effectiveFinalPrice: number;
          let effectiveStart: Date;
          let effectiveEnd: Date;

          if (isCustomDate && customStart) {
            const result = applyDiscount(plan.days, effectiveBasePrice, BASE_DISCOUNT_CHILD_COUNT, true);
            effectiveDiscountPct = result.discountPercent;
            effectiveDiscountAmt = result.discountAmount;
            effectiveFinalPrice = result.finalPrice;
            effectiveStart = customStart;
            effectiveEnd = addWorkingDays(customStart, plan.days, holidays);
          } else {
            effectiveDiscountPct = plan.discountPercent;
            effectiveDiscountAmt = plan.discountAmount;
            effectiveFinalPrice = plan.price;
            effectiveStart = plan.startDate;
            effectiveEnd = plan.endDate;
          }

          const customError = customDateErrors[plan.days] ?? null;

          return (
            <TouchableOpacity
              key={plan.days}
              style={[styles.planCard, isSelected && styles.selectedCard]}
              onPress={() => setSelectedPlan(plan)}
              activeOpacity={0.85}>

              {/* Header row: radio + plan title [+ date picker button when selected] */}
              <View style={styles.planHeaderRow}>
                <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                  {isSelected && <View style={styles.radioDot} />}
                </View>

                <View style={styles.planTitleArea}>
                  <Text style={[styles.planText, isSelected && styles.selectedText]}>
                    {plan.days} Working Days
                    {effectiveDiscountPct > 0 ? ` (${effectiveDiscountPct}% off)` : ''}
                  </Text>

                  {/* Collapsed view (not selected): show price summary inline */}
                  {!isSelected && (
                    <Text style={styles.planCollapsedSub}>
                      {plan.discountPercent > 0 ? (
                        <Text>
                          <Text style={styles.strikethrough}>Rs. {plan.basePrice.toLocaleString()}</Text>
                          {'  '}
                          <Text style={styles.discountBadge}>{plan.discountPercent}% OFF</Text>
                          {'  –  Rs. '}
                          {plan.price.toLocaleString()}
                        </Text>
                      ) : (
                        `Rs. ${plan.price.toLocaleString()}`
                      )}
                    </Text>
                  )}

                  {/* Expanded view (selected): show per-child / save / total */}
                  {isSelected && (
                    <>
                      <Text style={styles.planForChildren}>
                        For {selectedCount} {selectedCount > 1 ? 'children' : 'child'}
                      </Text>
                      {effectiveDiscountAmt > 0 && (
                        <Text style={styles.planSaveText}>
                          Save: Rs. {effectiveDiscountAmt.toLocaleString()}
                        </Text>
                      )}
                      <Text style={styles.planTotalText}>
                        Total: Rs. {effectiveFinalPrice.toLocaleString()}
                      </Text>
                    </>
                  )}
                </View>

                {/* Date-picker + working-days info buttons (selected plan only) */}
                {isSelected && (
                  <View style={styles.planCardRightBtns}>
                    <TouchableOpacity
                      style={styles.datePickerBtn}
                      onPress={() => {
                        setSelectedPlan(plan);
                        setShowDatePickerFor(plan.days);
                      }}
                      activeOpacity={0.75}>
                      <Text style={styles.datePickerIcon}>📅</Text>
                      <Text style={styles.datePickerDate} numberOfLines={1}>
                        {formatDateShort(effectiveStart)}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.infoIconBtn}
                      onPress={() => setWorkingDaysModalFor(plan.days)}
                      activeOpacity={0.75}
                      hitSlop={{top: 6, left: 6, bottom: 6, right: 6}}>
                      <Text style={styles.infoIconText}>ℹ</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Expanded plan details — shown only when this plan is selected */}
              {isSelected && (
                <View style={styles.planExpandedSection}>
                  <View style={styles.planExpandedDivider} />
                  <View style={styles.planDetailRow}>
                    <Text style={styles.detailLabel}>Start Date:</Text>
                    <Text style={styles.detailValue}>{formatDateShort(effectiveStart)}</Text>
                  </View>
                  <View style={styles.planDetailRow}>
                    <Text style={styles.detailLabel}>End Date:</Text>
                    <Text style={styles.detailValue}>{formatDateShort(effectiveEnd)}</Text>
                  </View>
                  <View style={styles.planDetailRow}>
                    <Text style={styles.detailLabel}>Total Working Days:</Text>
                    <Text style={styles.detailValue}>{plan.days}</Text>
                  </View>
                  <View style={styles.planDetailRow}>
                    <Text style={styles.detailLabel}>Price per day per child:</Text>
                    <Text style={styles.detailValue}>Rs. {PER_DAY_COST}</Text>
                  </View>
                  {isCustomDate && (
                    <Text style={styles.customDateNote}>
                      ℹ️ Custom start date — only base offer applies (no multi-child uplift).
                    </Text>
                  )}
                </View>
              )}

              {customError && (
                <Text style={styles.customDateError}>{customError}</Text>
              )}
            </TouchableOpacity>
          );
        })}

        {/* ── Offers Available ──────────────────────────────────── */}
        {(() => {
          const selectedCustomStart =
            selectedPlan != null ? (customStartDates[selectedPlan.days] ?? null) : null;
          // Show the warning only when the custom date is truly different from the
          // plan's default start (i.e. it will actually suppress multi-child discounts).
          const selectedHasCustomDate =
            selectedPlan != null &&
            selectedCustomStart != null &&
            !isSameCalendarDay(selectedCustomStart, selectedPlan.startDate);
          return (
            <View style={styles.offersCard}>
              <Text style={styles.offersTitle}>OFFERS AVAILABLE</Text>
              {selectedHasCustomDate && (
                <Text style={styles.customDateOfferNote}>
                  ⚠️ Custom start date selected — only single-child base pricing applies. Multi-child discounts require the default start date to ensure consistent calculations.
                </Text>
              )}
              {selectedCount >= config.multiChildThreshold ? (
                // Multi-child offers
                <>
                  {config.multiChildDiscounts.oneMonth > 0 && (
                    <Text style={styles.offerItem}>
                      {'• Save '}
                      <Text style={styles.offerBold}>{config.multiChildDiscounts.oneMonth}%</Text>
                      {` on the ${config.planDurations.oneMonth} Working Days Plan (for ${config.multiChildThreshold}+ children).`}
                    </Text>
                  )}
                  {config.multiChildDiscounts.threeMonths > 0 && (
                    <Text style={styles.offerItem}>
                      {'• Save '}
                      <Text style={styles.offerBold}>{config.multiChildDiscounts.threeMonths}%</Text>
                      {` on the ${config.planDurations.threeMonths} Working Days Plan (for ${config.multiChildThreshold}+ children).`}
                    </Text>
                  )}
                  {config.multiChildDiscounts.sixMonths > 0 && (
                    <Text style={styles.offerItem}>
                      {'• Save '}
                      <Text style={styles.offerBold}>{config.multiChildDiscounts.sixMonths}%</Text>
                      {` on the ${config.planDurations.sixMonths} Working Days Plan (for ${config.multiChildThreshold}+ children).`}
                    </Text>
                  )}
                  <Text style={styles.offerNote}>
                    Note: Per Day Meal = Rs. {PER_DAY_COST} (No. of Days × Rs. {PER_DAY_COST} × {selectedCount} children = Subscription Amount)
                  </Text>
                </>
              ) : (
                // Single-child offers
                <>
                  {config.singleChildDiscounts.oneMonth > 0 && (
                    <Text style={styles.offerItem}>
                      {'• Save '}
                      <Text style={styles.offerBold}>{config.singleChildDiscounts.oneMonth}%</Text>
                      {` on the ${config.planDurations.oneMonth} Working Days Plan.`}
                    </Text>
                  )}
                  {config.singleChildDiscounts.threeMonths > 0 && (
                    <Text style={styles.offerItem}>
                      {'• Save '}
                      <Text style={styles.offerBold}>{config.singleChildDiscounts.threeMonths}%</Text>
                      {` on the ${config.planDurations.threeMonths} Working Days Plan.`}
                    </Text>
                  )}
                  {config.singleChildDiscounts.sixMonths > 0 && (
                    <Text style={styles.offerItem}>
                      {'• Save '}
                      <Text style={styles.offerBold}>{config.singleChildDiscounts.sixMonths}%</Text>
                      {` on the ${config.planDurations.sixMonths} Working Days Plan.`}
                    </Text>
                  )}
                  <Text style={styles.offerNote}>
                    Note: Per Day Meal = Rs. {PER_DAY_COST} (No. of Days × Rs. {PER_DAY_COST} × {selectedCount} {selectedCount > 1 ? 'children' : 'child'} = Subscription Amount)
                  </Text>
                </>
              )}
            </View>
          );
        })()}

        {/* ── Back / Next buttons ───────────────────────────────── */}
        <View style={styles.btnRow}>
          <PrimaryButton title="BACK" onPress={prevStep} style={styles.backBtn} />
          <PrimaryButton
            title="NEXT"
            onPress={handleNext}
            disabled={isNextButtonDisabled}
            style={styles.nextBtn}
          />
        </View>
      </ScrollView>

      {/* ── Working Days helper modal ───────────────────────────── */}
      {workingDaysModalFor !== null && (() => {
        const plan = plans.find(p => p.days === workingDaysModalFor);
        if (!plan) return null;
        const customStart = customStartDates[plan.days] ?? null;
        const isCustomForModal = selectedPlan?.days === plan.days && customStart != null;
        const modalStart = customStart ?? plan.startDate;
        const modalEnd = isCustomForModal
          ? addWorkingDays(customStart, plan.days, holidays)
          : plan.endDate;
        return (
          <WorkingDaysModal
            visible
            onClose={() => setWorkingDaysModalFor(null)}
            startDate={modalStart}
            endDate={modalEnd}
            holidays={holidays}
            totalWorkingDays={plan.days}
          />
        );
      })()}

      {/* ── Per-plan date picker (rendered outside ScrollView so it overlays properly) */}
      {showDatePickerFor !== null && (() => {
        // Capture planDays before the state is cleared inside onChange
        const planDays = showDatePickerFor;
        const minDate = getEffectiveStartDate(new Date(), holidays);
        return (
          <DateTimePicker
            value={customStartDates[planDays] ?? minDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
            minimumDate={minDate}
            onChange={(e, date) => {
              setShowDatePickerFor(null);
              if (e.type === 'dismissed' || !date) return;
              const picked = new Date(date.getFullYear(), date.getMonth(), date.getDate());
              const min = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
              if (picked < min) {
                setCustomDateErrors(prev => ({
                  ...prev,
                  [planDays]: `Start date must be from ${formatDateShort(min)} onwards.`,
                }));
                return;
              }
              if (!isWorkingDay(picked, holidays)) {
                const dow = picked.getDay();
                const isWeekendPicked = dow === 0 || dow === 6;
                const pickedStr = toLocalDateStr(picked);
                const holidayName = holidays.find(h => h.date === pickedStr)?.name;
                const reason = isWeekendPicked
                  ? 'Weekends are not working days.'
                  : holidayName
                  ? `${holidayName} is a public holiday.`
                  : 'This is not a working day.';
                setCustomDateErrors(prev => ({
                  ...prev,
                  [planDays]: `Cannot select this date — ${reason} Please choose a weekday that is not a holiday.`,
                }));
                return;
              }
              setCustomDateErrors(prev => ({...prev, [planDays]: null}));
              setCustomStartDates(prev => ({...prev, [planDays]: picked}));
            }}
          />
        );
      })()}
    </View>
  );
}

const styles = StyleSheet.create({
  // ── Child selector ────────────────────────────────────────────
  childSelectorCard: {
    borderWidth: 1,
    borderColor: Colors.lightRed,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: Colors.white,
  },
  childSelectorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.bodyText,
    marginBottom: 8,
  },
  childSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  childSelectorName: {
    fontSize: 15,
    marginLeft: 8,
    color: Colors.black,
  },
  childSelectorWarn: {
    fontSize: 13,
    color: Colors.red,
    marginTop: 4,
  },

  // ── Section label ─────────────────────────────────────────────
  planSectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryOrange,
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  planSectionNote: {
    fontWeight: '400',
    color: Colors.default,
    fontSize: 12,
  },

  // ── Plan card ─────────────────────────────────────────────────
  planCard: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    backgroundColor: Colors.white,
  },
  selectedCard: {
    borderColor: Colors.primaryOrange,
    backgroundColor: Colors.lightRed,
  },

  // Plan card header row (radio + title area + date button)
  planHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.Storke,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  radioCircleSelected: {
    borderColor: Colors.primaryOrange,
  },
  radioDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: Colors.primaryOrange,
  },
  planTitleArea: {
    flex: 1,
  },
  planText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.bodyText,
  },
  selectedText: {
    color: Colors.primaryOrange,
  },
  // Collapsed (non-selected) sub-line showing strikethrough + discount
  planCollapsedSub: {
    fontSize: 12,
    color: Colors.default,
    marginTop: 2,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: Colors.default,
  },
  discountBadge: {
    color: Colors.primaryOrange,
    fontWeight: '600',
  },
  // Selected plan sub-lines
  planForChildren: {
    fontSize: 13,
    color: Colors.default,
    marginTop: 2,
  },
  planSaveText: {
    fontSize: 13,
    color: Colors.bodyText,
    marginTop: 1,
  },
  planTotalText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryOrange,
    marginTop: 2,
  },

  // Calendar date-picker button inside selected plan card
  datePickerBtn: {
    borderWidth: 1,
    borderColor: Colors.primaryOrange,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    alignItems: 'center',
    marginLeft: 8,
    minWidth: 90,
    maxWidth: 110,
  },
  datePickerIcon: {
    fontSize: 14,
  },
  datePickerDate: {
    fontSize: 10,
    color: Colors.primaryOrange,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },

  // Expanded plan details (start/end date, working days, price/day)
  planExpandedSection: {
    marginTop: 10,
  },
  planExpandedDivider: {
    height: 1,
    backgroundColor: Colors.primaryOrange,
    opacity: 0.25,
    marginBottom: 8,
  },
  planDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  detailLabel: {
    fontSize: 13,
    color: Colors.bodyText,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    color: Colors.bodyText,
  },
  customDateNote: {
    fontSize: 11,
    color: Colors.primaryOrange,
    fontStyle: 'italic',
    marginTop: 5,
  },
  customDateError: {
    fontSize: 12,
    color: Colors.red,
    marginTop: 5,
  },

  // ── Offers card ───────────────────────────────────────────────
  offersCard: {
    borderWidth: 1,
    borderColor: Colors.lightRed,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    backgroundColor: Colors.white,
  },
  offersTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryOrange,
    marginBottom: 6,
    letterSpacing: 0.4,
  },
  offerItem: {
    fontSize: 13,
    color: Colors.bodyText,
    marginBottom: 3,
    lineHeight: 18,
  },
  offerBold: {
    fontWeight: '700',
    color: Colors.bodyText,
  },
  offerNote: {
    fontSize: 11,
    color: Colors.default,
    fontStyle: 'italic',
    marginTop: 6,
    lineHeight: 16,
  },

  // ── Back / Next row ───────────────────────────────────────────
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  backBtn: {
    flex: 1,
    marginRight: 10,
  },
  nextBtn: {
    flex: 1,
    marginLeft: 10,
  },

  // ── Plan card right-side button group (date picker + info icon) ─
  planCardRightBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  infoIconBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: Colors.primaryOrange,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  infoIconText: {
    fontSize: 13,
    color: Colors.primaryOrange,
    fontWeight: '700',
    lineHeight: 16,
  },

  // ── Offers card: custom-date warning note ─────────────────────
  customDateOfferNote: {
    fontSize: 12,
    color: Colors.primaryOrange,
    fontStyle: 'italic',
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primaryOrange,
    paddingLeft: 6,
    lineHeight: 18,
  },
});

// ── Working Days Modal styles ─────────────────────────────────────────────
const modalSt = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    width: '100%',
    maxWidth: 400,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryOrange,
    flex: 1,
    marginRight: 8,
    lineHeight: 18,
  },
  closeX: {
    fontSize: 16,
    color: Colors.bodyText,
    fontWeight: '700',
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  navArrow: {
    fontSize: 24,
    color: Colors.primaryOrange,
    fontWeight: '700',
    paddingHorizontal: 8,
  },
  monthLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.black,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '600',
    color: Colors.bodyText,
    paddingVertical: 4,
  },
  weekendHeader: {
    color: Colors.red,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%` as any,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNum: {
    fontSize: 12,
    fontWeight: '600',
  },
  holidayDot: {
    position: 'absolute',
    top: 4,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.red,
  },
  legend: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.Storke,
    paddingTop: 10,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  legendSwatch: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 4,
  },
  legendDotItem: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.red,
    marginRight: 4,
  },
  legendText: {
    fontSize: 11,
    color: Colors.bodyText,
    marginRight: 10,
  },
  infoLine: {
    fontSize: 12,
    color: Colors.bodyText,
    marginTop: 8,
    textAlign: 'center',
  },
  infoLineBold: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryOrange,
    marginTop: 4,
    textAlign: 'center',
  },
});
