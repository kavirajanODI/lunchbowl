import GradientActivityIndicator from 'components/ActivityIndicator/GradientActivityIndicator';
import React from 'react';
import {Modal, View, Text, StyleSheet} from 'react-native';


interface LoadingModalProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  loadingText?: string;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({
  loading,
  setLoading,
  loadingText = 'Loading...',
}) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={loading}
      onRequestClose={() => setLoading(false)}>
      <View style={styles.modalContainer}>
        <View style={styles.overlay} />
        <View style={styles.modalContent}>
          <GradientActivityIndicator />
          <Text style={{marginTop: 20}}>{loadingText}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    textAlign: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 10,
    width: '60%',
    height: '30%',
    alignItems: 'center',
    zIndex: 2,
  },
});
