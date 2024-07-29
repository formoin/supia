import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';

const images = {
  level_1: require('../../assets/level/level_1.png'),
  level_2: require('../../assets/level/level_2.png'),
  level_3: require('../../assets/level/level_3.png'),
  level_4: require('../../assets/level/level_4.png'),
  level_5: require('../../assets/level/level_5.png'),
};

export default function ModalLevel({UserLevel}) {
  return (
    <View style={styles.container}>
      <Image
        style={styles.levelimg}
        source={images[`level_${UserLevel}`]}
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
