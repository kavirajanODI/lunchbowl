import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import {LoadingModal} from 'components/LoadingModal/LoadingModal';
import PaginationDots from 'components/paginations.tsx/PrimaryPagination';
import Typography from 'components/Text/Typography';
import {useAuth} from 'context/AuthContext';
import {useRegistration} from 'context/RegistrationContext';
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import HeaderBackButton from 'screens/Dashboard/Components/BackButton';
import UserService from 'services/userService';
import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import PaymentOptions from './Components/forms/PaymentOptions';
import styles from './Components/forms/Styles/styles';
import SubscriptionPlan from './Components/forms/Subscription';
import {
  calculateWalletRedemption,
  normalizeSelectedChildren,
  toggleChildSelection as toggleChildSelectionIds,
} from 'utils/subscriptionLogic';
import PaymentService from 'services/PaymentService/paymentService';

type RenewStep = 1 | 2 | 3;

export default function RenewSubscription({navigation}: any) {
  const {userId} = useAuth();
  const {refreshRegistration} = useRegistration();
  const [step, setStep] = useState<RenewStep>(1);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Wallet state — hoisted here so the toggle lives in step 2 and the
  // payment values flow into step 3 without re-fetching.
  const [walletPoints, setWalletPoints] = useState<number>(0);
  const [applyWallet, setApplyWallet] = useState<boolean>(false);

  const planPrice = selectedPlan?.price ?? 0;
  const {
    redeemedPoints: walletUsed,
    remainingWalletPoints: remainingWallet,
    finalAmount: finalPayable,
  } = calculateWalletRedemption({
    totalPrice: planPrice,
    walletPoints,
    applyWallet,
    maxPercent: 0.8,
  });

  // Hide the floating tab bar while this screen is active so it never
  // overlaps the form content or BACK/NEXT buttons.
  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      parent?.setOptions({tabBarStyle: {display: 'none'}});
      return () => {
        parent?.setOptions({tabBarStyle: undefined});
      };
    }, [navigation]),
  );

  // Step 1: Child selection
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildIds, setSelectedChildIds] = useState<string[]>([]);
  const [fetchingChildren, setFetchingChildren] = useState(false);

  useEffect(() => {
    fetchChildren();
    fetchWallet();
  }, [userId]);

  const fetchWallet = async () => {
    if (!userId) return;
    try {
      const res: any = await PaymentService.getWallet(userId);
      if (res?.success) {
        setWalletPoints(res?.data?.wallet?.points ?? 0);
      }
    } catch (err) {
      console.error('Error fetching wallet for renewal:', err);
    }
  };

  const fetchChildren = async () => {
    if (!userId) return;
    try {
      setFetchingChildren(true);
      const response: any = await UserService.getChildInformation(userId);
      const kids = response?.children || [];
      setChildren(kids);
      // Default: select all existing children
      setSelectedChildIds(normalizeSelectedChildren(kids, kids.map((c: any) => c._id).filter(Boolean)));
    } catch (err) {
      console.error('Error fetching children for renewal:', err);
    } finally {
      setFetchingChildren(false);
    }
  };

  const handleToggleChildSelection = (childId: string) => {
    setSelectedChildIds(prev => toggleChildSelectionIds(prev, childId));
  };

  const formInfo: Record<RenewStep, {title: string; description: string}> = {
    1: {
      title: 'Select Children',
      description: 'Choose which children to include in your renewed plan.',
    },
    2: {
      title: 'Renew Subscription',
      description: 'Choose a new plan to continue your lunch service.',
    },
    3: {
      title: 'Payment',
      description: 'Complete payment to activate your renewed plan.',
    },
  };

  const nextStep = () =>
    setStep(prev => (prev < 3 ? ((prev + 1) as RenewStep) : prev));

  const prevStep = () => {
    if (step === 1) {
      navigation.goBack();
    } else {
      setStep(prev => (prev > 1 ? ((prev - 1) as RenewStep) : prev));
    }
  };

  const handleChildSelectionNext = () => {
    if (selectedChildIds.length === 0) {
      Alert.alert(
        'No Children Selected',
        'Please select at least one child to renew.',
      );
      return;
    }
    nextStep();
  };

  const normalizedSelectedChildIds = normalizeSelectedChildren(
    children,
    selectedChildIds,
  );
  const selectedChildren = children.filter(c =>
    normalizedSelectedChildIds.includes(c._id),
  );

  return (
    <ThemeGradientBackground>
      <LoadingModal
        loading={loading || fetchingChildren}
        setLoading={() => {}}
      />
      <View style={styles.formsContainer}>
        <HeaderBackButton title="Back" onPress={prevStep} />
        <PaginationDots totalSteps={3} currentStep={step} />

        <View style={styles.pageHeader}>
          <Typography style={styles.stepTitle}>
            {formInfo[step].title}
          </Typography>
          <Typography style={styles.stepDescription}>
            {formInfo[step].description}
          </Typography>
        </View>

        {/* Step 1: Child Selection */}
        {step === 1 && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: hp('10%')}}>
            {children.length === 0 && !fetchingChildren && (
              <Text style={localStyles.emptyText}>No children found.</Text>
            )}

            {children.map((child: any) => {
              const isSelected = selectedChildIds.includes(child._id);
              return (
                <TouchableOpacity
                  key={child._id}
                  onPress={() => handleToggleChildSelection(child._id)}
                  style={[
                    localStyles.childCard,
                    isSelected && localStyles.childCardSelected,
                  ]}
                  activeOpacity={0.8}>
                  <View style={localStyles.childCardLeft}>
                    <View
                      style={[
                        localStyles.checkbox,
                        isSelected && localStyles.checkboxSelected,
                      ]}>
                      {isSelected && (
                        <Text style={localStyles.checkmark}>✓</Text>
                      )}
                    </View>
                    <View style={localStyles.childInfo}>
                      <Text style={localStyles.childName}>
                        {child.childFirstName} {child.childLastName}
                      </Text>
                      <Text style={localStyles.childDetail}>
                        {child.school}
                        {child.childClass ? ` • ${child.childClass}` : ''}
                        {child.section ? ` ${child.section}` : ''}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Add Child option if < 3 children */}
            {children.length < 3 && (
              <TouchableOpacity
                style={localStyles.addChildLink}
                onPress={() => navigation.navigate('AddChildScreen')}>
                <Text style={localStyles.addChildLinkText}>
                  + Add a New Child
                </Text>
              </TouchableOpacity>
            )}

            <View style={[styles.StickyButton, {marginTop: hp('3%')}]}>
              <TouchableOpacity
                style={localStyles.backBtn}
                onPress={prevStep}>
                <Text style={localStyles.backBtnText}>BACK</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={localStyles.nextBtn}
                onPress={handleChildSelectionNext}>
                <Text style={localStyles.nextBtnText}>NEXT</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* Step 2: Plan Selection */}
        {step === 2 && (
          <SubscriptionPlan
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
            childrenData={selectedChildren}
            prevStep={prevStep}
            nextStep={nextStep}
            isRenewal
            walletPoints={walletPoints}
            applyWallet={applyWallet}
            setApplyWallet={setApplyWallet}
          />
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <PaymentOptions
            prevStep={prevStep}
            navigation={navigation}
            isRenewal
            planPriceProp={planPrice}
            numChildrenProp={selectedChildren.length || 1}
            applyWalletProp={applyWallet}
            walletUsedProp={walletUsed}
            remainingWalletProp={remainingWallet}
            finalPayableProp={finalPayable}
          />
        )}
      </View>
    </ThemeGradientBackground>
  );
}

