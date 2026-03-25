import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {questionIcon} from 'styles/svg-icons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

interface Option {
  icon: string;
  label: string;
  key: string; 
}

interface Props {
  onSort: (key: string) => void;
}

const options: Option[] = [
  {icon: questionIcon, label: 'Child Name', key: 'name'},
  {icon: questionIcon, label: 'Status', key: 'status'},
  {icon: questionIcon, label: 'Date', key: 'date'},
];

const SortButtons: React.FC<Props> = ({onSort}) => {
  return (
    <View style={styles.container}>
      {options.map((item, index) => (
        <TouchableOpacity
          style={styles.button}
          key={index}
          onPress={() => onSort(item.key)}>
          <SvgXml xml={item.icon} width={wp('5%')} height={wp('5%')} />
          <Text style={styles.text}>{item.label}</Text>
        </TouchableOpacity>
      ))}
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
    borderRadius: wp('2%'),
    elevation: 2,
  },
  text: {
    marginLeft: wp('2%'),
    fontSize: hp('1.8%'),
    color: '#000',
  },
});

export default SortButtons;
