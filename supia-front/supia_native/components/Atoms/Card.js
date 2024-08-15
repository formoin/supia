import React, {useState} from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useStore from '../store/useStore';

export default function Card({representativeImg, speciesName, mini, setShowSticker, id, setStickerinfo }) {
  const {getS3Url} = useStore();
  const navigation = useNavigation();
  const onPress = () => {
    if (mini) {
      setShowSticker({visible: true});
      setStickerinfo({id:id, speciesName:speciesName, representativeImg:representativeImg})
      // setShowSticker({visible: true, id, speciesName, representativeImg});
    } else {
      navigation.navigate('DictionaryDetail', { id, representativeImg, speciesName });
    }
  }
  return (
      <TouchableOpacity onPress={onPress} style={styles.container}>
        <Image source={{ uri: getS3Url(representativeImg)}} style={{ width: 80, height: 80, marginVertical: 15 }}/>
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

