
import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

type Props = {
  children: string;
  style?: TextStyle;
};

const SectionTitle: React.FC<Props> = ({ children, style }) => {
  return <Text style={[styles.text, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  text: {
    marginTop: hp('2.5%'),
    marginLeft: wp('2.5%'),
    marginVertical: hp('2%'),
    fontSize: wp('5%'),
    fontFamily: 'Urbanist-SemiBold',
    color: '#000000',
    textAlign: 'left',
    flexWrap: 'wrap',
    maxWidth: '100%',
  },
}); 

export default SectionTitle;
