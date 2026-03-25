import React from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Colors} from 'assets/styles/colors';

const successIcon = `<svg fill="#22bb33" height="60" width="60" viewBox="0 0 24 24">
  <path d="M20.285 6.709l-11.285 11.292-5.285-5.292 1.415-1.415 3.87 3.877 9.87-9.877z"/>
</svg>`;

const errorIcon = `<svg fill="#ff3333" height="60" width="60" viewBox="0 0 24 24">
  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 
  12-5.373 12-12-5.373-12-12-12zm5 16.59l-1.41 
  1.41-3.59-3.59-3.59 3.59-1.41-1.41 3.59-3.59-3.59-3.59 
  1.41-1.41 3.59 3.59 3.59-3.59 1.41 1.41-3.59 
  3.59 3.59 3.59z"/>
</svg>`;

const warningIcon = `<svg fill="#ffcc00" height="60" width="60" viewBox="0 0 24 24">
  <path d="M1 21h22l-11-19-11 19zm12-3h-2v2h2v-2zm0-6h-2v5h2v-5z"/>
</svg>`;

interface Props {
  visible: boolean;
  type: 'success' | 'error' | 'warning';
  message: string;
  onClose: () => void;
}

const AlertModal: React.FC<Props> = ({visible, type, message, onClose}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return successIcon;
      case 'error':
        return errorIcon;
      case 'warning':
        return warningIcon;
      default:
        return successIcon;
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <SvgXml xml={getIcon()} width={60} height={60} />
          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AlertModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: Colors.white,
    padding: wp('6%'),
    borderRadius: wp('4%'),
    width: '80%',
    alignItems: 'center',
  },
  message: {
    fontSize: wp('4%'),
    color: Colors.black,
    textAlign: 'center',
    marginVertical: hp('2%'),
  },
  button: {
    backgroundColor: Colors.primaryOrange,
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('8%'),
    borderRadius: wp('2%'),
  },
  buttonText: {
    color: Colors.white,
    fontSize: wp('3.8%'),
    fontWeight: '600',
  },
});
