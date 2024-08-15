import React from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function MeetingPage_bottom({onPressEnd, onTakePicture}) {
  return (
    <View style={[styles.container]}>
      <Pressable onPress={onPressEnd} style={styles.callEndButton}>
        <MaterialIcons name="call-end" size={30} color="red" />
      </Pressable>
      <View style={styles.iconWithCircle}>
        <View style={styles.bg} />
        <Pressable onPress={onTakePicture} style={styles.pictureIcon} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 58,
    margin: 15,
    position: 'relative', // 버튼들이 절대 위치를 가질 수 있도록 설정
  },
  callEndButton: {
    position: 'absolute',
    left: 85, // 왼쪽 구석에 위치
    bottom: 6, // 아래 구석에 위치
    padding: 5,
    borderRadius: 50,
    backgroundColor: '#fff',
  },
  pictureIcon: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: 'white',
    position: 'absolute',
  },
  bg: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: 'rgba(162, 170, 123, 0.8)',
    position: 'absolute',
    zIndex: -1,
    opacity: 0.8,
  },
  iconWithCircle: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center', // 중앙에 위치하도록 설정
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1, // 테두리 두께 설정
    borderRadius: 50, // 테두리도 둥글게 설정
  },
});
