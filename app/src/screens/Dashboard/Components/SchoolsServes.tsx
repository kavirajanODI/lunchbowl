import PrimaryButton from 'components/buttons/PrimaryButton';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const schoolData = [
  {
    id: 1,
    name: 'ABC School',
    icon: require('../../../assets/images/Dashboard/Schools/1.png'),
  },
  {
    id: 2,
    name: 'XYZ Academy',
    icon: require('../../../assets/images/Dashboard/Schools/2.png'),
  },
  {
    id: 3,
    name: 'Green Valley',
    icon: require('../../../assets/images/Dashboard/Schools/3.png'),
  },
  {
    id: 4,
    name: 'Bright Future',
    icon: require('../../../assets/images/Dashboard/Schools/4.png'),
  },
  {
    id: 5,
    name: 'Global Kids',
    icon: require('../../../assets/images/Dashboard/Schools/4.png'),
  },
];

const SchoolMarquee = () => {
  const handleSchoolPress = (school: any) => {
    console.log('Pressed:', school.name);
  };

  function RequestSchool(): void {
    throw new Error('Function not implemented.');
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        {schoolData.map((school) => (
          <TouchableOpacity
            key={school.id}
            style={styles.card}
            onPress={() => handleSchoolPress(school)}>
            <Image source={school.icon} style={styles.icon} />
            <Text style={styles.name} numberOfLines={1}>
              {school.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.missingText}>
        Missing your school? Add it to our list with one tap!
      </Text>

      <PrimaryButton
        title="Request Your school"
        onPress={RequestSchool}
        textColor="#FFFFFF"
        style={{ width: '100%' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: wp('6%'),
    shadowColor: '#000000',
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  scrollContainer: {
    flexDirection: 'row',
    gap: wp('4%'),
    marginBottom: hp('1.5%'),
  },
  card: {
    width: wp('20%'),
    alignItems: 'center',
  },
  icon: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('2%'),
    marginBottom: hp('0.5%'),
    backgroundColor: '#ffffff',
  },
  name: {
    fontSize: wp('3.3%'),
    textAlign: 'center',
    color: '#222222',
    fontFamily: 'Urbanist-Bold'
  },
  missingText: {
    fontSize: wp('3.2%'),
    fontFamily: 'OpenSans-Medium',
    color: '#67686A',
    textAlign: 'center',
    marginVertical: hp('1%'),
  },
});

export default SchoolMarquee;
