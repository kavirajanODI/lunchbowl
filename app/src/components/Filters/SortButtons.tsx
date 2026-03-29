import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {Calender, MultiCusine, questionIcon} from 'styles/svg-icons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Colors} from 'assets/styles/colors';

interface Props {
  onSort: (key: string) => void;
  onChildFilter?: () => void;
  activeSort?: string;
}

const SortButtons: React.FC<Props> = ({onSort, onChildFilter, activeSort}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, activeSort === 'name' && styles.activeButton]}
        onPress={() => {
          if (onChildFilter) {
            onChildFilter();
          } else {
            onSort('name');
          }
        }}>
        <SvgXml xml={questionIcon} width={wp('4%')} height={wp('4%')} />
        <Text style={[styles.text, activeSort === 'name' && styles.activeText]}>
          Child Name
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, activeSort === 'cuisine' && styles.activeButton]}
        onPress={() => onSort('cuisine')}>
        <SvgXml xml={MultiCusine} width={wp('4%')} height={wp('4%')} />
        <Text
          style={[
            styles.text,
            activeSort === 'cuisine' && styles.activeText,
          ]}>
          Cuisine
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, activeSort === 'date' && styles.activeButton]}
        onPress={() => onSort('date')}>
        <SvgXml xml={Calender} width={wp('4%')} height={wp('4%')} />
        <Text
          style={[styles.text, activeSort === 'date' && styles.activeText]}>
          Date
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: hp('2%'),
    gap: wp('2%'),
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('5%'),
    elevation: 2,
    borderWidth: 1,
    borderColor: '#eee',
  },
  activeButton: {
    borderColor: Colors.primaryOrange,
    backgroundColor: Colors.lightRed,
  },
  text: {
    marginLeft: wp('1.5%'),
    fontSize: hp('1.8%'),
    color: '#000',
  },
  activeText: {
    color: Colors.primaryOrange,
    fontWeight: '600',
  },
});

export default SortButtons;
