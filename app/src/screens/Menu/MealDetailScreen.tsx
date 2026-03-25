import React, {useMemo, useRef, useState, useCallback} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import Typography from 'components/Text/Typography';
import PrimaryButton from 'components/buttons/PrimaryButton';
import HeaderBackButton from 'screens/Dashboard/Components/BackButton';
import {useMeals} from 'context/MealContext';
import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import {LoadingModal} from 'components/LoadingModal/LoadingModal';
import ErrorMessage from 'components/Error/BoostrapStyleError';
import {SvgXml} from 'react-native-svg';
import {sendIcon} from 'styles/svg-icons';
import {BlurView} from '@react-native-community/blur';

type MealDetailProps = {
  navigation: any;
  route: any;
};

const MealDetailScreen: React.FC<MealDetailProps> = ({route}) => {
  const {mealId} = route.params;
  const {meals, loading, error} = useMeals();
  const meal = meals.find(m => m.id === mealId);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [sheetIndex, setSheetIndex] = useState(0);

  const snapPoints = useMemo(() => [hp('30%'), hp('70%')], []);

  const handleSheetChange = useCallback((index: number) => {
    setSheetIndex(index);
  }, []);

  if (!meal) {
    return (
      <ThemeGradientBackground>
        <LoadingModal loading={loading} setLoading={() => {}} />
        {error && <ErrorMessage error={error} onClose={() => {}} />}
        {!loading && (
          <View style={styles.container}>
            <HeaderBackButton title="Meal Detail" />
            <Typography style={styles.desc}>Meal not found.</Typography>
          </View>
        )}
      </ThemeGradientBackground>
    );
  }

  return (
    <ThemeGradientBackground>
      <View style={styles.headercontainer}>
        <HeaderBackButton
          title={meal.title}
          titleStyle={[
            styles.headerTitle,
            sheetIndex > 0 && styles.headerTitleWhite,
          ]}
        />
      </View>

      <View style={styles.container}>
        <View>
          <Image source={meal.image} style={styles.image} />
        </View>
        {sheetIndex > 0 && (
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={1}
            reducedTransparencyFallbackColor="white"
          />
        )}
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
        enablePanDownToClose={false}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}>
        <BottomSheetScrollView
          style={styles.contentWrapper}
          showsVerticalScrollIndicator={false}>
          {/* Title */}
          <Typography style={styles.title} numberOfLines={2}>
            {meal.title}
          </Typography>

          {/* Description */}
          <Typography style={styles.desc} numberOfLines={20}>
            {meal.description}
          </Typography>

          {/* Ingredients */}
          <Typography style={styles.title}>Ingredients</Typography>
          <Typography style={styles.desc} numberOfLines={20}>
            {meal.ingredients || 'No ingredients available.'}
          </Typography>

          {/* Nutrition */}
          <Typography style={styles.title}>Nutrition Value</Typography>
          <View style={styles.nutritionContainer}>
            {meal.nutritionValues?.length > 0 ? (
              meal.nutritionValues.map((item: string, idx: number) => (
                <View key={idx} style={styles.nutritionTag}>
                  <Typography style={styles.nutritionText}>{item}</Typography>
                </View>
              ))
            ) : (
              <Typography style={styles.desc}>
                No nutrition data available.
              </Typography>
            )}
          </View>
        </BottomSheetScrollView>
      </BottomSheet>

      {/* Button at bottom */}
      <View style={styles.buttoncontainer}>
        <PrimaryButton
          title="Book Now"
          onPress={() => console.log('Booking Meal:', meal.title)}
          style={styles.button}
        />
        <SvgXml xml={sendIcon} style={styles.buttonIcon} />
      </View>
    </ThemeGradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp('6%'),
    paddingBottom: hp('10%'),
  },
  headercontainer: {
    paddingHorizontal: wp('6%'),

    zIndex: 10,
  },

  headerTitle: {
    color: Colors.black,
  },
  headerTitleWhite: {
    color: Colors.white,
  },

  image: {
    width: '100%',
    height: hp('58%'),
    resizeMode: 'cover',
    borderRadius: 20,
  },
  bottomSheetBackground: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius: wp('5%'),

    // ✅ iOS shadow
    shadowColor:Colors.black,
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.1,
    shadowRadius: 6,

    elevation: 10,
  },

  handleIndicator: {
    backgroundColor: Colors.Storke,
    width: wp('25%'),
  },
  contentWrapper: {
    paddingHorizontal: wp('7%'),
    paddingTop: hp('1%'),
  },
  title: {
    fontSize: wp('5%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
    marginBottom: hp('1%'),
  },
  desc: {
    fontSize: wp('3.8%'),
    fontFamily: Fonts.Urbanist.regular,
    color: Colors.bodyText,
    marginBottom: hp('2%'),
    lineHeight: hp('2.5%'),
  },
  nutritionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: hp('2%'),
  },
  nutritionTag: {
    backgroundColor: Colors.lightRed,
    paddingVertical: hp('0.6%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('2%'),
    marginRight: wp('2%'),
    marginBottom: hp('1%'),
  },
  nutritionText: {
    fontSize: wp('3.4%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.primaryOrange,
  },
  buttoncontainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('6%'),
    paddingVertical: hp('2%'),
    backgroundColor: Colors.white,
  },
  button: {
    flex: 1,
    marginRight: wp('3%'),
  },
  buttonIcon: {
    width: wp('8%'),
    height: wp('8%'),
  },
});

export default MealDetailScreen;