const localStyles = StyleSheet.create({
  emptyText: {
    fontSize: hp('2%'),
    fontFamily: Fonts.Urbanist.regular,
    color: Colors.bodyText,
    textAlign: 'center',
    marginTop: hp('3%'),
  },
  childCard: {
    backgroundColor: Colors.white,
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginBottom: hp('1.5%'),
    borderWidth: 1.5,
    borderColor: Colors.lightRed,
    elevation: 1,
  },
  childCardSelected: {
    borderColor: Colors.primaryOrange,
    backgroundColor: Colors.bg,
  },
  childCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: wp('6%'),
    height: wp('6%'),
    borderRadius: wp('1.5%'),
    borderWidth: 2,
    borderColor: Colors.bodyText,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('3%'),
  },
  checkboxSelected: {
    backgroundColor: Colors.primaryOrange,
    borderColor: Colors.primaryOrange,
  },
  checkmark: {
    color: Colors.white,
    fontSize: hp('1.8%'),
    fontFamily: Fonts.Urbanist.bold,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: hp('2%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
    marginBottom: 2,
  },
  childDetail: {
    fontSize: hp('1.7%'),
    fontFamily: Fonts.Urbanist.regular,
    color: Colors.bodyText,
  },
  addChildLink: {
    marginTop: hp('1%'),
    marginBottom: hp('1%'),
    alignSelf: 'center',
  },
  addChildLinkText: {
    fontSize: hp('2%'),
    fontFamily: Fonts.Urbanist.semiBold,
    color: Colors.primaryOrange,
    textDecorationLine: 'underline',
  },
  backBtn: {
    flex: 1,
    marginRight: wp('2%'),
    borderWidth: 1.5,
    borderColor: Colors.primaryOrange,
    borderRadius: wp('3%'),
    paddingVertical: hp('1.5%'),
    alignItems: 'center',
  },
  backBtnText: {
    fontSize: hp('2%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.primaryOrange,
  },
  nextBtn: {
    flex: 1,
    backgroundColor: Colors.primaryOrange,
    borderRadius: wp('3%'),
    paddingVertical: hp('1.5%'),
    alignItems: 'center',
  },
  nextBtnText: {
    fontSize: hp('2%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.white,
  },
});
