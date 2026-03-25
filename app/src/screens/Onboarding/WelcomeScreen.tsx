import React, {useEffect, useRef} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import PrimaryButton from 'components/buttons/PrimaryButton';
import LinearGradient from 'react-native-linear-gradient';
import {Easing} from 'react-native';
import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';

const imageRows = [
  [
    require('../../assets/images/WelcomScreens/image1.png'),
    require('../../assets/images/WelcomScreens/image2.png'),
  ],
  [
    require('../../assets/images/WelcomScreens/image6.png'),
    require('../../assets/images/WelcomScreens/image5.png'),
    require('../../assets/images/WelcomScreens/image6.png'),
  ],
  [
    require('../../assets/images/WelcomScreens/image7.png'),
    require('../../assets/images/WelcomScreens/image8.png'),
    require('../../assets/images/WelcomScreens/image9.png'),
  ],
];

const WelcomeScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const SPEED = 20;

  const startMarquee = (
    animatedValue: Animated.Value,
    ref: any,
    totalWidth: number,
    direction = 1,
  ) => {
    const animate = () => {
      animatedValue.setValue(0);
      Animated.timing(animatedValue, {
        toValue: totalWidth,
        duration: (totalWidth / SPEED) * 1000,
        useNativeDriver: false,
        easing: Easing.linear,
      }).start(() => animate());
    };

    animatedValue.addListener(({value}) => {
      const scrollPos = direction === 1 ? value : totalWidth - value;
      ref.current?.scrollTo({x: scrollPos, animated: false});
    });

    animate();

    return () => animatedValue.removeAllListeners();
  };

  const scrollX1 = useRef(new Animated.Value(0)).current;
  const scrollX2 = useRef(new Animated.Value(0)).current;
  const scrollX3 = useRef(new Animated.Value(0)).current;

  const scrollRef1 = useRef<ScrollView>(null);
  const scrollRef2 = useRef<ScrollView>(null);
  const scrollRef3 = useRef<ScrollView>(null);

  useEffect(() => {
    const width1 = (wp('50%') + wp('2%')) * imageRows[0].length;
    const width2 = (wp('40%') + wp('2%')) * imageRows[1].length;
    const width3 = (wp('30%') + wp('2%')) * imageRows[2].length;

    const unsub1 = startMarquee(scrollX1, scrollRef1, width1, 1); // left
    const unsub2 = startMarquee(scrollX2, scrollRef2, width2, -1); // right
    const unsub3 = startMarquee(scrollX3, scrollRef3, width3, 1); // left

    return () => {
      unsub1();
      unsub2();
      unsub3();
    };
  }, []);

  const GoToWalkthrowScreen = async () => {
    try {
      navigation.navigate('WalkThroughScreen');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <SafeAreaView style={WelcomeStyle.safeArea}>
      <ScrollView
        contentContainerStyle={WelcomeStyle.scrollContent}
        bounces={false}>
        <View style={WelcomeStyle.container}>
          <View style={WelcomeStyle.imageContainer}>
            <View style={WelcomeStyle.FirstMarque}>
              <ScrollView
                ref={scrollRef1}
                horizontal
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingLeft: wp('2%'),
                }}
                style={{
                  width: wp('70%'),
                }}>
                {[...imageRows[0], ...imageRows[0]].map((img, i) => (
                  <Image
                    key={`r1-${i}`}
                    source={img}
                    style={WelcomeStyle.imageStyleRow1}
                    resizeMode="contain"
                  />
                ))}
              </ScrollView>
            </View>

            <View style={WelcomeStyle.SecondMarque}>
              <ScrollView
                ref={scrollRef2}
                horizontal
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  flexDirection: 'row',
                  paddingLeft: wp('2%'),
                }}>
                {[...imageRows[1], ...imageRows[1]].map((img, i) => (
                  <Image
                    key={`r2-${i}`}
                    source={img}
                    style={WelcomeStyle.imageStyleRow2}
                    resizeMode="contain"
                  />
                ))}
              </ScrollView>
            </View>

            <View style={WelcomeStyle.ThirdMarque}>
              <ScrollView
                ref={scrollRef3}
                horizontal
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  flexDirection: 'row',
                  paddingLeft: wp('2%'),
                }}>
                {[...imageRows[2], ...imageRows[2]].map((img, i) => (
                  <Image
                    key={`r3-${i}`}
                    source={img}
                    style={WelcomeStyle.imageStyleRow3}
                    resizeMode="contain"
                  />
                ))}
              </ScrollView>
              <LinearGradient
                colors={['transparent', '#FFFFFF']}
                style={WelcomeStyle.imageFade}
              />
            </View>
          </View>

          <View style={WelcomeStyle.centerRow}>
            <Text style={WelcomeStyle.title}>Welcome to{'\n'}Lunch Bowl !</Text>
            <Text style={WelcomeStyle.description}>
              Lorem ipsum dolor sit amet consectetur. Facilisis in vitae nibh
              quis nulla. Vulputate lacus lacus euismod adipiscing adipi scing
              lacinia. Sed ut fermentum.
            </Text>
            <View style={WelcomeStyle.button}>
              <PrimaryButton
                title="LET’S Get Started"
                onPress={GoToWalkthrowScreen}
                style={{
                  width: wp('90%'),
                }}
              />
            </View>
            <View style={WelcomeStyle.loginContainer}>
              <Text style={WelcomeStyle.text}>Already have an Account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={WelcomeStyle.createAccountText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const WelcomeStyle = StyleSheet.create({
  FirstMarque: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  SecondMarque: {},
  ThirdMarque: {},

  imageStyleRow1: {
    width: wp('40%'),
    height: hp('25%'),
    marginRight: wp('2%'),
  },
  imageStyleRow2: {
    width: wp('40%'),
    height: hp('25%'),
    marginRight: wp('2%'),
  },
  imageStyleRow3: {
    width: wp('40%'),
    height: hp('25%'),
    marginRight: wp('2%'),
  },

  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  container: {
    alignItems: 'center',
    width: '100%',
    flex: 1,
    justifyContent: 'space-between',
  },
  welcomeImage: {
    width: wp('25%'),
    height: hp('15%'),
    resizeMode: 'contain',
    marginRight: wp('2%'),
  },
  imageContainer: {
    width: wp('100%'),
    height: hp('56%'),
    position: 'relative',
    justifyContent: 'flex-end',
  },
  imageFade: {
    position: 'absolute',
    bottom: 0,
    height: hp('40%'),
    width: '100%',
  },
  title: {
    fontSize: wp('8%'),
    color: Colors.primaryOrange,
    fontFamily: Fonts.Urbanist.semiBold,
    textAlign: 'center',
    width: wp('100%'),
  },
  description: {
    fontSize: wp('4.5%'),
    color: Colors.bodyText,
    textAlign: 'center',
    marginTop: hp('2%'),
    marginBottom: hp('2%'),
    fontFamily: Fonts.OpenSans.regular,
    width: wp('90%'),
  },
  centerRow: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: hp('2%'),
  },
  button: {
    marginVertical: hp('1%'),
    marginBottom: hp('2%'),
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: wp('3.9%'),
    color: Colors.black,
    fontWeight: '400',
    fontFamily: Fonts.OpenSans.regular,
  },
  createAccountText: {
    fontSize: wp('3.9%'),
    color: Colors.primaryOrange,
    fontFamily: Fonts.Urbanist.bold,
  },
});

export default WelcomeScreen;
