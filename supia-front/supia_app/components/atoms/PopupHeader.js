import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { EvilIcons } from '@expo/vector-icons';

export default function PopupHeader({ Label, onClose }) {
  // const onPressClose = () => {
  //   alert('close');
  // };

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
    justifyContent: 'space-between', // 양 끝으로 정렬
    width: '100%', // 헤더가 전체 너비를 차지하도록 설정
    paddingVertical: 8, // 상하 여백 추가 (옵션)
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center', // 텍스트를 가운데로 정렬
  },
  typography: {
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  closeButton: {
    marginRight: 10
  },
});
