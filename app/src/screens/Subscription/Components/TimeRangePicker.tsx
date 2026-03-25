// import React, {useState} from 'react';
// import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
// import {format} from 'date-fns';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import {Colors} from 'assets/styles/colors';
// import PrimaryFieldLabel from 'components/inputs/FieldLabel';

// type Props = {
//   startTime: string;
//   endTime: string;
//   onChange: (field: string, value: string) => void;
// };

// export default function TimeRangePicker({startTime, endTime, onChange}: Props) {
//   const [pickerVisible, setPickerVisible] = useState(false);
//   const [currentField, setCurrentField] = useState<'startTime' | 'endTime'>(
//     'startTime',
//   );

//   const handleConfirm = (date: Date) => {
//     const formatted = format(date, 'hh:mm a');
//     onChange(currentField, formatted);
//     setPickerVisible(false);
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.timeBox}>
//         <PrimaryFieldLabel label="Lunch Start Time" required />
//         <TouchableOpacity
//           style={styles.PickerPlaceholder}
//           onPress={() => {
//             setCurrentField('startTime');
//             setPickerVisible(true);
//           }}>
//           <Text style={styles.placeholderText}>
//             {startTime || 'Select Start Time'}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.timeBox}>
//         <PrimaryFieldLabel label=" Lunch End Time" required />
//         <TouchableOpacity
//           style={styles.PickerPlaceholder}
//           onPress={() => {
//             setCurrentField('endTime');
//             setPickerVisible(true);
//           }}>
//           <Text style={styles.placeholderText}>
//             {endTime || 'Select End Time'}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <DateTimePickerModal
//         isVisible={pickerVisible}
//         mode="time"
//         onConfirm={handleConfirm}
//         onCancel={() => setPickerVisible(false)}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   timeBox: {
//     flex: 1,
//     marginTop: hp('1%'),
//   },
//   PickerPlaceholder: {
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingVertical: hp('2.0%'),
//     paddingHorizontal: wp('3%'),
//     borderColor: Colors.Storke,
//     backgroundColor: Colors.white,
//     marginTop: 5,
//   },
//   placeholderText: {
//     fontSize: 14,
//     color: Colors.black,
//   },
// });

//     {/* <TimeRangePicker
//               startTime={child.startTime}
//               endTime={child.endTime}
//               onChange={(field, val) => handleChildChange(index, field, val)}
//             /> */}
