import React, {useState} from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Card({representativeImg, speciesName, mini, setShowSticker }) {

  const navigation = useNavigation();
  const onPress = () => {
    if (mini) {
      setShowSticker({visible: true, speciesName, representativeImg});
    } else {
      navigation.navigate('DictionaryDetail', { representativeImg, speciesName });
    }
  }
  return (
      <TouchableOpacity onPress={onPress} style={styles.container}>
        <Image source={{ uri: representativeImg}} style={{ width: 110, height: 110, marginVertical: 4 }}/>
        <Text style={{ fontSize: 16 }}>{speciesName}</Text>
      </TouchableOpacity>

  );
};

const styles = StyleSheet.create({
  container: {
    width: '30%',
    height: 150,
    borderRadius: 10, // border-radius: 10px;
    borderWidth: 1, 
    margin: 5,
    alignItems: 'center',
  },
});

