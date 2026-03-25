import React from 'react';
import {View, ScrollView, StyleSheet, Text} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import HeaderBackButton from 'screens/Dashboard/Components/BackButton';
import Typography from 'components/Text/Typography';
import WhatsAppButton from 'components/buttons/WhatsAppButton';

const TermsAndPolicyScreen = ({navigation}: any) => {
  return (
    <ThemeGradientBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: hp('8%')}}>
        <View style={styles.container}>
          <HeaderBackButton title="TERMS & PRIVACY POLICY" />

          {/* Terms & Conditions */}
          <Typography style={styles.mainTitle}>Terms & Conditions</Typography>

          <Typography style={styles.sectionTitle}>Introduction</Typography>
          <Text style={styles.sectionText}>
            By accessing or using this application, you agree to be bound by
            these Terms & Conditions.
          </Text>

          <Text style={styles.sectionTitle}>Use of Service</Text>
          <Text style={styles.sectionText}>
            You agree to use this service only for lawful purposes and in
            accordance with applicable laws.
          </Text>

          <Text style={styles.sectionTitle}>User Responsibilities</Text>
          <Text style={styles.sectionText}>
            You are responsible for maintaining the confidentiality of your
            account credentials and activity.
          </Text>

          <Text style={styles.sectionTitle}>Limitation of Liability</Text>
          <Text style={styles.sectionText}>
            We are not liable for any damages arising from the use or inability
            to use this service.
          </Text>

          {/* Privacy Policy */}
          <Text style={styles.mainTitle}>Privacy Policy</Text>

          <Text style={styles.sectionTitle}>Introduction</Text>
          <Text style={styles.sectionText}>
            We respect your privacy and are committed to safeguarding your
            personal information.
          </Text>

          <Text style={styles.sectionTitle}>Information We Collect</Text>
          <Text style={styles.sectionText}>
            We may collect information such as your name, email, and usage data
            to improve our services.
          </Text>

          <Text style={styles.sectionTitle}>How We Use Information</Text>
          <Text style={styles.sectionText}>
            Your information helps us enhance user experience, improve
            functionality, and provide support.
          </Text>

          <Text style={styles.sectionTitle}>Data Security</Text>
          <Text style={styles.sectionText}>
            We use appropriate security measures to protect your data from
            unauthorized access or misuse.
          </Text>

          <Text style={styles.sectionTitle}>Policy Updates</Text>
          <Text style={styles.sectionText}>
            We may update this Privacy Policy periodically. Continued use of the
            app indicates acceptance.
          </Text>
        </View>
      </ScrollView>
      <WhatsAppButton />
    </ThemeGradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {paddingHorizontal: wp('5%'), paddingTop: hp('2%')},
  mainTitle: {
    fontSize: hp('2.3%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.primaryOrange,
    marginTop: hp('3%'),
    marginBottom: hp('1.5%'),
  },
  sectionTitle: {
    fontSize: hp('2%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
    marginTop: hp('2%'),
    marginBottom: hp('0.8%'),
  },
  sectionText: {
    fontSize: hp('1.7%'),
    fontFamily: Fonts.Urbanist.medium,
    color: Colors.bodyText,
    lineHeight: hp('2.5%'),
  },
});

export default TermsAndPolicyScreen;
