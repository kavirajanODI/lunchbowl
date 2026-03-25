import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export const CategorySkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={12}>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: wp('4%'),
          marginBottom: hp('2%'),
        }}>
        {Array.from({length: 4}).map((_, i) => (
          <View key={i} style={{marginRight: wp('4%')}}>
            <View
              style={{width: wp('20%'), height: hp('12%'), borderRadius: 12}}
            />
            <View
              style={{
                marginTop: 6,
                width: wp('20%'),
                height: 12,
                borderRadius: 4,
              }}
            />
          </View>
        ))}
      </View>
    </SkeletonPlaceholder>
  );
};

export const MealListSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={12}>
      <View>
        {Array.from({length: 5}).map((_, i) => (
          <View
            key={i}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: hp('2%'),
              marginHorizontal: wp('4%'),
            }}>
            <View
              style={{width: wp('25%'), height: hp('12%'), borderRadius: 12}}
            />
            <View style={{marginLeft: wp('4%'), flex: 1}}>
              <View style={{width: '70%', height: 14, marginBottom: 6}} />
              <View style={{width: '90%', height: 12, marginBottom: 6}} />
              <View style={{width: '50%', height: 12}} />
            </View>
          </View>
        ))}
      </View>
    </SkeletonPlaceholder>
  );
};
