import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import PrimaryButton from 'components/buttons/PrimaryButton';
import SecondaryButton from 'components/buttons/SecondaryButton';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SvgXml} from 'react-native-svg';
import {logo} from 'styles/svg-icons';

const failIcon = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="12" cy="12" r="12" fill="#EA1A27"/>
<path d="M8 8L16 16M16 8L8 16" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
</svg>`;

const PaymentFailedScreen = ({navigation}: {navigation: any}) => {
  const handleGoToMyPlan = () => {
    navigation.navigate('MyPlan' as never);
  };

  const handleGoToDashboard = () => {
    navigation.navigate('Home' as never);
  };

  return (
    <ThemeGradientBackground>
      <View style={styles.container}>
        <SvgXml xml={logo} style={styles.logo} />

        <View style={styles.iconWrapper}>
          <SvgXml xml={failIcon} width={wp('22%')} height={wp('22%')} />
        </View>

        <Text style={styles.title}>Payment Failed</Text>
        <Text style={styles.subtitle}>
          Unfortunately, your payment could not be processed. Please try again.
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

export default PaymentFailedScreen;

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
    color: Colors.bodyText,
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
