// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   TouchableWithoutFeedback,
//   Keyboard,
// } from 'react-native';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';

// import {
//   GradientButton,
//   GradientButtonSecondary,
// } from 'components/Button/Button';
// import {LoadingModal} from 'components/LoadingModal/LoadingModal';
// import GradientText from 'components/Text/GradientText';
// import {ApiResponseModel} from 'src/models/apiResponseModel';
// import ForgetPasswordService from 'services/apiService/forgetPasswordApiService';

// interface EnterOTPScreenProps {
//   navigation: any;
//   route: any;
// }

// const EnterOTPScreen: React.FC<EnterOTPScreenProps> = ({route, navigation}) => {
//   // {/* -------------------------------------------- State variables   ------------------------------------------- */}

//   const {email} = route.params;
//   const [token, setOtp] = useState<string[]>(['', '', '', '']);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const handleOTPSubmit = (index: number, text: string) => {
//     const newOtp = [...token];
//     newOtp[index] = text;
//     setOtp(newOtp);
//   };

//   const handleVerifyOTP = async () => {
//     setLoading(true);
//     try {
//       const response: ApiResponseModel =
//         await ForgetPasswordService.verifyPasswordResetOTP(
//           token.join(''),
//           email,
//         );
//       console.log('API Response:', response);

//       if (response.success) {
//         navigation.navigate('NewPasswordScreen', {
//           token: token.join(''),
//           email,
//         });
//       } else {
//         setError('Invalid OTP');
//       }
//     } catch (error) {
//       console.error('Error verifying OTP:', error);
//       setError('Invalid OTP');
//     } finally {
//       setLoading(false);
//     }
//   };
//   // {/* -------------------------------------------- functions   ------------------------------------------- */}

//   const resendOTP = async () => {
//     setLoading(true);
//     try {
//       const response: ApiResponseModel =
//         await ForgetPasswordService.sendResetOTP(email);
//       console.log('Resend OTP Response:', response);

//       if (response.success) {
//         setError(null);
//       } else {
//         setError('Failed to resend OTP. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error resending OTP:', error);
//       setError('Failed to resend OTP. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={{flex: 1}}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
//       <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
//         <ScrollView
//           contentContainerStyle={styles.mainScrollContainer}
//           keyboardShouldPersistTaps="handled">
//           {/* -------------------------------------------- Main contentainer ------------------------------------------- */}

//           <View style={styles.mainContainer}>
//             <Image
//               source={require('assets/images/logo.png')}
//               style={styles.logo}
//             />

//             <View style={styles.headerContainer}>
//               {/* -------------------------------------------- Linear text ------------------------------------------- */}

//               <View style={styles.linearText}>
//                 <GradientText text="Enter OTP Code" fontSize={30} />
//               </View>
//             </View>
//             {/* -------------------------------------------- Description ------------------------------------------- */}
//             <Text style={styles.description}>
//               Check you email inbox for a message from Intellectlvy. Enter the
//               one-time password (OTP) you received below to continue resetting
//               your password.
//             </Text>

//             {error && (
//               <View style={styles.errorContainer}>
//                 <Text style={styles.errorText}>{error}</Text>
//               </View>
//             )}
//             {/* -------------------------------------------- Otp input ------------------------------------------- */}

//             {/* OTP Input Box */}
//             <View style={styles.otpContainer}>
//               {token.map((digit, index) => (
//                 <TextInput
//                   key={index}
//                   style={styles.otpInput}
//                   keyboardType="numeric"
//                   maxLength={1}
//                   value={digit}
//                   onChangeText={text => handleOTPSubmit(index, text)}
//                   textAlign="center"
//                 />
//               ))}
//             </View>

//             <View style={styles.buttonContainer}>
//               <GradientButton
//                 title="Continue"
//                 onPress={handleVerifyOTP}
//                 style={{height: hp('6%'), justifyContent: 'center'}}
//               />

//               <GradientButtonSecondary
//                 title="Resend OTP"
//                 onPress={resendOTP}
//                 style={{height: hp('6%'), justifyContent: 'center'}}
//               />
//             </View>
//             {/* -------------------------------------------- Footer ------------------------------------------- */}

//             <View style={styles.footer}>
//               <View style={styles.footerRow}>
//                 <Text style={styles.footerText}>Don’t have an Account?</Text>
//                 <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
//                   <Text style={styles.createAccountLink}>Create Account</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>

//             <LoadingModal loading={loading} setLoading={setLoading} />
//           </View>
//         </ScrollView>
//       </TouchableWithoutFeedback>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   mainScrollContainer: {
//     flexGrow: 1,
//     backgroundColor: '#fff',
//   },
//   mainContainer: {
//     paddingHorizontal: wp('5%'),
//     justifyContent: 'space-between',
//   },
//   headerContainer: {
//     justifyContent: 'center',
//     textAlign: 'center',
//     paddingHorizontal: wp('16.5%'),
//   },
//   logo: {
//     width: wp('23%'),
//     height: hp('13%'),
//     alignSelf: 'center',
//     marginTop: hp('5%'),
//   },
//   header: {
//     fontSize: wp('8%'),
//     fontWeight: '800',
//     color: '#DB2533',
//     textAlign: 'center',
//     marginBottom: hp('2%'),
//   },
//   linearText: {
//     marginBottom: hp('1%'),
//   },

//   description: {
//     fontSize: wp('3.8%'),
//     color: '#000',
//     textAlign: 'left',
//     fontWeight: '500',
//     marginBottom: hp('2%'),
//     lineHeight: hp('2.5%'),
//     paddingHorizontal: wp('2.5%'),
//   },
//   errorContainer: {
//     backgroundColor: '#f8d7da',
//     padding: wp('2.5%'),
//     borderRadius: wp('2%'),
//     marginBottom: hp('1%'),
//     alignItems: 'center',
//   },
//   errorText: {
//     color: '#721c24',
//     fontSize: wp('3.5%'),
//     textAlign: 'center',
//   },

//   otpContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: hp('3%'),
//     width: '93%',
//   },
//   otpInput: {
//     width: wp('17%'),
//     height: hp('6 %'),
//     borderWidth: 2,
//     borderColor: '#7C2D7E',
//     borderRadius: 30,
//     fontSize: wp('5%'),
//     textAlign: 'center',
//     marginHorizontal: wp('2%'),
//   },
//   text: {
//     fontSize: wp('3%'),
//     color: '#000000',
//     fontWeight: '400',
//     fontFamily: 'Poppins',
//     textAlign: 'center',
//     position: 'absolute',
//     bottom: hp('10%'),
//     left: 0,
//     right: 0,
//   },
//   buttonContainer: {
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: hp('2%'),
//   },

//   footer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: hp('30%'),
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

// export default EnterOTPScreen;
