import React from 'react';
import { View, ScrollView, StyleSheet, Image, Text } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Colors } from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import HeaderBackButton from 'screens/Dashboard/Components/BackButton';
import Typography from 'components/Text/Typography';

const AboutUsScreen = ({ navigation }: any) => {
  return (
    <ThemeGradientBackground>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp('8%') }}>
        <View style={styles.container}>
          <HeaderBackButton title="ABOUT US" />

          {/* Company Intro Section */}
          <Typography style={styles.sectionTitle}>Our Story</Typography>
          <Text style={styles.sectionDescription}>
            Welcome to ! We are dedicated to providing the best services to our customers, combining innovation and expertise to deliver excellence in every project.
          </Text>

          <Image 
            source={require('../../../assets/images/Banners/banner2.png')}
            style={styles.sectionImage}
            resizeMode="cover"
          />

          {/* Mission Section */}
          <Typography style={styles.sectionTitle}>Our Mission</Typography>
          <Text style={styles.sectionDescription}>
            Our mission is to empower individuals and businesses by providing innovative solutions that simplify processes and create meaningful impact.
          </Text>

          {/* Team / Founder Section */}
          <Typography style={styles.sectionTitle}>Meet the Founder</Typography>
          <View style={styles.teamCard}>
            <Image 
              source={require('../../../assets/images/Logo/Logo.png')} // replace with your image
              style={styles.teamImage}
            />
            <View style={styles.teamContent}>
              <Typography style={styles.teamName}>Bharathidhasan T</Typography>
              <Typography style={styles.teamRole}>Founder & CEO</Typography>
              <Text style={styles.teamDescription}>
                Bharathidhasan T is a passionate software developer and visionary leader dedicated to building innovative solutions.
              </Text>
            </View>
          </View>

          {/* Optional: Add more sections like Values, Achievements, or Timeline */}
        </View>
      </ScrollView>
    </ThemeGradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp('5%'),
    paddingTop: hp('2%'),
  },
  sectionTitle: {
    fontSize: hp('2.2%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
    marginBottom: hp('1%'),
    marginTop: hp('2%'),
  },
  sectionDescription: {
    fontSize: hp('1.7%'),
    fontFamily: Fonts.Urbanist.medium,
    color: Colors.bodyText,
    lineHeight: hp('2.5%'),
    marginBottom: hp('2%'),
  },
  sectionImage: {
    width: '100%',
    height: hp('25%'),
    borderRadius: 12,
    marginBottom: hp('2%'),
  },
  teamCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: wp('3%'),
    marginBottom: hp('2%'),
    overflow: 'hidden',
  },
  teamImage: {
    width: wp('25%'),
    height: wp('25%'),
    borderRadius: 12,
  },
  teamContent: {
    flex: 1,
    marginLeft: wp('3%'),
    justifyContent: 'center',
  },
  teamName: {
    fontSize: hp('1.9%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
    marginBottom: hp('0.5%'),
  },
  teamRole: {
    fontSize: hp('1.6%'),
    fontFamily: Fonts.Urbanist.medium,
    color: Colors.bodyText,
    marginBottom: hp('0.5%'),
  },
  teamDescription: {
    fontSize: hp('1.6%'),
    fontFamily: Fonts.Urbanist.medium,
    color: Colors.bodyText,
  },
});

export default AboutUsScreen;
