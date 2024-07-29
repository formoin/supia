import React from 'react';
import { StyleSheet, View, Pressable, Image } from 'react-native';

export default function ModalImage({ UserName }) {
  const gotoForest = () => {
    alert('forest')
  }
  return (
    <View>
      <Pressable onPress={gotoForest}>
        <Image
          style={styles.img}
          source={{
            uri: 'https://s3-alpha-sig.figma.com/img/fe6c/a030/81ce3c956b41f826ef51fe083f24ee5d?Expires=1722816000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=gBZEI908eBLhDdeHHxlPENh4XX5oxgoyY~DUx-J-4A-41AbK3i3Vsu3Zw5UMKg72bJHdnsQsnsB5~5OfV49K0BWWul1c~-pcyHj7ClBzkUGxf2Aq2M-FEpPl4zVNG48hntsQDZBlxL2v0phNwxz1p~M4lJw3yW7s3-zTp9oHqXjGnVH5gCgbahOkJL9sQxDrX--RSk~ts6JmlARgqtSQj~wUYeDjCksQcDGX9MOWV19KD6PsimxzNQzzXasaHvOeMtbqdlWLb6C5XFGb7z6r-FUtoKquh5sLdVNQK4LKyGJ~bjFQs~N5gJoJvVxuJoxnIfd2iBv3HNyGpMVCvADHwQ__',
          }}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  img: {
    width: 189, // 필요에 따라 너비와 높이를 조정하세요
    height: 127,
    borderRadius: 20,
    elevation: 4,
    margin: 5 
  },
  
});
