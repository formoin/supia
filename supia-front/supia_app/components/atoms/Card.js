import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function Card() {
  return (
    <View style={styles.container}></View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '30%',
    height: 150,
    borderRadius: 10, // border-radius: 10px;
    borderWidth: 1, 
    margin: 5
  }
});

