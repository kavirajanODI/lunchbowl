import React, {ReactNode} from 'react';
import {SafeAreaView, StyleSheet, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type Props = {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
};

export default function ThemeGradientBackground({children, style}: Props) {
  return (
    <LinearGradient
      colors={['#FF651429', '#4AB23814', 'rgba(250, 250, 250, 1)']}
      locations={[0, 0.1, 0.25]}
      start={{x: 0.1, y: 0}}
      end={{x: 0.1, y: 1}}
      style={[styles.gradient, style]}>
      <SafeAreaView style={styles.safeArea}>{children}</SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
