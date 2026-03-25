import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import React from 'react';
import {View, Text, TextInput, StyleSheet, TextInputProps} from 'react-native';

interface TextAreaProps extends TextInputProps {
  label?: string;
  error?: string;
}

const PrimaryTextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  style,
  ...props
}) => {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TextInput
        {...props}
        style={[styles.textArea, style]}
        multiline
        numberOfLines={4}
        placeholderTextColor={Colors.bodyText}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: Colors.Storke,
  },
  textArea: {
    borderWidth: 1,
    borderColor: Colors.lightRed,
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
    fontSize: 16,
    color: Colors.black,
    fontFamily:Fonts.OpenSans.regular
    
  },
  error: {
    fontSize: 12,
    color: Colors.red,
    marginTop: 4,
  },
});

export default PrimaryTextArea;
