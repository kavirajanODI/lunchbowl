import React from 'react';
import {Modal, StyleSheet, TouchableOpacity, View} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {Colors} from 'assets/styles/colors';

interface BottomModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const BottomModal: React.FC<BottomModalProps> = ({visible, onClose, children}) => {
  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalContainer}>
          {children}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius: wp('5%'),
    padding: wp('5%'),
    minHeight: hp('30%'),
  },
});

export default BottomModal;
