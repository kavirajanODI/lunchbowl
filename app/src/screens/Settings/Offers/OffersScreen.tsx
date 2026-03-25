import { Colors } from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import Typography from 'components/Text/Typography';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { SvgXml } from 'react-native-svg';
import HeaderBackButton from 'screens/Dashboard/Components/BackButton';
import PromoBanner from '../../Dashboard/Components/Carousel';
import WhatsAppButton from 'components/buttons/WhatsAppButton';

const mockOffers = [
  {
    id: 1,
    image: require('../../../assets/images/Banners/banner6.png'),
    title: 'Healthy Lunch Combo',
    description: 'Nutritious meals with fresh vegetables, fruits, and whole grains, perfect for your child’s school lunch.',
  },
  {
    id: 2,
    image: require('../../../assets/images/Banners/banner7.png'),
    title: 'Weekly Meal Plan',
    description: 'Subscribe to our weekly plan and get balanced lunch boxes delivered every school day.',
    tag: 'Special Offer',
  },
  {
    id: 3,
    image: require('../../../assets/images/Banners/banner8.png'),
    title: 'Protein Packed Lunch',
    description: 'High-protein meals with eggs, legumes, and dairy to keep your child energized throughout the day.',
    tag: 'Flash Sale',
  },
  {
    id: 4,
    image: require('../../../assets/images/Banners/banner9.png'),
    title: 'Vegan Delight Box',
    description: 'Plant-based lunch boxes made with wholesome ingredients and tasty flavors for vegan kids.',
    tag: 'Flash Sale',
  },
];


const OffersScreen = ({navigation}: any) => {
  const [activeTab, setActiveTab] = useState<'offers' | 'coupons'>('offers');

  return (
    <ThemeGradientBackground>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <HeaderBackButton title="Offers & Coupons" />

          <View style={styles.banner}>
            <PromoBanner />
          </View>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'offers' && styles.activeTab]}
              onPress={() => setActiveTab('offers')}>
              <Typography
                style={[
                  styles.tabText,
                  activeTab === 'offers' && styles.activeTabText,
                ]}>
                Offers
              </Typography>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'coupons' && styles.activeTab]}
              onPress={() => setActiveTab('coupons')}>
              <Typography
                style={[
                  styles.tabText,
                  activeTab === 'coupons' && styles.activeTabText,
                ]}>
                Coupons
              </Typography>
            </TouchableOpacity>
          </View>

          {/* Offer List */}

          {activeTab === 'offers' &&
            mockOffers.map(offer => (
              <TouchableOpacity
                key={offer.id}
                style={styles.offerCard}
                onPress={() =>
                  navigation.navigate('OfferDetailScreen', {offer})
                }>
                {typeof offer.image === 'string' ? (
                  <SvgXml xml={offer.image} width={60} height={60} />
                ) : (
                  <Image source={offer.image} style={styles.offerImage} />
                )}

                <View style={styles.offerContent}>
                  <Typography
                    style={styles.offerTitle}
                    numberOfLines={1}
                    maxWords={4}>
                    {offer.title}
                  </Typography>
                  <Typography
                    style={styles.offerDescription}
                    numberOfLines={1}
                    maxWords={8}>
                    {offer.description}
                  </Typography>
                  {/* 🔹 Single consistent tag color */}
                  {offer.tag ? (
                    <View style={styles.offerTag}>
                      <Typography style={styles.offerTagText}>
                        {offer.tag}
                      </Typography>
                    </View>
                  ) : null}
                </View>
              </TouchableOpacity>
            ))}

          {activeTab === 'coupons' && (
            <View style={styles.emptyState}>
              <Typography style={styles.emptyText}>
                No Coupons Available
              </Typography>
            </View>
          )}
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
  banner: {
    borderRadius: wp('3%'),
    overflow: 'hidden',
    marginBottom: hp('2%'),
    position: 'relative',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: wp('3%'),
    marginBottom: hp('2%'),
  },
  tab: {
    flex: 1,
    paddingVertical: hp('1.2%'),
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: Colors.primaryOrange,
    borderRadius: wp('3%'),
  },
  tabText: {
    fontSize: hp('2%'),
    color: Colors.default,
    fontFamily: Fonts.Urbanist.semiBold,
  },
  activeTabText: {
    color: Colors.white,
    fontFamily: Fonts.Urbanist.bold,
  },
  offerCard: {
    backgroundColor: Colors.white,
    borderRadius: wp('3%'),
    marginBottom: hp('1.5%'),
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('3.5%'),
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: wp('2%'),
    elevation: 2,
  },
  offerImage: {
    width: wp('30%'),
    height: hp('8%'),
    borderRadius: wp('2%'),
  },
  offerTag: {
    paddingVertical: hp('0.6%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('3%'),
    marginTop: hp('0.8%'),
    alignSelf: 'flex-start',
    backgroundColor: Colors.lightRed,
  },
  offerTagText: {
    color: Colors.red,
    fontSize: hp('1.6%'),
    fontFamily: Fonts.Urbanist.bold,
  },
  offerContent: {
    marginLeft: wp('3%'),
    flex: 1,
  },
  offerTitle: {
    fontSize: hp('2.2%'),
    color: Colors.black,
    fontFamily: Fonts.Urbanist.bold,
  },
  offerDescription: {
    fontSize: hp('1.8%'),
    color: Colors.default,
    marginTop: hp('0.5%'),
    fontFamily: Fonts.Urbanist.medium,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: hp('5%'),
  },
  emptyText: {
    fontSize: hp('2%'),
    color: Colors.default,
    fontFamily: Fonts.Urbanist.medium,
  },
});

export default OffersScreen;
