import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';

interface CustomInputProps {
  placeholder: string;
  iconXml: string; 
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  secureTextEntry?: boolean;
}

const IconInput: React.FC<CustomInputProps> = ({ placeholder, iconXml, value, onChangeText }) => {
  return (
    <View style={styles.inputContainer}>
      <SvgXml xml={iconXml} width="20" height="20" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#A5A5A5"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#000',
  },
});

export default IconInput;
