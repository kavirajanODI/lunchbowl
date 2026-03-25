import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import GradientActivityIndicator from '../../components/ActivityIndicator/GradientActivityIndicator';
import {SvgXml} from 'react-native-svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {logo} from 'styles/svg-icons';

const SplashScreen: React.FC<{navigation: any}> = ({navigation}) => {
  //############### HOOKS ####################
  useEffect(() => {
    if (navigation) {
      const timeout = setTimeout(() => {
        navigation.replace('WalkThroughScreen');
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [navigation]);

  return (
    <View style={styles.container}>
      <SvgXml xml={logo} style={styles.logo} />
      <GradientActivityIndicator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logo: {
    width: wp('40%'),
    height: wp('36%'),
    marginBottom: hp('4%'),
  },
  loader: {
    marginTop: hp('2%'),
  },
  logosvg: {
    position: 'absolute',
    top: hp('3%'),
    right: wp('5%'),
    width: wp('6%'),
    height: wp('6%'),
    color: '#000000',
  },
});

export default SplashScreen;
