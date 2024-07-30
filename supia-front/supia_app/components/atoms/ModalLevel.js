import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';

const images = {
  '씨앗': require('../../assets/level/씨앗.png'),
  '새싹': require('../../assets/level/새싹.png'),
  '잎새': require('../../assets/level/잎새.png'),
  '꽃': require('../../assets/level/꽃.png'),
  '열매': require('../../assets/level/열매.png'),
};

export default function ModalLevel({UserLevel}) {
  return (
    <View style={styles.container}>
      <Image
        style={styles.levelimg}
        source={images[`${UserLevel}`]}
      />
      <Text style={styles.typography}>{UserLevel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // 가로로 배치
    alignItems: 'center', // 세로축 중앙 정렬
    margin: 10,
  },
  levelimg : {
    width: 39, // 필요에 따라 너비와 높이를 조정하세요
    height: 41,
    marginRight: 10,
  },
  typography:{
    fontSize: 24,
    fontStyle: 'normal', 
    fontWeight: '400'
  }
});
