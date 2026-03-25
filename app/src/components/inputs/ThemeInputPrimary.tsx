
import React from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";
import { Colors } from "assets/styles/colors";
import Fonts from "assets/styles/fonts";

export default function ThemeInputPrimary({
  value,
  onChangeText,
  placeholder,
  error,
  multiline = false,   
  numberOfLines = 1,
  ...props
}: any) {
  return (
    <View style={{ marginBottom: 12 }}>
      <TextInput
        style={[
          styles.input,
          multiline && styles.textarea, 
          error ? { borderColor: Colors.red } : null,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.bodyText}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? "top" : "center"} 
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor:Colors.lightRed,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 16,
    fontSize: 16,
    backgroundColor:Colors.white,
    color:Colors.black,
    fontFamily:Fonts.OpenSans.semiBold
  },
  textarea: {
    height: '100%', 
    paddingTop: 10,
  },
  errorText: {
    color: Colors.red,
    fontSize: 12,
    marginTop: 4,
  },
});
