import React from 'react';
import { View, StyleSheet, Text } from "react-native";
import Header from "../atoms/Header";
import StoreBox from "../organisms/StoreBox";
import Divide from "../Divide";
import useStore from '../store/useStore';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';

export default function StoreScreen() {
  const { activeText, setActiveText, resetActiveText } = useStore();
  const isFocused = useIsFocused();

  useFocusEffect(
    React.useCallback(() => {
      resetActiveText();
    }, [resetActiveText])
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header label="상점" />
      </View>
      <View style={styles.divideContainer}>
        <Divide text1="배경사진" text2="배경음악" />
        <Text style={{ marginRight: 90 }}>내 포인트 200 P</Text>
      </View>
      {activeText === 'text1' && (
        <StoreBox name="희망의 숲" />
      )}
      {activeText === 'text2' && (
        <StoreBox name="모닥불 타는 소리" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    marginBottom: 30,
  },
  divideContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginLeft: 80
  },

});
