import React, {useState} from 'react';
import {
  Button,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {SvgXml} from 'react-native-svg';
// import {eyeIconClosed, eyeIconOpen} from 'styles/Icons';
export const eyeIconOpen = `<svg width="17" height="13" viewBox="0 0 17 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 6.33333C1 6.33333 3.66667 1 8.33333 1C13 1 15.6667 6.33333 15.6667 6.33333C15.6667 6.33333 13 11.6667 8.33333 11.6667C3.66667 11.6667 1 6.33333 1 6.33333Z" stroke="#736B66" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.33333 8.33333C9.4379 8.33333 10.3333 7.4379 10.3333 6.33333C10.3333 5.22876 9.4379 4.33333 8.33333 4.33333C7.22876 4.33333 6.33333 5.22876 6.33333 6.33333C6.33333 7.4379 7.22876 8.33333 8.33333 8.33333Z" stroke="#736B66" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

export const eyeIconClosed = `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_2244_4809)">
<path d="M35.88 35.88C32.4612 38.486 28.2982 39.9297 24 40C10 40 2 24 2 24C4.48778 19.3638 7.93827 15.3132 12.12 12.12M19.8 8.48C21.1767 8.15776 22.5861 7.99668 24 8C38 8 46 24 46 24C44.786 26.2712 43.3381 28.4095 41.68 30.38M28.24 28.24C27.6907 28.8295 27.0283 29.3023 26.2923 29.6302C25.5563 29.9582 24.7618 30.1345 23.9562 30.1487C23.1506 30.1629 22.3503 30.0148 21.6032 29.713C20.8561 29.4112 20.1774 28.9621 19.6077 28.3923C19.0379 27.8226 18.5888 27.1439 18.287 26.3968C17.9852 25.6497 17.8371 24.8494 17.8513 24.0438C17.8655 23.2382 18.0418 22.4437 18.3698 21.7077C18.6977 20.9717 19.1705 20.3093 19.76 19.76M2 2L46 46" stroke="#736B66" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_2244_4809">
<rect width="48" height="48" fill="white"/>
</clipPath>
</defs>
</svg>`;
interface PasswordInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: string;
  style?: object;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  style,
}) => {
  const [isSecure, setIsSecure] = useState(true);

  const togglePasswordVisibility = () => {
    setIsSecure(prevState => !prevState);
  };

  return (
    <View style={[InputStyles.container, style]}>
      <LinearGradient
        colors={['#DB2533', '#AC2959', '#7C2D7E']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={InputStyles.gradientBorder}>
        <TextInput
          style={InputStyles.inputStyleThree}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isSecure}
          placeholderTextColor="#A5A5A5"
        />
      </LinearGradient>
      <TouchableOpacity
        style={InputStyles.eyeIcon}
        onPress={togglePasswordVisibility}>
        {isSecure ? (
          <SvgXml xml={eyeIconClosed} width={20} height={20} />
        ) : (
          <SvgXml xml={eyeIconOpen} width={20} height={20} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const InputStyles = StyleSheet.create({
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 2,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 10,
    borderRadius: 28,
    paddingLeft: 20,
  },

  inputStyleTwo: {
    padding: 12,
    borderColor: '#544C4C24',
    borderWidth: 1,
    borderRadius: 6,
    fontSize: 16,
    color: '#544C4C',
    marginBottom: 12,
  },

  gradientBorder: {
    borderRadius: 28,
    padding: 2,
  },

  inputStyleThree: {
    padding: 12,
    fontSize: 16,
    color: '#A5A5A5',
    fontFamily: 'Urbanist',
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 26,
    fontWeight: 'bold',
    backgroundColor: '#ffffff',
    gap: 10,
  },

  inputStyleFour: {
    padding: 12,
    fontSize: 16,
    color: '#544C4C',
    fontFamily: 'Urbanist',
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 8,
    fontWeight: 'bold',
    backgroundColor: '#ffffff',
    gap: 10,
  },

  gradientBorderFour: {
    borderRadius: 8,
    padding: 2,
  },
  // EYE ICONS FOR PASSWORD INPUT

  container: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{translateY: -10}],
  },
  eyeImage: {
    width: 20,
    height: 20,
  },

  // DROPDOWN INPUT STYLES

  gradientBorderPicker: {
    borderRadius: 32,
    padding: 2,
    overflow: 'hidden',
  },

  pickerContainer: {
    // backgroundColor: '#FFFFFF',
    // borderRadius: 30,
  },
  picker: {
    height: 50,
    width: '100%',
    fontSize: 16,
    color: '#A5A5A5',
    fontWeight: 'bold',
    fontFamily: 'Urbanist',
  },

  NormalgradientBorderPicker: {
    padding: 2,
    overflow: 'hidden',
  },
  NormalPickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,

    paddingHorizontal: 10,
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },

  //  OTP INPUT STYLES

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  otpWrapper: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    padding: 5,
  },
  otpInput: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    borderWidth: 0,
    fontSize: 18,
    textAlign: 'center',
  },

  normalBorderPicker: {
    borderRadius: 32,
    padding: 2,
    overflow: 'hidden',
  },

  Normalpicker: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#000000',
    paddingHorizontal: 10,
    overflow: 'hidden',
  },

  pickerWithBorder: {
    height: 50,
    width: '100%',
    fontSize: 16,
    color: '#A5A5A5',
    fontWeight: 'bold',
    fontFamily: 'Urbanist',
  },
});

export {PasswordInput};
