import CheckBox from '@react-native-community/checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useFocusEffect} from '@react-navigation/native';
import {Colors} from 'assets/styles/colors';
import PrimaryButton from 'components/buttons/PrimaryButton';
import ErrorMessage from 'components/Error/BoostrapStyleError';
import {LoadingModal} from 'components/LoadingModal/LoadingModal';
import {useAuth} from 'context/AuthContext';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import HolidayService from 'services/MyPlansApi/HolidayService';
import RegistrationService from 'services/RegistartionService/registartion';
import {Holiday} from 'src/model/calendarModels';

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

  return temp; // final working day
};

const isWorkingDay = (date: Date): boolean => {
  const day = date.getDay();
  return day !== 0 && day !== 6; // not Sun(0) or Sat(6)
};

const getValidStartDate = (base: Date, prepDays: number = 2): Date => {
  let newDate = new Date(base);
  newDate.setDate(newDate.getDate() + prepDays); // add preparation days

  // if holiday → keep moving forward until working day
  while (!isWorkingDay(newDate)) {
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

  // Convert holidays into a Set for quick lookup (YYYY-MM-DD format)
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

export default function SubscriptionPlan({
  selectedPlan,
  setSelectedPlan,
  childCount,
  prevStep,
  nextStep,
  isRenewal,
}: any) {
  //####################### STATE VARIABLES ######################

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const {userId, authToken} = useAuth();
  const [PER_DAY_COST, setPerDayCost] = useState(200);
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  //####################### PLAN DISCOUNT  ######################

  const applyDiscount = (days: number, basePrice: number) => {
    let discountPercent = 0;

    if (days === 66) {
      discountPercent = 5;
    } else if (days === 132) {
      discountPercent = 10;
    }

    const discountAmount = (basePrice * discountPercent) / 100;
    const finalPrice = basePrice - discountAmount;

    return {finalPrice, discountPercent, discountAmount};
  };
  //####################### GENERATE PLAN  ######################

  const generatePlans = (holidays: Holiday[]) => {
    const today = new Date();
    const start = getValidStartDate(today, 2);

    // Example mapping: 1 month=22d, 3 months=66d, 6 months=132d
    const monthToWorkingDays = {
      1: 22,
      3: 66,
      6: 132,
    };

    return [1, 3, 6].map(m => {
      const requiredDays = monthToWorkingDays[m as 1 | 3 | 6];
      const end = addWorkingDays(start, requiredDays, holidays);

      const basePrice = requiredDays * PER_DAY_COST;
      const {finalPrice, discountPercent, discountAmount} = applyDiscount(
        requiredDays,
        basePrice,
      );

      return {
        days: requiredDays,
        price: finalPrice,
        basePrice,
        discountPercent,
        discountAmount,
        startDate: start,
        endDate: end,
      };
    });
  };
  const [plans, setPlans] = useState<Plan[]>(() => generatePlans(holidays));

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

  //######### GET PERDAY PRICE API CALL ############################

  const getPerDayCost = async (authToken: string) => {
    try {
      const response: any = await RegistrationService.getPerDayCost(authToken);
      if (response?.data?.perDayCost) {
        setPerDayCost(response.data.perDayCost);
      } else {
        setPerDayCost(200); // fallback
      }
    } catch (error) {
      console.error('Error fetching per-day cost:', error);
      setPerDayCost(200); // fallback
    }
  };

  useFocusEffect(
    useCallback(() => {
      GetHolidays();
      if (authToken) {
        getPerDayCost(authToken);
      }
    }, [authToken]),
  );

  useEffect(() => {
    if (holidays.length > 0) {
      setPlans(generatePlans(holidays));
    }
  }, [holidays]);
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
      // Subscription by custom date
      sDate = startDate.toISOString().split('T')[0];
      eDate = endDate.toISOString().split('T')[0];

      workingDays = getWorkingDaysBetween(startDate, endDate, holidays);
      totalPrice = workingDays * PER_DAY_COST * childCount;
      planId = 'byDate';
    } else if (selectedPlan) {
      // Predefined plan (1, 3, 6 months)
      workingDays = selectedPlan.days;
      totalPrice = selectedPlan.price * childCount;
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
        numberOfChildren: childCount,
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

  return (
    <View>
      <LoadingModal loading={loading} setLoading={setLoading} />
      {error && <ErrorMessage error={error} onClose={handleCloseError} />}
      <ScrollView showsVerticalScrollIndicator={false}>
        {plans.map(plan => {
          const totalAmount = plan.price * childCount;

          return (
            <TouchableOpacity
              key={plan.days}
              style={[
                styles.planCard,
                selectedPlan?.days === plan.days && styles.selectedCard,
              ]}
              onPress={() => {
                setIsChecked(false);
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
                  {plan.days} Working Days - Rs. {plan.price.toLocaleString()}
                </Text>
                <Text style={{fontSize: 13, color: '#666'}}>
                  For {childCount} {childCount > 1 ? 'children' : 'child'}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: Colors.primaryOrange,
                  }}>
                  Total: Rs. {totalAmount.toLocaleString()}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Subscription By Date (Pre Book) */}

        <View style={styles.container}>
          <View style={styles.headerRow}>
            <CheckBox
              value={isChecked}
              onValueChange={val => {
                setIsChecked(val);
                if (val) {
                  setSelectedPlan(null);
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
                <Text style={styles.dateText}>
                  {startDate ? startDate.toDateString() : 'Start Date'}
                </Text>
              </TouchableOpacity>

              {/* End Date */}
              <TouchableOpacity
                style={styles.dateBox}
                onPress={() => setShowEnd(true)}>
                <Text style={styles.dateText}>
                  {endDate ? endDate.toDateString() : 'End Date'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Date Pickers */}
          {showStart && (
            <DateTimePicker
              value={startDate || new Date()}
              mode="date"
              display="calendar"
              onChange={(e, date) => {
                setShowStart(false);
                if (date) setStartDate(date);
              }}
            />
          )}

          {showEnd && (
            <DateTimePicker
              value={endDate || new Date()}
              mode="date"
              display="calendar"
              onChange={(e, date) => {
                setShowEnd(false);
                if (date) setEndDate(date);
              }}
            />
          )}
        </View>
      </ScrollView>

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

              {/* Show base price */}
              <Text style={styles.summaryText}>
                Base Price per Child: Rs.{' '}
                {selectedPlan.basePrice?.toLocaleString()}
              </Text>

              {/* If discount applied */}
              {selectedPlan.discountPercent > 0 && (
                <Text style={styles.summaryText}>
                  Discount: {selectedPlan.discountPercent}% (-Rs.
                  {selectedPlan.discountAmount?.toLocaleString()})
                </Text>
              )}

              {/* Final price per child */}
              <Text style={styles.summaryText}>
                Final Price per Child: Rs. {selectedPlan.price.toLocaleString()}
              </Text>

              {/* Total for children */}
              <Text style={styles.summaryTotal}>
                Total for {childCount} {childCount > 1 ? 'children' : 'child'}:
                Rs. {(selectedPlan.price * childCount).toLocaleString()}
              </Text>
            </>
          )}

          {isChecked && startDate && endDate && (
            <>
              <Text style={styles.summaryText}>
                Start Date: {startDate.toDateString()}
              </Text>
              <Text style={styles.summaryText}>
                End Date: {endDate.toDateString()}
              </Text>

              <Text style={styles.summaryText}>
                Working Days:{' '}
                {getWorkingDaysBetween(startDate, endDate, holidays)}
              </Text>

              <Text style={styles.summaryText}>
                Price per Child: Rs.{' '}
                {(
                  getWorkingDaysBetween(startDate, endDate, holidays) *
                  PER_DAY_COST
                ).toLocaleString()}
              </Text>

              <Text style={styles.summaryTotal}>
                Total for {childCount} {childCount > 1 ? 'children' : 'child'}:
                Rs.{' '}
                {(
                  getWorkingDaysBetween(startDate, endDate, holidays) *
                  PER_DAY_COST *
                  childCount
                ).toLocaleString()}
              </Text>
            </>
          )}
        </View>
      )}

      {/* Footer Buttons */}
      <View style={styles.btnRow}>
        <PrimaryButton title="BACK" onPress={prevStep} style={styles.backBtn} />
        <PrimaryButton
          title="NEXT"
          onPress={handleNext}
          style={styles.nextBtn}
        />
      </View>
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
  dateText: {
    color: Colors.default,
    fontSize: 14,
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
});
