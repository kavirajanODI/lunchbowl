import PrimaryButton from 'components/buttons/PrimaryButton';
import React, {useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ActivityIndicator,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useMeals} from 'context/MealContext';
import Typography from 'components/Text/Typography';
import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import {useNavigation} from '@react-navigation/native';

const {width: screenWidth} = Dimensions.get('window');

const PopularMenus = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const {meals, loading, error} = useMeals();
  const navigation = useNavigation<any>();


  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (screenWidth * 0.8 + wp('4%')));
    setCurrentIndex(index);
  };

  function GotoMenue(mealId: string) {
    navigation.navigate('MealDetailScreen', {mealId});
  }

  if (loading) {
    return (
      <View style={styles.loaderWrapper}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorWrapper}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (meals.length === 0) {
    return (
      <View style={styles.errorWrapper}>
        <Text style={styles.errorText}>No meals available right now.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled={false}
        onScroll={onScroll}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContainer}>
        {meals.map(meal => (
          <View key={meal.id} style={styles.card}>
            <View style={styles.imageWrapper}>
              <Image
                source={meal.image}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
            <View style={styles.detailsContainer}>
              <Typography style={styles.title} numberOfLines={1}>
                {meal.title}
              </Typography>
              <Typography style={styles.description}>
                {meal.description}
              </Typography>
            </View>
            <PrimaryButton
              title="View Meal Info"
              onPress={() => GotoMenue(meal.id)}
              style={{width: '90%'}}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  scrollContainer: {},
  card: {
    width: screenWidth * 0.8,
    marginRight: wp('2%'),
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'flex-start',
  },
  imageWrapper: {
    width: wp('78%'),
    height: hp('40%'),
    overflow: 'hidden',
    marginTop: hp('2%'),
    borderTopLeftRadius: wp('4%'),
    borderTopRightRadius: wp('4%'),
    alignSelf: 'center',
    position: 'relative',
    backgroundColor: Colors.lightRed,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  detailsContainer: {
    alignItems: 'flex-start',
    padding: wp('3%'),
    zIndex: 10,
  },
  title: {
    fontSize: wp('4.5%'),
    color: Colors.black,
    fontFamily: Fonts.Urbanist.bold,
  },
  description: {
    fontSize: wp('3.5%'),
    color: Colors.default,
    fontFamily: Fonts.Urbanist.regular,
  },
  loaderWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('40%'),
  },
  errorWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('40%'),
  },
  errorText: {
    fontSize: wp('4%'),
    color: 'red',
    fontFamily: 'Urbanist-Bold',
  },
});

export default PopularMenus;
