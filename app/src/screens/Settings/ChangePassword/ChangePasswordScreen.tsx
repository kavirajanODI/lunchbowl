import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import PrimaryButton from 'components/buttons/PrimaryButton';
import ErrorMessage from 'components/Error/BoostrapStyleError';
import ThemeInputPrimary from 'components/inputs/ThemeInputPrimary';
import {LoadingModal} from 'components/LoadingModal/LoadingModal';
import {useAuth} from 'context/AuthContext';
import React, {useState} from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import HeaderBackButton from 'screens/Dashboard/Components/BackButton';
import UserService from 'services/userService';

const ChangePasswordScreen = ({navigation}: any) => {
  const {userId} = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }
    if (!userId) {
      setError('User session expired. Please log in again.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response: any = await UserService.updatePassword(userId, {
        currentPassword,
        newPassword,
      });
      if (response?.success) {
        Alert.alert('Success', 'Password changed successfully.', [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
      } else {
        setError(response?.message || 'Failed to change password.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeGradientBackground>
      <LoadingModal loading={loading} setLoading={setLoading} />
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{flexGrow: 1}}
            keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
              <HeaderBackButton title="Change Password" />

              {error && (
                <ErrorMessage error={error} onClose={() => setError(null)} />
              )}

              <View style={styles.form}>
                <Text style={styles.label}>Current Password</Text>
                <ThemeInputPrimary
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Enter current password"
                  secureTextEntry
                />

                <Text style={styles.label}>New Password</Text>
                <ThemeInputPrimary
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password (min 6 chars)"
                  secureTextEntry
                />

                <Text style={styles.label}>Confirm New Password</Text>
                <ThemeInputPrimary
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Re-enter new password"
                  secureTextEntry
                />

                <PrimaryButton
                  title="Change Password"
                  onPress={handleChangePassword}
                  style={styles.button}
                />
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ThemeGradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp('6%'),
    paddingBottom: hp('10%'),
  },
  form: {
    marginTop: hp('2%'),
    gap: hp('1.5%'),
  },
  label: {
    fontSize: wp('4%'),
    color: Colors.black,
    fontFamily: Fonts.Urbanist.semiBold,
    marginBottom: hp('0.5%'),
  },
  button: {
    marginTop: hp('2%'),
    height: hp('6%'),
    justifyContent: 'center',
  },
});

export default ChangePasswordScreen;
