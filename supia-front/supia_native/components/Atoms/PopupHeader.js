import React from 'react';
import {StyleSheet, View, Text, Pressable} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

export default function PopupHeader({Label, onClose}) {
  return (
    <View style={styles.Header}>
      <View style={styles.centerContainer}>
        <Text style={styles.typography}>{Label}</Text>
      </View>
      <Pressable onPress={onClose} style={styles.closeButton}>
        <EvilIcons name="close" size={24} color="#A2AA7B" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  Header: {
    flexDirection: 'row', // 가로로 배치
    alignItems: 'center', // 세로 중앙 정렬
    width: '100%', // 헤더가 전체 너비를 차지하도록 설정
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center', // 텍스트를 가운데로 정렬
    justifyContent: 'center', // 수직 중앙 정렬
    position: 'absolute', // 절대 위치 지정
    left: 0,
    right: 0,
  },
  typography: {
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  closeButton: {
    marginLeft: 'auto',
  },
});
