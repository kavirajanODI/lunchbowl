import PrimaryButton from 'components/buttons/PrimaryButton';
import React from 'react';
import {View, Text, StyleSheet, Image, ImageSourcePropType} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import Typography from 'components/Text/Typography';

type MealCardProps = {
  image: ImageSourcePropType;
  title: string;
  description: string;
  onPress: () => void;
};



const MealCard: React.FC<MealCardProps> = ({
  image,
  title,
  description,
  onPress,
}) => (
  <View style={styles.card}>
    <Image source={image} style={styles.image} />
    <View style={styles.info}>
      <Typography style={styles.title}>{title}</Typography>
      <Typography style={styles.desc} numberOfLines={3}>
        {description}
      </Typography>
      <PrimaryButton
        title="View Meal info"
        onPress={onPress}
        style={styles.button}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginVertical: hp('1%'),
    backgroundColor: Colors.white,
    borderRadius: wp('3%'),
    padding: wp('3%'),
    shadowColor: Colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 1,
  },
  image: {
    width: wp('30%'),
    height: wp('30%'),
    borderRadius: wp('2.5%'),
    resizeMode: 'cover',
  },
  info: {
    flex: 1,
    marginLeft: wp('3%'),
    justifyContent: 'space-between',
  },
  title: {
    fontSize: wp('4.5%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
  },
  desc: {
    color: Colors.bodyText,
    fontSize: wp('3.5%'),
    marginVertical: hp('0.5%'),
    fontFamily: Fonts.Urbanist.regular,
  },
button: {
  width: '100%',
  height: hp('4%'),
  marginTop: hp('1%'),
  justifyContent: 'center',
  alignItems: 'center',
},
});

export default MealCard;
