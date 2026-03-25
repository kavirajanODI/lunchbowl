import {useNavigation} from '@react-navigation/native';
import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import Typography from 'components/Text/Typography';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextStyle,
  StyleProp,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {SvgXml} from 'react-native-svg';
import {HeaderBackIcon} from 'styles/svg-icons';

interface HeaderWithBackButtonDividerProps {
  title: string;
  onPress?: () => void;
  titleStyle?: StyleProp<TextStyle>;
}

const HeaderBackButton: React.FC<HeaderWithBackButtonDividerProps> = ({
  title,
  titleStyle,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      <View style={[styles.firstRow, {width: '90%'}]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backWrapper}>
          <SvgXml xml={HeaderBackIcon} />
          <Typography style={[styles.headerText, titleStyle]} numberOfLines={1}>
            {title}
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {},
  firstRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('2%'),
  },
  backWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    fontFamily: Fonts.Urbanist.bold,
  },
  headerText: {
    fontSize: wp('4%'),
    color: Colors.black,
    marginLeft: wp('2%'),
    fontFamily: Fonts.Urbanist.bold,
    textTransform: 'uppercase',
  },
});

export default HeaderBackButton;
