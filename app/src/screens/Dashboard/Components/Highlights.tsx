import React from 'react';
import { Text, StyleSheet, TouchableOpacity, FlatList, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import {  Calender, MultiCusine } from 'styles/svg-icons'; 

const highlightsData = [
  {
    id: '1',
    title: 'Nutritionist Approved',
    description: 'Expert designed meal plans.',
    icon: Calender,
    color: '#FFE4D7',
  },
  {
    id: '2',
    title: 'Pure Veg & Jain Food',
    description: 'Fresh and healthy ingredients.',
    icon: Calender,
    color: '#DDFFD7',
  },
  {
    id: '3',
    title: 'Flexible Plans',
    description: 'Adjust meals as per your schedule.',
    icon: Calender,
    color: '#FFE6E6',
  },
  {
    id: '4',
    title: 'Multi Cuisine Food',
    description: 'Variety of cuisines to enjoy.',
    icon: MultiCusine,
    color: '#FFF4D7',
  },
];

const Highlights: React.FC<{ navigation: any }> = ({ navigation }) => {
  const handleCardPress = (item: any) => {
    console.log('Card pressed:', item.title);
    navigation.navigate('DietaryTipsScreen', { highlight: item });
  };

  const renderCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => handleCardPress(item)}
      style={[styles.card, { backgroundColor: item.color }]}
    >
      <SvgXml xml={item.icon} width={wp('15%')} height={wp('15%')} style={styles.icon} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={highlightsData}
      numColumns={2}
      renderItem={renderCard}
      keyExtractor={item => item.id}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.container}
    />
  );
};

export default Highlights;

const styles = StyleSheet.create({
  container: {},
  row: {
    justifyContent: 'space-between',
    marginBottom: hp('2%'),
    gap: 15,
  },
  card: {
    width: wp('43%'),
    height: hp('20%'),
    padding: wp('3.5%'),
    borderRadius: wp('5%'),
    elevation: 1,
    alignItems: 'flex-start',
  },
  icon: {
    marginBottom: hp('1.2%'),
  },
  title: {
    fontSize: wp('4.8%'),
    marginBottom: hp('0.3%'),
    color: Colors.black,
    width: 'auto',
    fontFamily: Fonts.Urbanist.bold,
  },
  description: {
    fontSize: wp('3.2%'),
    color: Colors.bodyText,
    fontFamily: 'OpenSans-Regular',
  },
});
