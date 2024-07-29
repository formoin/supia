import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

const Line = () => {
  return (
      <View style={styles.line} />
  );
};

const styles = StyleSheet.create({
  line: {
    width: 350,
    height: 1,
    transform: [{ rotate: '0.177deg' }],
    borderWidth: 1,
    borderColor: '#A2AA7B',
    opacity: 1,
  },
});

export default Line;
