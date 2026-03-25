
import React, {useState, useMemo, useEffect} from 'react';
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
import ConfigService from 'services/ConfigService/ChildAge';

type Props = {
  value?: string;
  onChange: (date: string) => void;
  error?: string;
};

export default function DateOfBirthInput({value, onChange, error}: Props) {
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState<Date | null>(null);

  const [minAge, setMinAge] = useState<number>(3);
  const [maxAge, setMaxAge] = useState<number>(18);

  // fetch age limits from API
  const getAgeLimits = async () => {
    try {
      const response: any = await ConfigService.GetChildAges();
      if (response && response.data) {
        setMinAge(response.data.minAge);
        setMaxAge(response.data.maxAge);
      } else {
        console.error('Invalid data format', response);
      }
    } catch (error) {
      console.error('Error fetching age limits:', error);
    }
  };

  useEffect(() => {
    getAgeLimits();
  }, []);

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

      if (years < minAge) {
        Alert.alert('Invalid Date', `Child must be at least ${minAge} years old.`);
        return;
      }
      if (years > maxAge) {
        Alert.alert('Invalid Date', `Child age cannot be more than ${maxAge} years.`);
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
