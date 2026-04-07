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

//####################### HELPER FUNCTIONS   ######################

type Plan = {
  days: number;
  price: number;
};

const addWorkingDays = (
  start: Date,
  requiredDays: number,
  holidays: Holiday[] = [],
): Date => {
  const holidaySet = new Set(
    holidays.map(h => new Date(h.date).toISOString().split('T')[0]),
  );

  let count = 0;
  let temp = new Date(start);

  while (count < requiredDays) {
    const day = temp.getDay();
    const dateStr = temp.toISOString().split('T')[0];

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
  return !holidaySet.has(date.toISOString().split('T')[0]);
};

/**
 * Returns the next working day starting from `base`, using `getNextCalendarDay`
 * as the base and then advancing past weekends and holidays.
 *
 * Next-day logic: any action performed today → effective start date is tomorrow.
 */
const getEffectiveStartDate = (base: Date, holidays: Holiday[] = []): Date => {
  // Start from the next calendar day (tomorrow at midnight)
  let newDate = getNextCalendarDay(base);
  // Advance further if that day is a weekend or holiday
  while (!isWorkingDay(newDate, holidays)) {
    newDate.setDate(newDate.getDate() + 1);
  }
  return newDate;
};

const getWorkingDaysBetween = (
  start: Date,
  end: Date,
  holidays: Holiday[] = [],
): number => {
  let count = 0;
  let temp = new Date(start);
  const holidaySet = new Set(
    holidays.map(h => new Date(h.date).toISOString().split('T')[0]),
  );

  while (temp <= end) {
    const day = temp.getDay();
    const dateStr = temp.toISOString().split('T')[0];
    if (day !== 0 && day !== 6 && !holidaySet.has(dateStr)) {
      count++;
    }
    temp.setDate(temp.getDate() + 1);
  }
  return count;
};

/** Returns the last working day of the given year/month (0-indexed month). */
const getLastWorkingDayOfMonth = (
  year: number,
  month: number,
  holidays: Holiday[] = [],
): Date => {
  const holidaySet = new Set(
    holidays.map(h => new Date(h.date).toISOString().split('T')[0]),
  );
  // day 0 of next month = last day of this month
  let temp = new Date(year, month + 1, 0);
  while (
    temp.getDay() === 0 ||
    temp.getDay() === 6 ||
    holidaySet.has(temp.toISOString().split('T')[0])
  ) {
    temp.setDate(temp.getDate() - 1);
  }
  return temp;
};

/**
 * Auto-calculates the end date for a custom plan:
 *  - If ≥ 3 working days remain in the start month → last working day of that month
 *  - Otherwise → last working day of the following month
 */
const calculateCustomEndDate = (start: Date, holidays: Holiday[]): Date => {
  const endOfThisMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0);
  const workingDaysLeft = getWorkingDaysBetween(start, endOfThisMonth, holidays);

  if (workingDaysLeft >= 3) {
    return getLastWorkingDayOfMonth(start.getFullYear(), start.getMonth(), holidays);
  }

  const nextMonth = start.getMonth() + 1;
  const nextYear = nextMonth > 11 ? start.getFullYear() + 1 : start.getFullYear();
  const actualNextMonth = nextMonth > 11 ? 0 : nextMonth;
  return getLastWorkingDayOfMonth(nextYear, actualNextMonth, holidays);
};

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
  // Per the business rules, "Subscription By Date" plans always use the
  // single-child (base) discount tier, regardless of how many children are
  // actually selected.  Passing count=1 into applyDiscount ensures the
  // multi-child uplift is never triggered for custom-date plans.
  const SINGLE_CHILD_COUNT = 1;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [showStart, setShowStart] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [customDateError, setCustomDateError] = useState<string | null>(null);
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
   * NOTE: "Subscription By Date" plans always use base (single-child) discounts
   * regardless of the number of children — the caller must pass `isCustomDate=true`.
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

  const generatePlans = (holidays: Holiday[], childrenCount: number = 1) => {
    const today = new Date();
    const start = getEffectiveStartDate(today, holidays);

    const {planDurations} = config;
    const planMonths: Array<{months: number; days: number}> = [
      {months: 1, days: planDurations.oneMonth},
      {months: 3, days: planDurations.threeMonths},
      {months: 6, days: planDurations.sixMonths},
    ];

    return planMonths.map(({days: requiredDays}) => {
      const end = addWorkingDays(start, requiredDays, holidays);

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
        const holidays = response.data.map((holiday: any) => {
          const dateObj = new Date(holiday.date);
          const formattedDate = dateObj.toISOString().split('T')[0];
          return {
            id: holiday._id,
            name: holiday.name,
            date: formattedDate,
          };
        });
        setHolidays(holidays);
      } else {
        console.error('Invalid data format', response);
      }
    } catch (error) {
      console.error('Error fetching holidays:', error);
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
  //######### PLAN DETAILS API CALL ############################

  const handleNext = async () => {
    let workingDays = 0;
    let totalPrice = 0;
    let planId = '';
    let sDate = null;
    let eDate = null;

    if (isChecked && startDate && endDate) {
      // Subscription by custom date: base discount only, no multi-child uplift
      sDate = startDate.toISOString().split('T')[0];
      eDate = endDate.toISOString().split('T')[0];

      workingDays = getWorkingDaysBetween(startDate, endDate, holidays);
      const basePriceTotal = workingDays * PER_DAY_COST * selectedCount;
      const {finalPrice} = applyDiscount(workingDays, basePriceTotal, SINGLE_CHILD_COUNT, true); // isCustomDate=true — base discount only (spec: custom-date ignores multi-child pricing)
      totalPrice = finalPrice;
      planId = 'byDate';
    } else if (selectedPlan) {
      // Predefined plan (1, 3, 6 months) — price already computed with multi-child discount
      workingDays = selectedPlan.days;
      totalPrice = selectedPlan.price; // price is already the total (all children)
      planId = `${selectedPlan.days}-days`;

      sDate = selectedPlan.startDate?.toISOString().split('T')[0] ?? null;
      eDate = selectedPlan.endDate?.toISOString().split('T')[0] ?? null;
    }

    const payload: any = {
      step: 3,
      path: isRenewal ? 'step-Form-Renew-SubscriptionPlan' : 'step-Form-SubscriptionPlan',
      payload: {
        selectedPlan: planId,
        workingDays,
        totalPrice,
        startDate: sDate,
        endDate: eDate,
        numberOfChildren: selectedCount,
        children: selectedChildIds,
      },
      _id: userId,
    };

    try {
      setLoading(true);

      console.log(
        '++++++++++++++++++++++++++Sending payload ******************************:',
        payload,
      );
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

  const isPlanSelected = selectedPlan != null || (isChecked && startDate != null && endDate != null);
  const isNextButtonDisabled = selectedCount === 0 || !isPlanSelected;

  return (
    <View style={{flex: 1}}>
      <LoadingModal loading={loading} setLoading={setLoading} />
      {error && <ErrorMessage error={error} onClose={handleCloseError} />}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 24}}>
        {/* Child Selector */}
        {childrenData && childrenData.length > 0 && (
          <View style={styles.childSelectorCard}>
            <Text style={styles.childSelectorTitle}>
              Select Children for this Plan
            </Text>
            {childrenData.map((child: any) => {
              const id = child._id;
              const isSelected = selectedChildIds.includes(id);
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
                    value={isSelected}
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

        {plans.map(plan => (
            <TouchableOpacity
              key={plan.days}
              style={[
                styles.planCard,
                selectedPlan?.days === plan.days && styles.selectedCard,
              ]}
              onPress={() => {
                setIsChecked(false);
                setStartDate(null);
                setEndDate(null);
                setCustomDateError(null);
                setSelectedPlan(plan);
              }}>
              <View style={styles.radioCircle}>
                {selectedPlan?.days === plan.days && (
                  <View style={styles.radioDot} />
                )}
              </View>
              <View style={{flex: 1}}>
                <Text
                  style={[
                    styles.planText,
                    selectedPlan?.days === plan.days && styles.selectedText,
                  ]}>
                  {plan.days} Working Days
                  {plan.discountPercent > 0 ? ` (${plan.discountPercent}% off)` : ''}
                </Text>
                <Text style={{fontSize: 13, color: '#666'}}>
                  For {selectedCount} {selectedCount > 1 ? 'children' : 'child'}
                </Text>
                {plan.discountAmount > 0 && (
                  <Text style={{fontSize: 13, color: Colors.bodyText}}>
                    Save: Rs. {plan.discountAmount.toLocaleString()}
                  </Text>
                )}
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: Colors.primaryOrange,
                  }}>
                  Total: Rs. {plan.price.toLocaleString()}
                </Text>
              </View>
            </TouchableOpacity>
          ))}

        {/* Subscription By Date (Pre Book) */}
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <CheckBox
              value={isChecked}
              onValueChange={val => {
                setIsChecked(val);
                if (val) {
                  setSelectedPlan(null);
                  const minStart = getEffectiveStartDate(new Date(), holidays);
                  setStartDate(minStart);
                  setEndDate(calculateCustomEndDate(minStart, holidays));
                  setCustomDateError(null);
                } else {
                  setStartDate(null);
                  setEndDate(null);
                  setCustomDateError(null);
                }
              }}
              tintColors={{true: '#007BFF', false: '#ccc'}}
            />
            <Text style={styles.label}>
              Subscription By Date{' '}
              <Text style={styles.subLabel}>(Pre Book)</Text>
            </Text>
          </View>

          {isChecked && (
            <View style={styles.dateRow}>
              <TouchableOpacity
                style={styles.dateBox}
                onPress={() => setShowStart(true)}>
                <Text style={styles.dateLabel}>Start Date</Text>
                <Text style={styles.dateText}>
                  {startDate ? startDate.toDateString() : 'Select'}
                </Text>
              </TouchableOpacity>

              <View style={[styles.dateBox, styles.dateBoxReadOnly]}>
                <Text style={styles.dateLabel}>End Date (auto)</Text>
                <Text style={styles.dateText}>
                  {endDate ? endDate.toDateString() : '—'}
                </Text>
              </View>
            </View>
          )}

          {customDateError ? (
            <Text style={styles.customDateError}>{customDateError}</Text>
          ) : null}

          {showStart && (
            <DateTimePicker
              value={startDate || getEffectiveStartDate(new Date(), holidays)}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
              minimumDate={getEffectiveStartDate(new Date(), holidays)}
              onChange={(e, date) => {
                setShowStart(false);
                if (!date) return;
                const minDate = getEffectiveStartDate(new Date(), holidays);
                const picked = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                const min = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
                if (picked < min) {
                  setCustomDateError(
                    `Start date must be from tomorrow onwards (${min.toDateString()})`,
                  );
                  return;
                }
                if (!isWorkingDay(picked, holidays)) {
                  setCustomDateError('Please select a working day (no weekends or holidays).');
                  return;
                }
                setCustomDateError(null);
                setStartDate(picked);
                setEndDate(calculateCustomEndDate(picked, holidays));
              }}
            />
          )}
        </View>

        {/* Selected Plan Details */}
        {(selectedPlan || (isChecked && startDate && endDate)) && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Plan Details</Text>

            {selectedPlan && (
              <>
                <Text style={styles.summaryText}>
                  Working Days: {selectedPlan.days}
                </Text>
                <Text style={styles.summaryText}>
                  Start Date: {selectedPlan.startDate?.toDateString()}
                </Text>
                <Text style={styles.summaryText}>
                  End Date: {selectedPlan.endDate?.toDateString()}
                </Text>
                <Text style={styles.summaryText}>
                  Price per day per child: Rs. {PER_DAY_COST}
                </Text>
                <Text style={styles.summaryText}>
                  Number of children: {selectedCount}
                </Text>
                <Text style={styles.summaryText}>
                  Base Total: Rs. {selectedPlan.basePrice?.toLocaleString()}
                </Text>
                {selectedPlan.discountPercent > 0 && (
                  <Text style={styles.summaryText}>
                    Discount: {selectedPlan.discountPercent}% (Save Rs.{' '}
                    {selectedPlan.discountAmount?.toLocaleString()})
                  </Text>
                )}
                <Text style={styles.summaryTotal}>
                  Total for {selectedCount}{' '}
                  {selectedCount > 1 ? 'children' : 'child'}:{' '}
                  Rs. {selectedPlan.price.toLocaleString()}
                </Text>
              </>
            )}

            {isChecked && startDate && endDate && (() => {
              const customDays = getWorkingDaysBetween(startDate, endDate, holidays);
              const basePriceTotal = customDays * PER_DAY_COST * selectedCount;
              // Custom date: base discount only, no multi-child uplift
              const {finalPrice, discountPercent, discountAmount} = applyDiscount(customDays, basePriceTotal, SINGLE_CHILD_COUNT, true); // base discount only (spec: custom-date ignores multi-child pricing)
              return (
                <>
                  <Text style={styles.summaryText}>
                    Start Date: {startDate.toDateString()}
                  </Text>
                  <Text style={styles.summaryText}>
                    End Date: {endDate.toDateString()}
                  </Text>
                  <Text style={styles.summaryText}>
                    Working Days: {customDays}
                  </Text>
                  <Text style={styles.summaryText}>
                    Price per day per child: Rs. {PER_DAY_COST}
                  </Text>
                  <Text style={styles.summaryText}>
                    Number of children: {selectedCount}
                  </Text>
                  <Text style={styles.summaryText}>
                    Base Total: Rs. {basePriceTotal.toLocaleString()}
                  </Text>
                  {discountPercent > 0 && (
                    <Text style={styles.summaryText}>
                      Discount: {discountPercent}% (Save Rs. {discountAmount.toLocaleString()})
                    </Text>
                  )}
                  <Text style={styles.summaryTotal}>
                    Total for {selectedCount}{' '}
                    {selectedCount > 1 ? 'children' : 'child'}:{' '}
                    Rs. {finalPrice.toLocaleString()}
                  </Text>
                </>
              );
            })()}
          </View>
        )}

        {/* Footer Buttons — inside ScrollView so they're always reachable */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: Colors.lightRed,
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginLeft: 6,
    fontWeight: '500',
  },
  subLabel: {
    fontSize: 12,
    color: 'gray',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  dateBox: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingVertical: 14,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  dateBoxReadOnly: {
    opacity: 0.7,
  },
  dateLabel: {
    fontSize: 11,
    color: Colors.bodyText,
    marginBottom: 2,
  },
  dateText: {
    color: Colors.default,
    fontSize: 14,
  },
  customDateError: {
    fontSize: 12,
    color: Colors.red,
    marginTop: 6,
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.red,
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    backgroundColor: Colors.white,
  },
  selectedCard: {
    borderColor: Colors.primaryOrange,
    backgroundColor: Colors.lightRed,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.Storke,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: Colors.primaryOrange,
  },
  planText: {
    fontSize: 16,
    color: Colors.bodyText,
  },
  selectedText: {
    color: Colors.primaryOrange,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backBtn: {
    flex: 1,
    marginRight: 10,
  },
  nextBtn: {
    flex: 1,
    marginLeft: 10,
  },

  summaryCard: {
    borderWidth: 1,
    borderColor: Colors.lightRed,
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
    backgroundColor: Colors.white,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.primaryOrange,
  },
  summaryText: {
    fontSize: 14,
    color: Colors.bodyText,
    marginBottom: 4,
  },
  summaryTotal: {
    fontSize: 15,
    color: Colors.primaryOrange,
    marginTop: 6,
  },
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
});
