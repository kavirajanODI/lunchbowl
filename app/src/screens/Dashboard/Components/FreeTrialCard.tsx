import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Colors} from 'assets/styles/colors';
import PrimaryButton from 'components/buttons/PrimaryButton';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useAuth} from 'context/AuthContext';
import {useUserProfile} from 'context/UserDataContext';
import FreeTrialModal from './FreeTrialModal';

const FreeTrialCard: React.FC = () => {
  const navigation = useNavigation<any>();
  const {isLoggedIn, user, userId} = useAuth();
  const {profileData} = useUserProfile();
  const [modalVisible, setModalVisible] = useState(false);

  // Hide if user has already availed trial meal OR has an active/any subscription
  const hasAvailedTrial = user?.freeTrial === true;
  const hasSubscription = !!(profileData?.subscriptionPlan);

  if (hasAvailedTrial || hasSubscription) {
    return null;
  }

  function handleTrialMealPress(): void {
    if (isLoggedIn && userId) {
      navigation.navigate('TrialMealScreen');
    } else {
      setModalVisible(true);
    }
  }

  return (
    <View style={styles.card}>
      <Text style={styles.desc}>
        Delicious and nutritious food that meets the dietary needs of growing
        children.
      </Text>
      <PrimaryButton
        title="Get Trial Meal"
        onPress={handleTrialMealPress}
        style={{width: '100%'}}
      />
      <FreeTrialModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        navigation={navigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: wp('4%'),
    backgroundColor: Colors.lightRed,
    borderRadius: wp('3%'),
    borderRightWidth: wp('1%'),
    borderBottomWidth: wp('1%'),
    borderTopWidth: wp('0.1%'),
    borderLeftWidth: wp('0.1%'),
    borderColor: Colors.primaryOrange,
    width: '100%',
    alignSelf: 'center',
  },
  desc: {
    marginVertical: hp('1%'),
    fontSize: wp('4%'),
    color: Colors.default,
    marginBottom: hp('2%'),
    fontFamily: 'Urbanist-Regular',
  },
});

export default FreeTrialCard;
