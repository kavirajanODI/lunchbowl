// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   ScrollView,
// } from 'react-native';
// import {ThemeInputStyleThree} from '../../../components/Input/Input';
// import {GradientButton} from '../../../components/Button/Button';
// import {LoadingModal} from '../../../components/LoadingModal/LoadingModal';
// import {validateEmail} from '../../../utils/validators';
// import GradientText from 'components/Text/GradientText';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import ForgetPasswordService from 'services/apiService/forgetPasswordApiService';
// import {ApiResponseModel} from 'src/models/apiResponseModel';

// interface Props {
//   navigation: any;
// }

// const ForgotEmailFormScreen: React.FC<Props> = ({navigation}) => {
//   // ---------------------------------------------------------State Variables ---------------------------------------------------------
//   const [email, setEmail] = useState('');
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (error) {
//       const timer = setTimeout(() => setError(null), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [error]);

//   // ---------------------------------------------- Functions Send otp to email ----------------------------------------------------
//   const handleSendOTP = async () => {
//     if (email) {
//       setLoading(true);
//       try {
//         validateEmail(email);
//         const response: ApiResponseModel =
//           await ForgetPasswordService.sendResetOTP(email);
//         if (response.success) {
//           navigation.navigate('EnterOTPScreen', {email});
//           setLoading(false);
//         } else {
//           setError('Error sending OTP');
//         }
//       } catch (err) {
//         setError(
//           err instanceof Error ? err.message : 'An unknown error occurred',
//         );
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       setError('Please enter a valid email address.');
//     }
//   };

//   return (
//     <ScrollView
//       contentContainerStyle={styles.mainScrollContainer}
//       keyboardShouldPersistTaps="handled">
//       <View style={styles.mainContainer}>
//         <Image source={require('assets/images/logo.png')} style={styles.logo} />
//         {/* -------------------------------------------- Header container  ------------------------------------------- */}
//         <View style={styles.headerContainer}>
//           {/* -------------------------------------------- Linear text ------------------------------------------- */}

//           <View style={styles.linearText}>
//             <GradientText text="Forgot Your Password?" fontSize={30} />
//           </View>
//           {/* -------------------------------------------- Description ------------------------------------------- */}
//           <Text style={styles.description}>
//             Enter the email address associated with your Intellectlvy account.
//             We’ll send you a one-time password (OTP) to reset your password.
//           </Text>
//         </View>
//         {error && (
//           <View style={styles.errorContainer}>
//             <Text style={styles.errorText}>{error}</Text>
//           </View>
//         )}
//         {/* -------------------------------------------- Input ------------------------------------------- */}

//         <View style={styles.inputContainer}>
//           <ThemeInputStyleThree
//             placeholder="Your Registered Email"
//             value={email}
//             onChangeText={setEmail}
//           />
//         </View>
//         {/* -------------------------------------------- Save changes Button ------------------------------------------- */}

//         <GradientButton
//           title="Send OTP Code"
//           onPress={handleSendOTP}
//           style={styles.button}
//         />

//         {/* -------------------------------------------- Footer ------------------------------------------- */}

//         <View style={styles.footer}>
//           <View style={styles.footerRow}>
//             <Text style={styles.footerText}>Don’t have an Account?</Text>
//             <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
//               <Text style={styles.createAccountLink}>Create Account</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//         <LoadingModal loading={loading} setLoading={setLoading} />
//       </View>
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
//   header: {
//     fontSize: wp('8%'),
//     fontWeight: '800',
//     color: '#DB2533',
//     textAlign: 'left',
//     marginBottom: hp('2%'),
//   },
//   linearText: {
//     marginBottom: hp('1%'),
//   },

//   description: {
//     fontSize: wp('3.5%'),
//     color: '#000',
//     textAlign: 'left',
//     fontWeight: '500',
//     marginBottom: hp('2%'),
//     lineHeight: hp('2.5%'),
//   },
//   inputContainer: {
//     gap: hp('2%'),
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

//   button: {
//     height: hp('6.50%'),
//     justifyContent: 'center',
//     marginTop: hp('2%'),
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

// export default ForgotEmailFormScreen;
