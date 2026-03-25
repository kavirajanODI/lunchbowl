import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';

const OfflineNotice = () => {
  const [isConnected, setIsConnected] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? true);
    });
    return () => unsubscribe();
  }, []);

  if (isConnected) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>⚠️ You are offline</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.red,
    padding: 10,
    alignItems: 'center',
    borderRadius:10,
  },
  text: {
    color: Colors.bg,
    fontFamily:Fonts.Urbanist.blackItalic
  },
});

export default OfflineNotice;
