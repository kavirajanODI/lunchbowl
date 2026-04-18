import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import PrimaryButton from 'components/buttons/PrimaryButton';
import SecondaryButton from 'components/buttons/SecondaryButton';
import {useUserProfile} from 'context/UserDataContext';
import {useRegistration} from 'context/RegistrationContext';
import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SvgXml} from 'react-native-svg';
import {logo} from 'styles/svg-icons';

const checkIcon = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="12" cy="12" r="12" fill="#4AB238"/>
<path d="M6 12L10 16L18 8" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const PaymentSuccessScreen = ({navigation}: {navigation: any}) => {
  const {refreshProfileData} = useUserProfile();
  const {refreshRegistration} = useRegistration();

  useEffect(() => {
    const hydrate = async () => {
      await refreshRegistration().catch(() => {});
      await refreshProfileData().catch(() => {});
    };
    hydrate();
  }, [refreshProfileData, refreshRegistration]);

  const navigateParentTab = (tab: 'MyPlan' | 'Home') => {
    const parent = navigation.getParent?.();
    if (parent?.navigate) {
      parent.navigate(
        tab as never,
        (tab === 'MyPlan'
          ? {screen: 'PlanCalendar'}
          : {screen: 'HomeScreen'}) as never,
      );
      return true;
    }
    return false;
  };

  const handleGoToMyPlan = async () => {
    await refreshRegistration().catch(() => {});
    await refreshProfileData().catch(() => {});

    if (!navigateParentTab('MyPlan')) {
      navigation.replace('PlanCalendar' as never);
    }
  };

  const handleGoToDashboard = () => {
    if (!navigateParentTab('Home')) {
      navigation.replace('HomeScreen' as never);
    }
  };

  return (
    <ThemeGradientBackground>
      <View style={styles.container}>
        <SvgXml xml={logo} style={styles.logo} />

        <View style={styles.iconWrapper}>
          <SvgXml xml={checkIcon} width={wp('22%')} height={wp('22%')} />
        </View>

        <Text style={styles.title}>Payment Successful! 🎉</Text>
        <Text style={styles.subtitle}>
          Your subscription has been activated. Enjoy your healthy meals!
        </Text>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Go to My Plan"
            onPress={handleGoToMyPlan}
            style={styles.button}
          />
          <SecondaryButton
            title="Go to Dashboard"
            onPress={handleGoToDashboard}
            style={[styles.button, {marginTop: hp('2%')}]}
          />
        </View>
      </View>
    </ThemeGradientBackground>
  );
};

export default PaymentSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('8%'),
  },
  logo: {
    width: wp('20%'),
    height: wp('20%'),
    marginBottom: hp('4%'),
  },
  iconWrapper: {
    marginBottom: hp('3%'),
  },
  title: {
    fontSize: wp('7%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.primaryOrange,
    textAlign: 'center',
    marginBottom: hp('1.5%'),
  },
  subtitle: {
    fontSize: wp('4%'),
    fontFamily: Fonts.OpenSans.regular,
    color: Colors.bodyText,
    textAlign: 'center',
    lineHeight: hp('3%'),
    marginBottom: hp('5%'),
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    width: '100%',
  },
});
