import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {Colors} from 'assets/styles/colors';

const {width} = Dimensions.get('window');

const OfflineScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.emoji}>📡</Text>
        <Text style={styles.title}>Oops! You are Offline</Text>
        <Text style={styles.message}>
          Please check your internet connection and try again.
        </Text>
       
      </View>
    </View>
  );
};

export default OfflineScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff7f0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
    width: width * 0.85,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  emoji: {
    fontSize: 50,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primaryOrange,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.primaryOrange,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
