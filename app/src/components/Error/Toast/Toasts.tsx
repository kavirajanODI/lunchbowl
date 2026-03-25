import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Easing,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Fonts from 'assets/styles/fonts';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {Colors} from 'assets/styles/colors';

type ToastType = 'success' | 'error' | 'warning' | 'info';

type ToastPayload = {
  type?: ToastType;
  title?: string;
  message: string;
  duration?: number;
  colors?: string[];
};

type ToastRef = {
  show: (p: ToastPayload) => void;
};

const DEFAULT_DURATION = 3500;

const colorMap: Record<
  ToastType,
  {colors: string[]; textColor?: string; icon: string}
> = {
  success: {
    colors: [Colors.green, Colors.green],
    textColor: '#fff',
    icon: '✔',
  },
  error: {
    colors: [Colors.red, Colors.red],
    textColor: '#fff',
    icon: '✖',
  },
  warning: {
    colors: [Colors.primaryOrange, Colors.primaryOrange],
    textColor: '#fff',
    icon: '⚠',
  },
  info: {
    colors: ['#2D9CDB', '#2D9CDB'],
    textColor: '#fff',
    icon: 'ℹ',
  },
};

const Toast = forwardRef<ToastRef, {}>((_props, ref) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const hideTimeout = useRef<number | null>(null);

  // ✅ state to force re-render with correct payload
  const [payload, setPayload] = useState<ToastPayload | null>(null);

  useImperativeHandle(ref, () => ({
    show: (newPayload: ToastPayload) => {
      setPayload(newPayload);

      // animate in
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      // clear previous timer
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }

      hideTimeout.current = setTimeout(() => {
        hide();
      }, newPayload.duration ?? DEFAULT_DURATION) as unknown as number;
    },
  }));

  const hide = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 250,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setPayload(null);
    });
  };

  const onPressClose = () => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }
    hide();
  };

  if (!payload) return null;

  const type = payload.type ?? 'info';
  const mapEntry = colorMap[type];
  const colors = payload.colors ?? mapEntry.colors;
  const textColor = mapEntry.textColor ?? '#fff';

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.container,
        {
          transform: [{translateY}],
          opacity,
        },
      ]}>
      <LinearGradient
        colors={colors}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.toastBox}>
        <View style={styles.content}>
          {/* Icon */}
          <Text style={[styles.icon, {color: textColor}]}>{mapEntry.icon}</Text>

          {/* Text */}
          <View style={styles.textBlock}>
            {payload.title ? (
              <Text style={[styles.title, {color: textColor}]}>
                {payload.title}
              </Text>
            ) : null}
            <Text style={[styles.message, {color: textColor}]}>
              {payload.message}
            </Text>
          </View>

          {/* Close Button */}
          <TouchableOpacity onPress={onPressClose} style={styles.closeBtn}>
            <Text style={[styles.closeText, {color: textColor}]}>×</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );
});

export default Toast;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
  },
  toastBox: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    minWidth: Math.min(Dimensions.get('window').width - 40, 420),
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
    marginRight: 8,
  },
  textBlock: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 14,
    fontFamily: Fonts.Urbanist.semiBold,
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    fontFamily: Fonts.Urbanist.regular,
  },
  closeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  closeText: {
    fontSize: 20,
    lineHeight: 20,
    fontWeight: '700',
  },
});
