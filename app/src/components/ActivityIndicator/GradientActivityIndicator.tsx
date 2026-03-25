import React, {useEffect} from 'react';
import {View, StyleSheet, Animated, Easing} from 'react-native';
import Svg, {Circle, Defs, LinearGradient, Stop} from 'react-native-svg';

const GradientActivityIndicator: React.FC = () => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rotateAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ).start();
  }, [rotateAnim]);

  const rotateInterpolation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{transform: [{rotate: rotateInterpolation}]}}>
        <Svg width={40} height={40} viewBox="0 0 100 100">
          <Defs>
            <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#FF0000" stopOpacity="1" />
              <Stop offset="50%" stopColor="#808000" stopOpacity="1" />
              <Stop offset="100%" stopColor="#00FF00" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Circle
            cx="50"
            cy="50"
            r="40"
            stroke="url(#grad)"
            strokeWidth="10"
            strokeDasharray="251"
            strokeDashoffset="30"
            fill="white"
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    height: 20,
    width: 20,
    marginTop: 40,
  },
});

export default GradientActivityIndicator;
