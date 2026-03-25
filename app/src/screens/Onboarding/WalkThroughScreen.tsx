import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import SecondaryButton from 'components/buttons/SecondaryButton';
import React, {useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import PrimaryButton from 'components/buttons/PrimaryButton';
import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';

// #################### SLIDE DATA ##################

const Walkslides = [
  {
    id: 1,
    title: ['Create your', 'Account'],
    description:
      'Lorem ipsum dolor sit amet consectetur. Facilisis in vitae nibh quis nulla. Vulputate lacus lacus euismod adipiscing adipi scing lacinia. Sed ut fermentum. ',
    image: require('assets/images/WalkThrow/walk1.png'),
  },
  {
    id: 2,
    title: ['Choose Yours', 'Menu'],

    description:
      'Lorem ipsum dolor sit amet consectetur. Facilisis in vitae nibh quis nulla. Vulputate lacus lacus euismod adipiscing adipi scing lacinia. Sed ut fermentum. ',
    image: require('assets/images/WalkThrow/walk2.png'),
  },
  {
    id: 3,
    title: ['Place Your', 'Order'],

    description:
      'Lorem ipsum dolor sit amet consectetur. Facilisis in vitae nibh quis nulla. Vulputate lacus lacus euismod adipiscing adipi scing lacinia. Sed ut fermentum. ',
    image: require('assets/images/WalkThrow/walk3.png'),
  },
  {
    id: 4,
    title: ['Sit Back ', 'Relax'],

    description:
      'Lorem ipsum dolor sit amet consectetur. Facilisis in vitae nibh quis nulla. Vulputate lacus lacus euismod adipiscing adipi scing lacinia. Sed ut fermentum. ',

    image: require('assets/images/WalkThrow/walk4.png'),
  },
];

const WalkThroughScreen: React.FC<{navigation: any}> = ({navigation}) => {
  //############ STATE VARAIBLES ####################
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const imageScale = useRef(new Animated.Value(0.95)).current;

  //################# HOOKS #########################

  useEffect(() => {
    imageOpacity.setValue(0);
    imageScale.setValue(0.95);
    Animated.parallel([
      Animated.timing(imageOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(imageScale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
      }),
    ]).start();
  }, [currentSlideIndex]);

  //############## HELPER FUNCTIONS #################

  const handleNext = () => {
    if (currentSlideIndex < Walkslides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      navigation.navigate('Login');
    }
  };

  const handleBack = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const skipToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <ThemeGradientBackground>
      <View style={styles.mainContent}>
        {/*############### SKIP CONTAINER  ################ */}
        <View style={styles.topSection}>
          {currentSlideIndex < Walkslides.length - 0 && (
            <Text style={styles.skipText} onPress={skipToLogin}>
              Skip
            </Text>
          )}

          {/*############### PAGINATION CONTAINER  ############ */}

          <View style={styles.pagination}>
            {Walkslides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  currentSlideIndex === index ? styles.activeDot : {},
                ]}
              />
            ))}
          </View>
        </View>
        {/*############ IMAGE  CONTAINER  #################### */}

        <View style={styles.imageContainer}>
          <Animated.Image
            source={Walkslides[currentSlideIndex].image}
            style={[
              styles.welcomeImage,
              {
                opacity: imageOpacity,
                transform: [{scale: imageScale}],
              },
            ]}
            resizeMode="contain"
          />
        </View>

        {/*############ BOTTOM CONTAINER  #################### */}
        <View style={styles.buttonWithTextContainer}>
          <Text style={styles.title}>
            {Walkslides[currentSlideIndex].title.map((word, index) => (
              <Text
                key={index}
                style={
                  index === 0
                    ? styles.spanTittle
                    : index === 1
                    ? styles.highlightText
                    : {}
                }>
                {word}{' '}
              </Text>
            ))}
          </Text>

          <Text style={styles.description}>
            {Walkslides[currentSlideIndex].description}
          </Text>
          <View style={styles.buttonRow}>
            {currentSlideIndex !== 0 && (
              <SecondaryButton
                title="Back"
                onPress={handleBack}
                style={{
                  width: currentSlideIndex === 0 ? wp('90%') : wp('40%'),
                }}
              />
            )}
            <PrimaryButton
              title="Next"
              onPress={handleNext}
              style={{
                width: currentSlideIndex === 0 ? wp('90%') : wp('40%'),
              }}
            />
          </View>
        </View>
      </View>
    </ThemeGradientBackground>
  );
};

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    width: wp('100%'),
    justifyContent: 'space-between',
  },
  topSection: {
    marginTop: hp('4%'),
    width: '100%',
    alignItems: 'flex-end',
    paddingHorizontal: wp('5%'),
  },
  skipText: {
    color: Colors.primaryOrange,
    fontSize: wp('3.5%'),
    fontFamily: Fonts.Urbanist.regular,
    borderColor: Colors.primaryOrange,
    borderWidth: 1,
    textTransform: 'uppercase',
    paddingVertical: hp('0.5%'),
    paddingHorizontal: wp('5%'),
    borderRadius: wp('10%'),
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: hp('1.5%'),
  },
  dot: {
    width: wp('20%'),
    height: wp('1%'),
    borderRadius: wp('1.5%'),
    backgroundColor: Colors.bodyText,
    marginHorizontal: wp('0.9%'),
  },
  activeDot: {
    backgroundColor: Colors.primaryOrange,
  },
  imageContainer: {
    flex: 3,
    width: '100%',
    height: hp('50%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeImage: {
    width: wp('90%'),
    height: '90%',
    resizeMode: 'contain',
  },

  title: {
    fontSize: wp('9%'),
    color: Colors.primaryOrange,
    fontFamily: Fonts.Urbanist.semiBold,
    textAlign: 'center',
    width: wp('50%'),
    marginBottom: hp('1.9%'),
  },
  spanTittle: {
    fontSize: wp('9%'),
    color: Colors.primaryOrange,
    fontFamily: Fonts.Urbanist.semiBold,
    textAlign: 'center',
    width: wp('100%'),
  },

  highlightText: {
    color: Colors.primaryOrange,
  },
  description: {
    fontSize: wp('4.2%'),
    textAlign: 'center',
    color: Colors.bodyText,
    marginBottom: hp('3%'),
    fontFamily: Fonts.Urbanist.regular,
    lineHeight: wp('6%'),
    fontWeight: '500',
    paddingHorizontal: wp('5%'),
    maxWidth: wp('90%'),
  },

  buttonWithTextContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('4%'),
    paddingHorizontal: wp('5%'),
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: wp('4%'),
    flexWrap: 'wrap',
    gap: wp('4%'),
  },
});

export default WalkThroughScreen;
