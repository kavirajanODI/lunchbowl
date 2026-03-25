import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
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

const dietaryTips = [
  {
    id: 1,
    title: 'Balanced Breakfast',
    description:
      'Include fruits, whole grains, and protein in your child’s breakfast.',
    image: require('../../../../assets/images/Banners/banner5.png'),
  },
  {
    id: 2,
    title: 'Hydration Tips',
    description: 'Ensure your child drinks at least 1-2 liters of water daily.',
    image: require('../../../../assets/images/Banners/banner5.png'),
  },
  {
    id: 3,
    title: 'Fruit & Veggies',
    description: 'Add a variety of colorful fruits and vegetables to meals.',
    image: require('../../../../assets/images/Banners/banner5.png'),
  },
  {
    id: 4,
    title: 'Limit Junk Food',
    description: 'Avoid processed snacks and sugary drinks.',
    image: require('../../../../assets/images/Banners/banner5.png'),
  },
];

const DietaryTipsScreen = ({navigation}: any) => {
  const [search, setSearch] = useState('');

  return (
    <ThemeGradientBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: hp('8%')}}>
        <View style={styles.container}>
          <HeaderBackButton title="DIETARY TIPS" />

          {/* Search Bar */}
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={search}
            onChangeText={setSearch}
          />

          {/* Tips List */}
          {dietaryTips
            .filter(tip =>
              tip.title.toLowerCase().includes(search.toLowerCase()),
            )
            .map(tip => (
              <TouchableOpacity
                key={tip.id}
                style={styles.tipCard}
                onPress={() =>
                  navigation.navigate('DietaryTipDetailsScreen', {tip})
                }>
                <Image source={tip.image} style={styles.tipImage} />
                <View style={styles.tipContent}>
                  <Typography style={styles.tipTitle}>{tip.title}</Typography>
                  <Typography style={styles.tipDescription}>
                    {tip.description}
                  </Typography>
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
      <WhatsAppButton />
    </ThemeGradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {paddingHorizontal: wp('5%'), paddingTop: hp('2%')},
  searchInput: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
    marginBottom: hp('2%'),
    fontFamily: Fonts.Urbanist.medium,
    fontSize: hp('1.8%'),
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: hp('1.5%'),
    overflow: 'hidden',
    padding: wp('2%'),
  },
  tipImage: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: 10,
  },
  tipContent: {
    flex: 1,
    marginLeft: wp('3%'),
    justifyContent: 'center',
  },
  tipTitle: {
    fontSize: hp('1.9%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
    marginBottom: hp('0.5%'),
  },
  tipDescription: {
    fontSize: hp('1.6%'),
    fontFamily: Fonts.Urbanist.medium,
    color: Colors.bodyText,
  },
});

export default DietaryTipsScreen;
