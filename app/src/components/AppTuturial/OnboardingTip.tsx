import React, {useEffect, useRef, useState} from 'react';
import {View, Text, Modal, Pressable, Animated, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface OnboardingTipProps {
  storageKey: string;
}

const OnboardingTip: React.FC<OnboardingTipProps> = ({storageKey}) => {
  const [visible, setVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Check if user has seen tip before
    AsyncStorage.getItem(storageKey).then(value => {
      if (!value) {
        setVisible(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }
    });
  }, []);

  const handleClose = () => {
    AsyncStorage.setItem(storageKey, 'true');
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Animated.View style={[styles.tipContainer, {opacity: fadeAnim}]}>
          <Text style={styles.title}>Welcome to My Plan!</Text>
          <Text style={styles.message}>
            Here you can view your subscription, select or update your meal
            plan, and see holidays. Tap any date to view booked meals, see who
            has booked, and check food orders for each child. The calendar uses
            colors to indicate holidays, booked dates, and available dates.
          </Text>

          <Pressable onPress={handleClose} style={styles.button}>
            <Text style={styles.buttonText}>Got it</Text>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

export default OnboardingTip;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipContainer: {
    backgroundColor: Colors.white,
    padding: wp('5%'),
    borderRadius: 16,
    width: '85%',
    alignItems: 'center',
  },
  title: {
    fontSize: hp('2.2%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.primaryOrange,
    marginBottom: hp('1%'),
  },
  message: {
    fontSize: hp('1.7%'),
    fontFamily: Fonts.Urbanist.medium,
    color: Colors.bodyText,
    textAlign: 'center',
    marginBottom: hp('2%'),
  },
  button: {
    backgroundColor: Colors.primaryOrange,
    paddingHorizontal: wp('8%'),
    paddingVertical: hp('1%'),
    borderRadius: 10,
  },
  buttonText: {
    color: Colors.white,
    fontFamily: Fonts.Urbanist.bold,
  },
});
