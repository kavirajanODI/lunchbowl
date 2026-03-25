import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

type OrderData = {
  image: ImageSourcePropType;
  title: string;
  dateTime: string;
  food: string;
  status: string;
};

type OrderCardProps = {
  data: OrderData;
  onPress?: () => void;
};

const OrderCard: React.FC<OrderCardProps> = ({data, onPress}) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
      <Image source={data.image} style={styles.image} resizeMode="cover" />
      <View style={styles.content}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.subtitle}>{data.dateTime}</Text>
        <Text style={styles.food}>{data.food}</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{data.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: wp(3),
    marginBottom: hp(2),
    padding: wp(3),
    elevation: 2,
  },
  image: {
    width: wp(30),
    height: wp(30),
    borderRadius: wp(3),
  },
  content: {
    flex: 1,
    marginLeft: wp(3),
  },
  title: {
    color: Colors.primaryOrange,
    fontFamily: Fonts.Urbanist.bold,
    fontSize: hp(2.2),
  },
  subtitle: {
    fontSize: hp(1.5),
    color: Colors.bodyText,
    marginVertical: hp(0.5),
  },
  food: {
    fontSize: hp(1.6),
    color: Colors.black,
  },
  statusContainer: {
    backgroundColor: Colors.greeFadd,
    alignSelf: 'flex-start',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderRadius: wp(2),
    marginTop: hp(0.8),
  },
  statusText: {
    fontSize: hp(1.5),
    color: Colors.green,
    fontFamily: Fonts.Urbanist.extraBold,
  },
});

export default OrderCard;
