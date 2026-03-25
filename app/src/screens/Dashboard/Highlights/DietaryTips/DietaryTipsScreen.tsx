import React from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Colors } from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import HeaderBackButton from 'screens/Dashboard/Components/BackButton';
import Typography from 'components/Text/Typography';
import WhatsAppButton from 'components/buttons/WhatsAppButton';

const DietaryTipDetailsScreen = ({ route, navigation }: any) => {
  const { tip } = route.params;

  return (
    <ThemeGradientBackground>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp('8%') }}>
        <View style={styles.container}>
          <HeaderBackButton title={tip.title} />
          <Image source={tip.image} style={styles.tipImage} />
          <Typography style={styles.tipTitle}>{tip.title}</Typography>
          <Typography style={styles.tipDescription}>{tip.description}</Typography>

        </View>
      </ScrollView>
      <WhatsAppButton />
    </ThemeGradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: wp('5%'), paddingTop: hp('2%') },
  tipImage: {
    width: '100%',
    height: hp('30%'),
    borderRadius: 12,
    marginBottom: hp('2%'),
  },
  tipTitle: {
    fontSize: hp('2.2%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
    marginBottom: hp('1%'),
  },
  tipDescription: {
    fontSize: hp('1.8%'),
    fontFamily: Fonts.Urbanist.medium,
    color: Colors.bodyText,
    lineHeight: hp('2.5%'),
  },
});

export default DietaryTipDetailsScreen;
