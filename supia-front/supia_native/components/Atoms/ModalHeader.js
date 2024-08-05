import React from 'react';
import {StyleSheet, View, Text, Pressable} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

export default function ModalHeader({UserName, onClose, page}) {
  return (
    <View>
      <View style={styles.Header}>
        <View style={styles.iconContainer}>
          <Feather name="user" size={24} color="#A2AA7B" />
        </View>
        <Text style={styles.typography}>{UserName}</Text>
        <Pressable onPress={onClose}>
          <EvilIcons name="close" size={24} color="#A2AA7B" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: '#fff',
  },
  Header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginLeft: 35
  },
  typography: {
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: '400',
  },
});
