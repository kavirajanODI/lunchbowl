import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {SvgXml} from 'react-native-svg';
import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import {history} from 'styles/svg-icons';
type UnderConstructionRouteParams = {
  UnderConstruction: {
    title?: string;
    message?: string;
  };
};
const UnderConstruction = () => {
  const navigation = useNavigation();

  const route =
    useRoute<RouteProp<UnderConstructionRouteParams, 'UnderConstruction'>>();
  const {title, message} = route.params || {};
  return (
    <View style={styles.container}>
      <SvgXml xml={history} width={100} height={100} />
      <Text style={styles.title}>{title || 'Coming Soon'}</Text>
      <Text style={styles.message}>
        {message ||
          'This feature is under development. Please check back later.'}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
    marginTop: 20,
  },
  message: {
    fontSize: 16,
    fontFamily: Fonts.Urbanist.regular,
    color: Colors.bodyText,
    textAlign: 'center',
    marginVertical: 15,
  },
  button: {
    marginTop: 20,
    backgroundColor: Colors.primaryOrange,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: Fonts.Urbanist.bold,
  },
});

export default UnderConstruction;
