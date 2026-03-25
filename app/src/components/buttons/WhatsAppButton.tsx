import React from 'react';
import {TouchableOpacity, StyleSheet, Linking} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {WhatAppIcon} from 'styles/svg-icons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
const WhatsAppButton = () => (
  <TouchableOpacity
    style={styles.fab}
    onPress={() => Linking.openURL('https://wa.me/919345407191')}>
    <SvgXml
      xml={WhatAppIcon}
      style={styles.icon}
      width={wp('20%')}
      height={wp('20%')}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: hp('10%'),
    right: wp('0%'),
    borderRadius: wp('10%'),
  },
  icon: {
    alignSelf: 'center',
  },
});

export default WhatsAppButton;
