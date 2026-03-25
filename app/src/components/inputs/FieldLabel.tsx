import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

interface FieldLabelProps {
  label: string;
  required?: boolean;
  helperText?: string;
}

const PrimaryFieldLabel: React.FC<FieldLabelProps> = ({
  label,
  required,
  helperText,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      {helperText && <Text style={styles.helper}> {helperText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical:10,
    marginLeft:10
  },
  label: {
    fontSize: 18,
    color: Colors.black,
    fontFamily: Fonts.Urbanist.semiBold,
  },
  required: {
    color: 'red',
    fontWeight: 'bold',
  },
  helper: {
    fontSize: 12,
    color: Colors.bodyText,
    marginLeft: 4,
  },
});

export default PrimaryFieldLabel;
