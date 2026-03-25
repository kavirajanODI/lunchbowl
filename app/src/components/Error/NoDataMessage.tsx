import { Colors } from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const NoDataFound: React.FC<{ message?: string }> = ({ message = 'No data found' }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📭</Text>
      <Text style={styles.title}>Oops!</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

export default NoDataFound;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('8%'),
    paddingVertical: hp('3%'),
    backgroundColor:Colors.Storke,
    borderRadius:wp('8%'),
  },
  emoji: {
    fontSize: hp('3%'),
    marginBottom: hp('1.5%'),
  },
  title: {
    fontSize: hp('2.5%'),
    fontWeight: '700',
    color: Colors.primaryOrange,
    marginBottom: hp('0.8%'),
    textAlign: 'center',
        fontFamily:Fonts.Urbanist.bold

  },
  message: {
    fontSize: hp('2%'),
    color: Colors.bodyText,
    textAlign: 'center',
    lineHeight: hp('2.8%'),
    fontFamily:Fonts.Urbanist.blackItalic
  },
});
