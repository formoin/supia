import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';

const levelNames = {
  0: '씨앗',
  1: '새싹',
  2: '잎새',
  3: '꽃',
  4: '열매',
};

const images = {
   0: require('../../assets/level/씨앗.png'),
   1: require('../../assets/level/새싹.png'),
   2: require('../../assets/level/잎새.png'),
   3: require('../../assets/level/꽃.png'),
   4: require('../../assets/level/열매.png'),
};

export default function ModalLevel({ UserLevel }) {
  const levelName = levelNames[UserLevel] || 'Unknown';

  return (
    <View style={styles.container}>
      <Image
        style={styles.levelimg}
        source={images[UserLevel]} // 레벨 이름에 해당하는 이미지 로드
      />
      <Text style={styles.typography}>{levelName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // 가로로 배치
    alignItems: 'center', // 세로축 중앙 정렬
    margin: 10,
  },
  levelimg: {
    width: 35, // 필요에 따라 너비와 높이를 조정하세요
    height: 35,
    marginRight: 10,
    marginTop: 10
  },
  typography: {
    fontSize: 20,
    marginTop: 10,
  }
});
