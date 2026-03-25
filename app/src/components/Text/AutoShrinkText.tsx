import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';

interface AutoShrinkTextProps extends TextProps {
  children: React.ReactNode;
  fontSize?: number;
  minimumFontScale?: number;
}

const AutoShrinkText: React.FC<AutoShrinkTextProps> = ({
  children,
  fontSize = 22,
  minimumFontScale = 0.7,
  style,
  ...rest
}) => {
  return (
    <Text
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={minimumFontScale}
      style={[styles.text, { fontSize }, style]}
      {...rest}>
      {children}
    </Text>
  );
};

export default AutoShrinkText;

const styles = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    color: '#333',
  },
});
