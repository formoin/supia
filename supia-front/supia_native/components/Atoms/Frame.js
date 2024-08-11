import React from 'react';
import { StyleSheet, View } from 'react-native';

const Frame = ({ children }) => {
  return (
    <View style={styles.rectangle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  rectangle: {
    width: 158,
    height: 214.044,
    flexShrink: 0,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A2AA7B',
    opacity: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default Frame;
