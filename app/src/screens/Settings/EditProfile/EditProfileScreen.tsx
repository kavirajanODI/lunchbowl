import React, {useEffect, useState} from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';

import PrimaryButton from 'components/buttons/PrimaryButton';
import IconInput from 'components/inputs/IconInput';
import {LoadingModal} from 'components/LoadingModal/LoadingModal';
import {useAuth} from 'context/AuthContext';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SvgXml} from 'react-native-svg';
import HeaderBackButton from 'screens/Dashboard/Components/BackButton';
import UserService from 'services/userService';
import {ApiResponseModel} from 'src/model/apiResponseModel';
import {UserInterface} from 'src/model/userSchema';
import {camaraIcon} from 'styles/svg-icons';
import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import {Colors} from 'assets/styles/colors';

const EditProfileScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const {user, userId, userRole} = useAuth();
  console.log(userId);
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      if (userId) {
        const userResponse: ApiResponseModel =
          await UserService.getRegisteredUSerData(userId);
        if (userResponse.success && userResponse.data) {
          const userData: UserInterface = userResponse.data;
          console.log('userData', userData);
          setImageUri(userData.profile?.profile_image_url || undefined);
          setFirstName(userData.profile?.firstname || '');
          setLastName(userData.profile?.lastname || '');
          setEmail(userData.email || '');
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) {
      newErrors.firstName = 'First Name is required.';
    }
    if (!lastName.trim()) {
      newErrors.lastName = 'Last Name is required.';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      newErrors.email = 'Invalid email format.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const selectImageFromGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
      },
      response => {
        if (response.assets && response.assets.length > 0) {
          setImageUri(response.assets[0].uri);
        }
      },
    );
  };

  const saveProfile = async () => {
    setLoading(true);
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    try {
      const userDetails: any = {
        userDetails: {
          'profile.firstname': firstName,
          'profile.lastname': lastName,
          'profile.profile_image_url': imageUri,
        },
      };

      if (userDetails && userId) {
        const response = await UserService.updateUserDetails(
          userId,
          userDetails,
        );
        if (response.data.success) {
          setMessage('Your profile has been successfully updated.');
        } else {
          setMessage(response.data.error || 'Failed to update profile');
        }
      } else {
        return;
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingModal loading={true} setLoading={setLoading} />;
  }

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ThemeGradientBackground>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.mainScrollContainer}
            keyboardShouldPersistTaps="handled">
            <View style={styles.mainContainer}>
              <HeaderBackButton title="Edit Profile" />

              <View style={styles.profileImageContainer}>
                <Image
                  source={
                    imageUri
                      ? {uri: imageUri}
                      : require('assets/images/Settings/UserDefault.png')
                  }
                  style={styles.profileImage}
                />
                <TouchableOpacity
                  style={styles.cameraIcon}
                  onPress={selectImageFromGallery}>
                  <SvgXml xml={camaraIcon} width={30} height={30} />
                </TouchableOpacity>
              </View>
              <View style={styles.mainContainer}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>First Name</Text>
                  <IconInput
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                    iconXml={''}
                  />
                  {errors.firstName && (
                    <Text style={styles.errorText}>{errors.firstName}</Text>
                  )}

                  <Text style={styles.label}>Last Name</Text>
                  <IconInput
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                    iconXml={''}
                  />
                  {errors.lastName && (
                    <Text style={styles.errorText}>{errors.lastName}</Text>
                  )}

                  <Text style={styles.label}>Email</Text>
                  <IconInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    iconXml={''}
                  />
                  {errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}

                  <View style={styles.ButtonContainer}>
                    <PrimaryButton
                      title="Save Changes"
                      onPress={saveProfile}
                      style={styles.profileUpdateButton}
                    />
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </ThemeGradientBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainScrollContainer: {
    flexGrow: 1,
  },
  mainContainer: {
    padding: wp('3%'),
  },
  profileImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  profileImage: {
    width: wp('40%'),
    height: wp('40%'),
    borderRadius: wp('20%'),
  },
  cameraIcon: {
    position: 'absolute',
    bottom: hp('-1%'),
    right: wp('21%'),
    width: wp('15%'),
    height: wp('10%'),
  },
  inputContainer: {
    marginBottom: hp('2%'),
    gap: hp('0.5%'),
  },
  label: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: hp('1%'),
  },
  errorText: {
    color: 'red',
    fontSize: wp('3.5%'),
    marginTop: hp('0.5%'),
  },
  ButtonContainer: {
    marginTop: hp('2%'),
    height: hp('6%'),
  },
  profileUpdateButton: {
    width: wp('90%'),
  },
});

export default EditProfileScreen;
