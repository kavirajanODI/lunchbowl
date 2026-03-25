import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

type SecondaryButtonProps = {
  title: string;
  onPress: () => void;
  borderColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: number;
  paddingVertical?: number;
  fontSize?: number;
  icon?: React.ReactNode;
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  fontFamily?: string;
  style?: ViewStyle;
  disabled?: boolean;
  disabledBackgroundColor?: string;
  disabledTextColor?: string;
};

export default function SecondaryButton({
  title,
  onPress,
  backgroundColor = 'transparent',
  textColor = Colors.default,
  borderColor = Colors.default,
  borderRadius = wp('2%'),
  fontSize = wp('3.8%'),
  icon = null,
  textTransform = 'uppercase',
  fontFamily = Fonts.Urbanist.bold,
  disabledBackgroundColor = Colors.formdisableState,
  disabledTextColor = Colors.bg,
  disabled = false,
  style = {},
}: SecondaryButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        style,
        {
          backgroundColor: disabled ? disabledBackgroundColor : backgroundColor,
          borderRadius,
          borderWidth: 1, // ✅ ensure border is visible
          borderColor: borderColor, // ✅ apply borderColor prop
        },
      ]}
      activeOpacity={0.8}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}>
      <View style={styles.content}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text
          style={[
            styles.text,
            {
              color: disabled ? disabledTextColor : textColor,
              fontSize,
              textTransform,
              fontFamily,
            },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail">
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: wp('100%'),
    height: hp('5.3%'),
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: wp('2%'),
  },
});
