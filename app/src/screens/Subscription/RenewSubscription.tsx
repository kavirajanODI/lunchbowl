import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import {LoadingModal} from 'components/LoadingModal/LoadingModal';
import PaginationDots from 'components/paginations.tsx/PrimaryPagination';
import Typography from 'components/Text/Typography';
import {useAuth} from 'context/AuthContext';
import {useRegistration} from 'context/RegistrationContext';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import HeaderBackButton from 'screens/Dashboard/Components/BackButton';
import PaymentOptions from './Components/forms/PaymentOptions';
import styles from './Components/forms/Styles/styles';
import SubscriptionPlan from './Components/forms/Subscription';

type RenewStep = 1 | 2;

export default function RenewSubscription({navigation}: any) {
  const {userId} = useAuth();
  const {refreshRegistration} = useRegistration();
  const [step, setStep] = useState<RenewStep>(1);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [loading, setLoading] = useState(false);

  const formInfo: Record<RenewStep, {title: string; description: string}> = {
    1: {
      title: 'Renew Subscription',
      description: 'Choose a new plan to continue your lunch service.',
    },
    2: {
      title: 'Payment',
      description: 'Complete payment to activate your renewed plan.',
    },
  };

  const nextStep = () => setStep(prev => (prev < 2 ? ((prev + 1) as RenewStep) : prev));
  const prevStep = () => {
    if (step === 1) {
      navigation.goBack();
    } else {
      setStep(prev => (prev > 1 ? ((prev - 1) as RenewStep) : prev));
    }
  };

  return (
    <ThemeGradientBackground>
      <LoadingModal loading={loading} setLoading={setLoading} />
      <View style={styles.formsContainer}>
        <HeaderBackButton title="Back" onPress={prevStep} />
        <PaginationDots totalSteps={2} currentStep={step} />

        <View style={styles.pageHeader}>
          <Typography style={styles.stepTitle}>
            {formInfo[step].title}
          </Typography>
          <Typography style={styles.stepDescription}>
            {formInfo[step].description}
          </Typography>
        </View>

        {step === 1 && (
          <SubscriptionPlan
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
            prevStep={prevStep}
            nextStep={nextStep}
            isRenewal
            childCount={1}
          />
        )}

        {step === 2 && (
          <PaymentOptions prevStep={prevStep} navigation={navigation} />
        )}
      </View>
    </ThemeGradientBackground>
  );
}
