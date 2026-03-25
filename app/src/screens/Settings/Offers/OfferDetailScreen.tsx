import { Colors } from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { SvgXml } from 'react-native-svg';

import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import Typography from 'components/Text/Typography';
import HeaderBackButton from 'screens/Dashboard/Components/BackButton';
import WhatsAppButton from 'components/buttons/WhatsAppButton';

const OfferDetailScreen = ({ route, navigation }: any) => {
  // In real API, you'll get this from route.params or backend
  const offer = route?.params?.offer || {
    id: 1,
    image: require('../../../assets/images/Banners/banner6.png'),
    title: 'Mega SALE',
    description:
      'Lorem ipsum dolor sit amet consectetur. Elit dolor ornare sed tempus phasellus neque nunc amet. Eu fermentum ut lectus cursus vestibulum elementum sed.',
    tag: 'OFFER ENDS WITHIN 1 DAY',
  };

  return (
    <ThemeGradientBackground>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <HeaderBackButton title="OFFERS & COUPONS" />

          {/* Offer Image */}
          {typeof offer.image === 'string' ? (
            <SvgXml xml={offer.image} width="100%" height={hp('20%')} />
          ) : (
            <Image source={offer.image} style={styles.bannerImage} />
          )}

          {/* Offer Details */}
          <Typography style={styles.sectionTitle}>Offer Details</Typography>

          <View style={styles.detailsBox}>
            <Text style={styles.detailsText}>{offer.description}</Text>
          </View>

          {/* Tag */}
          {offer.tag ? (
            <View style={styles.offerTag}>
              <Typography style={styles.offerTagText}>{offer.tag}</Typography>
            </View>
          ) : null}

         
        </View>
      </ScrollView>
      <WhatsAppButton />
    </ThemeGradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('8%'),
  },
  bannerImage: {
    width: '100%',
    height: hp('20%'),
    borderRadius: wp('3%'),
    resizeMode: 'cover',
    marginBottom: hp('2%'),
  },
  sectionTitle: {
    fontSize: hp('2.2%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
    marginBottom: hp('1%'),
  },
  detailsBox: {
    backgroundColor: Colors.white,
    borderRadius: wp('3%'),
    padding: wp('4%'),
    shadowColor: Colors.black,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    marginBottom: hp('2%'),
  },
  detailsText: {
    fontSize: hp('1.8%'),
    color: Colors.default,
    fontFamily: Fonts.Urbanist.medium,
    lineHeight: hp('2.6%'),
  },
  offerTag: {
    backgroundColor: Colors.lightRed,
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('2%'),
    alignSelf: 'flex-start',
  },
  offerTagText: {
    fontSize: hp('1.7%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.red,
  },
  whatsappButton: {
    position: 'absolute',
    bottom: hp('4%'),
    right: wp('6%'),
  },
});

export default OfferDetailScreen;
