import React, { useEffect } from 'react';
import { View, StyleSheet } from "react-native";
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import Header from "../atoms/Header";
import Searchbar from "../organisms/SearchBar";
import Divide from "../Divide";
import ListItem from "../atoms/ListItem";
import useStore from '../store/useStore';

export default function SearchScreen() {
  const { activeText, setActiveText, resetActiveText } = useStore();
  const isFocused = useIsFocused(); // 네비게이션 포커스 훅

  useFocusEffect(
    React.useCallback(() => {
      // 화면이 포커스될 때 상태를 초기화
      resetActiveText();
    }, [resetActiveText])
  );

  return (
    <View style={styles.container}>
      <Header label="검색하기" />
      <View style={styles.p_value}>
        <Divide text1="User" text2="Item" />
      </View>
      <View style={styles.searchbar}>
        <Searchbar active={true}/>
      </View>
      <View style={styles.p_value}>
        {activeText === 'text1' ? (
          <ListItem pic="user" title="yewone1" content="김예원" name="message-square" UserLevel="새싹" />
        ) : (
          <ListItem pic="" title="개망초" content="충청북도 청주시 서원구 분평동" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  p_value: {
    padding: 20,
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  searchbar: {
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
  },
});
