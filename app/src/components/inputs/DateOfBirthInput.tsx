
import React, {useState, useMemo} from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Colors} from 'assets/styles/colors';

const MIN_AGE = 3;
const MAX_AGE = 18;

type Props = {
  value?: string;
  onChange: (date: string) => void;
  error?: string;
};

export default function DateOfBirthInput({value, onChange, error}: Props) {
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState<Date | null>(null);

  const age = useMemo(() => {
    if (!date) return null;
    const today = new Date();
    let years = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
      years--;
    }
    return years;
  }, [date]);

  const formatDate = (d: Date) => {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleChange = (_: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      const today = new Date();
      let years = today.getFullYear() - selectedDate.getFullYear();
      const m = today.getMonth() - selectedDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < selectedDate.getDate())) {
        years--;
      }

      if (years < MIN_AGE) {
        Alert.alert('Invalid Date', `Child must be at least ${MIN_AGE} years old.`);
        return;
      }
      if (years > MAX_AGE) {
        Alert.alert('Invalid Date', `Child age cannot be more than ${MAX_AGE} years.`);
        return;
      }

      setDate(selectedDate);
      const formatted = formatDate(selectedDate);
      onChange(formatted);
    }
  };

  return (
    <View style={{marginBottom: 15}}>
      <TouchableOpacity
        style={[styles.input, error ? {borderColor: Colors.red} : null]}
        onPress={() => setShowPicker(true)}>
        <Text style={{color: value ? Colors.bodyText : Colors.black}}>
          {value ? `${value} (Age ${age ?? '00'})` : 'DD/MM/YYYY (Age 00)'}
        </Text>
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      {showPicker && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          maximumDate={new Date()} 
          onChange={handleChange}
          
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: Colors.lightRed,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 18,
    fontSize: 14,
    color:Colors.black,
    backgroundColor: Colors.white,
  },
  error: {
    color: Colors.red,
    fontSize: 12,
    marginTop: 4,
  },
});
