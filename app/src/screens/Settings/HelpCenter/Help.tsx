import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Colors } from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import HeaderBackButton from 'screens/Dashboard/Components/BackButton';
import Typography from 'components/Text/Typography';
import { SvgXml } from 'react-native-svg';
import { RightIcon } from 'styles/svg-icons';
import WhatsAppButton from 'components/buttons/WhatsAppButton';
import SearchBar from 'screens/Dashboard/Components/Search';

const helpItems = [
  { id: 1, title: 'Account' },
  { id: 2, title: 'Payment' },
  { id: 3, title: 'Subscriptions' },
  { id: 4, title: 'Delivery' },
  { id: 5, title: 'Technical Support' },
  { id: 6, title: 'Feedback & Support' },
  { id: 7, title: 'Cancellation & Charges' },
  { id: 8, title: 'FAQ' },
];

const HelpCenterScreen = ({ navigation }: any) => {
  const [search, setSearch] = useState('');

  return (
    <ThemeGradientBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: hp('8%')}}>
        <View style={styles.container}>
          <HeaderBackButton title="HELP CENTER" />

          {/* Search Bar */}
          <SearchBar value={search} onChangeText={setSearch} />

          {/* Help Items */}
          <Typography style={styles.sectionTitle}>Help With</Typography>
          <View style={styles.cardContainer}>
            {helpItems
              .filter(item =>
                item.title.toLowerCase().includes(search.toLowerCase()),
              )
              .map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.itemCard}
                  onPress={() => console.log('Clicked:', item.title)}>
                  <Typography style={styles.itemText}>{item.title}</Typography>
                  <SvgXml xml={RightIcon} width={14} height={14} />
                </TouchableOpacity>
              ))}
          </View>
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
  sectionTitle: {
    fontSize: hp('2.2%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
    marginBottom: hp('1%'),
  },
  cardContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3%'),
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('3%'),
    borderBottomWidth: 1,
    borderBottomColor: Colors.Storke,
  },
  itemText: {
    fontSize: hp('1.9%'),
    fontFamily: Fonts.Urbanist.medium,
    color: Colors.bodyText,
  },
});

export default HelpCenterScreen;
