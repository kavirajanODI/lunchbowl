import React, { useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

type OtpInputProps = {
  code: string;
  setCode: (value: string) => void;
  length?: number;
};

const OtpInput = ({ code, setCode, length = 4 }: OtpInputProps) => {
  const inputs = Array.from({ length });
  const inputRefs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    const newCode = code.split('');
    if (text) {
      newCode[index] = text[text.length - 1]; // only keep last typed digit
      setCode(newCode.join(''));
      if (index < length - 1) inputRefs.current[index + 1].focus();
    } else {
      newCode[index] = '';
      setCode(newCode.join(''));
      if (index > 0) inputRefs.current[index - 1].focus();
    }
  };

  return (
    <View style={styles.container}>
      {inputs.map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref!)}
          style={styles.input}
          keyboardType="number-pad"
          maxLength={1}
          value={code[index] || ''}
          onChangeText={(text) => handleChange(text, index)}
          returnKeyType="done"
        />
      ))}
    </View>
  );
};

export default OtpInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    width: 50,
    height: 50,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
  },
});
