import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import PrimaryButton from 'components/buttons/PrimaryButton';
import {useUserProfile} from 'context/UserDataContext';
import {useMenu} from 'context/MenuContext';
import {useAuth} from 'context/AuthContext';
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
  const {fetchChildren} = useMenu();
  const {userId} = useAuth();

  useEffect(() => {
    // Refresh profile so that PlanCalendar loads fresh subscription data
    refreshProfileData().catch(() => {});
    // Pre-warm MenuContext so the calendar renders immediately on My Plan
    if (userId) {
      fetchChildren({_id: userId});
    }
  }, [refreshProfileData, userId]);

  const handleGoToMyPlan = () => {
    navigation.replace('PlanCalendar');
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
