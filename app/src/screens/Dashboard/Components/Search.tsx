import { Colors } from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import { View, TextInput, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { SearchIcon } from 'styles/svg-icons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const SearchBar = ({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (text: string) => void;
}) => {
  return (
    <View style={styles.container}>
      <SvgXml xml={SearchIcon} style={styles.icon} width={wp('5%')} height={wp('5%')} />
      <TextInput
        placeholder="Search"
        placeholderTextColor={Colors.bodyText}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: wp('4%'),
    borderRadius: wp('2.5%'),
    marginBottom: hp('1%'),
    height: hp('6%'),
  },
  input: {
    marginLeft: wp('2.5%'),
    flex: 1,
    fontSize: wp('4%'), 
    fontFamily: Fonts.Urbanist.regular,
    color: Colors.black,
  },
  icon: {
    marginRight: wp('1%'),
  },
});

export default SearchBar;
