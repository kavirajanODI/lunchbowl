import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {BellIcon, DefultProfilePic} from 'styles/svg-icons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import Typography from 'components/Text/Typography';

interface HeaderProps {
  userName: string;
  navigation: any;
}

export default function Header({userName, navigation}: HeaderProps) {
  const goToSettings = () => {
    navigation.navigate('Settings');
  };
  const goNotification = () => {
    navigation.navigate('NotificationScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.textSection}>
        <Typography style={styles.greeting}>{`Hello, ${
          Array.isArray(userName) ? userName.join(' ') : userName
        }!`}</Typography>
        <Typography style={styles.subtitle}>Welcome to Lunch Bowl</Typography>
      </View>
      <View style={styles.rightIcons}>
        <TouchableOpacity onPress={goNotification}>
          <SvgXml xml={BellIcon} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={goToSettings}>
          <SvgXml xml={DefultProfilePic} style={styles.profile} />
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('2%'),
    marginBottom: hp('1%'),
    alignItems: 'center',
  },
  textSection: {
    flex: 1,
    paddingRight: wp('3%'),
  },
  greeting: {
    fontSize: wp('7.5%'),
    color: Colors.primaryOrange,
    fontFamily: Fonts.Urbanist.semiBold,
  },
  subtitle: {
    fontSize: wp('3.5%'),
    color: Colors.black,
    fontFamily: Fonts.Urbanist.semiBold,
    marginTop: hp('0.5%'),
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: wp('6%'), 
    height: wp('6%'),
    marginRight: wp('3%'),
  },
  profile: {
    width: wp('8%'), 
    height: wp('8%'),
    borderRadius: wp('4%'),
  },
});
