import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {Holiday} from 'src/model/calendarModels';

interface HolidayListCardProps {
  holidays: Holiday[];
}

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {month: 'short', day: 'numeric'};
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const HolidayListCard: React.FC<HolidayListCardProps> = ({holidays}) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {holidays.map((holiday, index) => (
          <View style={styles.holidayRow} key={index}>
            <Text style={styles.bullet}>◆</Text>
            <Text style={styles.holidayText}>
              <Text style={styles.date}>{formatDate(holiday.date)}</Text> -{' '}
              {holiday.name}
            </Text>
          </View>
        ))}

        <Text style={styles.note}>
          <Text style={styles.dot}>🔴⚪</Text> Denotes{' '}
          <Text style={styles.bold}>Weekends & Holidays.</Text>
        </Text>
      </View>
    </View>
  );
};

export default HolidayListCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    marginTop: hp('2%'),
    borderRadius: wp('5%'),
  },
  card: {
    borderWidth: 1,
    borderColor: Colors.primaryOrange,
    borderRadius: wp('5%'),
    paddingVertical: hp('2.5%'),
    paddingHorizontal: wp('4%'),
    backgroundColor: Colors.white,
    borderStyle: 'dashed',
  },
  holidayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('0.8%'),
  },
  bullet: {
    fontSize: wp('5%'),
    color: Colors.primaryOrange,
    marginRight: wp('2%'),
  },
  holidayText: {
    fontSize: wp('4%'),
    color: Colors.bodyText,
    fontFamily: Fonts.OpenSans.regular,
    textTransform: 'capitalize',
    flexShrink: 1,
  },
  date: {
    fontWeight: '600',
  },
  note: {
    marginTop: hp('1.5%'),
    fontSize: wp('3.5%'),
    color: Colors.bodyText,
  },
  dot: {
    fontSize: wp('4%'),
  },
  bold: {
    fontWeight: '600',
    color: Colors.black,
  },
});
