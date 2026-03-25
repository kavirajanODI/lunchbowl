// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   ScrollView,
//   TouchableOpacity,
// } from 'react-native';
// import {PasswordInput} from '../../../components/Input/Input';
// import {GradientButton} from '../../../components/Button/Button';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import GradientText from 'components/Text/GradientText';
// import BottomSuccessModal from 'components/Modal/BottomSuccessModal';
// import ErrorModal from 'components/Modal/ErorrModal';
// import {LoadingModal} from 'components/LoadingModal/LoadingModal';
// import ForgetPasswordService from 'services/apiService/forgetPasswordApiService';
// import {ApiResponseModel} from 'src/models/apiResponseModel';

// interface NewPasswordScreenProps {
//   navigation: any;
//   route: any;
// }

// const NewPasswordScreen: React.FC<NewPasswordScreenProps> = ({
//   route,
//   navigation,
// }) => {
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const {token, email} = route.params || {token: null, email: null};

//   const [message, setMessage] = useState<string>('');
//   const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
//   const [isErrorModalVisible, setErrorModalVisible] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handlePasswordReset = async () => {
//     if (!newPassword || !confirmPassword) {
//       setMessage('Please fill in all fields.');
//       setErrorModalVisible(true);
//       return;
//     }

//     if (newPassword.length < 6) {
//       setMessage('Password must be at least 6 characters long.');
//       setErrorModalVisible(true);
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const response: ApiResponseModel =
//         await ForgetPasswordService.updateNewPassword(
//           email,
//           token,
//           newPassword,
//         );
//       if (response.success) {
//         setMessage('Your password has been updated successfully.');
//         setSuccessModalVisible(true);
//       } else {
//         setMessage('An error occurred. Please try again.');
//         setErrorModalVisible(true);
//       }
//     } catch (error) {
//       setMessage('An error occurred. Please try again.');
//       setErrorModalVisible(true);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCloseModal = () => {
//     setSuccessModalVisible(false);
//     setErrorModalVisible(false);
//     navigation.navigate('Dashboard');
//   };

//   const handleCloseErorrModal = () => {
//     setSuccessModalVisible(false);
//     setErrorModalVisible(false);
//   };

//   return (
//     <ScrollView
//       contentContainerStyle={styles.mainScrollContainer}
//       keyboardShouldPersistTaps="handled">
//       <View style={styles.mainContainer}>
//         <Image source={require('assets/images/logo.png')} style={styles.logo} />
//         {/* --------------------------------------------  main  container ------------------------------------------- */}

//         <View style={styles.headerContainer}>
//           <View style={styles.linearText}>
//             <GradientText text="Secure Your Account" fontSize={wp('7.5%')} />
//           </View>
//           <Text style={styles.description}>
//             Enter a new password for your Intellectlvy account below. Make sure
//             it’s secure and easy to remember.
//           </Text>
//         </View>
//         {/* --------------------------------------------  Input  container ------------------------------------------- */}

//         <View style={styles.inputContainer}>
//           <PasswordInput
//             value={newPassword}
//             onChangeText={setNewPassword}
//             placeholder="New Password"
//           />
//           {/* --------------------------------------------  Confirm pasword ------------------------------------------- */}

//           <PasswordInput
//             value={confirmPassword}
//             onChangeText={setConfirmPassword}
//             placeholder="Confirm New Password"
//           />
//           {/* -------------------------------------------- Save button ------------------------------------------- */}

//           <GradientButton
//             title={isLoading ? 'Updating...' : 'Save New Password'}
//             onPress={handlePasswordReset}
//             style={styles.button}
//           />

//           {/* -------------------------------------------- Footer ------------------------------------------- */}

//           <View style={styles.footer}>
//             <View style={styles.footerRow}>
//               <Text style={styles.footerText}>Don’t have an Account?</Text>
//               <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
//                 <Text style={styles.createAccountLink}>Create Account</Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* -------------------------------------------- Modals ------------------------------------------- */}

//           <BottomSuccessModal
//             visible={isSuccessModalVisible}
//             heading={'You’re All Set!'}
//             message={message}
//             onConfirm={handleCloseModal}
//             buttonText={'Go to Homepage'}
//           />
//           <ErrorModal
//             visible={isErrorModalVisible}
//             errorMessage={message}
//             onClose={handleCloseErorrModal}
//             buttonText={'Close'}
//           />
//         </View>
//       </View>
//       <LoadingModal loading={loading} setLoading={setLoading} />
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   mainScrollContainer: {
//     flexGrow: 1,
//     backgroundColor: '#fff',
//   },
//   mainContainer: {
//     paddingHorizontal: wp('5%'),
//     paddingBottom: hp('5%'),
//     justifyContent: 'center',
//   },
//   headerContainer: {
//     justifyContent: 'center',
//     textAlign: 'center',
//     paddingHorizontal: wp('4.5%'),
//     backgroundColor: '#fff',
//   },
//   logo: {
//     width: wp('23%'),
//     height: hp('13%'),
//     alignSelf: 'center',
//     marginTop: hp('5%'),
//   },
//   linearText: {
//     marginBottom: hp('1%'),
//   },
//   description: {
//     fontSize: wp('3.9%'),
//     color: '#000',
//     textAlign: 'left',
//     fontWeight: '500',
//     marginBottom: hp('5%'),
//     lineHeight: hp('2.5%'),
//   },
//   inputContainer: {
//     gap: hp('2%'),
//   },
//   button: {
//     height: hp('6.5%'),
//     justifyContent: 'center',
//   },

//   footer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: hp('40%'),
//   },
//   footerRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   footerText: {
//     fontSize: wp('3%'),
//     color: '#000',
//   },
//   createAccountLink: {
//     fontSize: wp('3%'),
//     color: '#AB2959',
//     fontWeight: '500',
//     marginLeft: wp('1%'),
//   },
// });

// export default NewPasswordScreen;
