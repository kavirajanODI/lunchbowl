import Fonts from 'assets/styles/fonts';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface LegendItem {
  color: string | string[]; 
  label: string;
}

const CalendarLegend: React.FC<{items: LegendItem[]}> = ({items}) => {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={index} style={styles.item}>
          <View
            style={[
              styles.colorBox,
              Array.isArray(item.color)
                ? {backgroundColor: item.color[0]} 
                : {backgroundColor: item.color},
            ]}
          />
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
};

export default CalendarLegend;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: hp('2%'),
    justifyContent: 'space-between',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('0.5%'),
    width: '48%',
  },
  colorBox: {
    width: wp('5%'),
    height: wp('5%'),
    borderRadius: wp('10%'),
    marginRight: wp('2%'),
  },
  label: {
    fontSize: wp('3.5%'),
    fontFamily:Fonts.Urbanist.blackItalic
  },
});
