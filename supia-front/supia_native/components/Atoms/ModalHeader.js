import React from 'react';
import {StyleSheet, View, Text, Pressable, Image} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import useStore from '../store/useStore';

export default function ModalHeader({UserName, onClose, page, url}) {
  const { getS3Url } = useStore();
  return (
    <View>
      <View style={styles.Header}>
        <View>
            <Image
              source={{ uri: getS3Url(url) }}
              style={styles.image}
            />
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
    image: {
      width: 35,
      height: 35,
      borderRadius: 25,
      marginLeft: 20
    },
});
