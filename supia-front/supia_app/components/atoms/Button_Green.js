import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';

const Button_Green = ({ label }) => {
   const handlePress = () => {
       Alert.alert(`${label} clicked!`);
     };
  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
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
    backgroundColor: '#A2AA7B',
    paddingBottom: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Button_Green;
