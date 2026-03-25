import {Colors} from 'assets/styles/colors';
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface Props {
  totalSteps: number;
  currentStep: number;
}

const PaginationDots: React.FC<Props> = ({totalSteps, currentStep}) => {
  return (
    <View style={styles.pagination}>
      {Array.from({length: totalSteps}).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            currentStep === index + 1 ? styles.activeDot : {},
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: wp('21.2%'),
    height: wp('1%'),
    borderRadius: wp('1.5%'),
    backgroundColor: Colors.default,
    marginHorizontal: wp('0.9%'),
  },
  activeDot: {
    backgroundColor: Colors.primaryOrange,
  },
});

export default PaginationDots;
