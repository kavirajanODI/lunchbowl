import React from 'react';
import {View, StyleProp, ViewStyle} from 'react-native';
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {SvgXml} from 'react-native-svg';

interface AnimatedBellProps {
  xml: string;
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

const AnimatedBell: React.FC<AnimatedBellProps> = ({
  xml,
  width = 200,
  height = 200,
  style,
}) => {
  const swing = useSharedValue(0);

  //############### Swing animation: left → right → left → center############
  swing.value = withRepeat(
    withSequence(
      withTiming(-15, {duration: 300, easing: Easing.ease}),
      withTiming(10, {duration: 600, easing: Easing.ease}),
      withTiming(-5, {duration: 400, easing: Easing.ease}),
      withTiming(0, {duration: 300, easing: Easing.ease}),
    ),
    -1,
    true,
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{rotate: `${swing.value}deg`}],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      <SvgXml xml={xml} width={width} height={height} />
    </Animated.View>
  );
};

export default AnimatedBell;
