import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useState } from 'react';

export default function Header({ label }) {
  const [GoBack, setGoBack] = useState(false);
  const onPressBackIcon = () => {
    setGoBack(true);
    alert('goBack')
  }
  return (
    <View style={styles.HeaderContainer}>
      <Pressable onPress={onPressBackIcon}>
        <Entypo
          name="chevron-small-left"
          size={24}
          style={styles.BackIcon}
        />
      </Pressable>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  HeaderContainer: {
    flexDirection: 'row',
    width: 360,
    paddingHorizontal: 18,
    alignItems: 'center',
    paddingTop: 20
  },
  BackIcon: {
    marginRight: 10, // 아이콘 오른쪽 여백 추가
  },
  label: {
    flex: 1, // 나머지 공간을 차지하도록 설정
    fontSize: 20,
    color: '#000',
    textAlign: 'center', // 텍스트 중앙 정렬
  },
});

