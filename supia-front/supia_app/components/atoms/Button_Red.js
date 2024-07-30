import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button_Red = ({ label, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 72,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 5,
    backgroundColor: '#C28C7E',
    paddingBottom: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Button_Red;
