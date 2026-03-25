import React from 'react';
import {Text, StyleSheet, TouchableOpacity, FlatList, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {Calender, Helthy, irrattaiilai, MultiCusine} from 'styles/svg-icons';
import { Colors } from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';

const QuickActionsMock = [
  {
    id: '1',
    title: 'Healthy',
    description: 'Relax and stretch your muscles.',
    icon: Helthy,
    color: '#FFE4D7',
  },
  {
    id: '2',
    title: 'Diet Plan',
    description: 'Eat healthy, stay healthy.',
    icon: irrattaiilai,
    color: '#DDFFD7',
  },
  {
    id: '3',
    title: 'Flexible Plans',
    description: 'Drink 8+ glasses daily.',
    icon: Calender,
    color: '#FFE6E6',
  },
  {
    id: '4',
    title: 'Multi Cuisine Food',
    description: 'Track your sleep schedule.',
    icon: MultiCusine,
    color: '#FFF4D7',
  },
];

const QuickActions: React.FC<{navigation: any}> = ({navigation}) => {
  const handleCardPress = () => {
    navigation.navigate('DietaryTipsScreen');
  };

  const renderCard = ({item}: {item: any}) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handleCardPress}
      style={[styles.card, {backgroundColor: item.color}]}>
      <SvgXml
        xml={item.icon}
        width={wp('15%')}
        height={wp('15%')}
        style={styles.icon}
      />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={QuickActionsMock}
      numColumns={2}
      renderItem={renderCard}
      keyExtractor={item => item.id}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.container}
    />
  );
};

export default QuickActions;

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
    fontFamily: Fonts.Urbanist.bold
  },
  description: {
    fontSize: wp('3.2%'),
    color: Colors.bodyText,
    fontFamily: 'OpenSans-Regular',
  },
});
