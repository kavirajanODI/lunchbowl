import React from 'react';
import { Text, StyleProp, TextStyle } from 'react-native';

type AppTextProps = {
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  // children: React.ReactNode;
  children: string;
  maxWords?: number;
};
const Typography: React.FC<AppTextProps> = ({ children, style, numberOfLines = 1, maxWords }) => {
  let displayedText = children;

  if (maxWords) {
    const words = children.split(' ');
    if (words.length > maxWords) {
      displayedText = words.slice(0, maxWords).join(' ') + '...';
    }
  }

  return (
    <Text
      style={style}
      numberOfLines={numberOfLines}
      ellipsizeMode="tail"
    >
      {displayedText}
    </Text>
  );
};

export default Typography;