import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import Header from '../Atoms/Header';
import Searchbar from '../Organisms/SearchBar';
import Divide from '../Divide';
import ListItem from '../Atoms/ListItem';
import useStore from '../store/useStore';
import axios from 'axios';

export default function SearchScreen() {
  const { activeText, setActiveText, resetActiveText } = useStore();
  const [friendData, setFriendData] = useState([]);
  const isFocused = useIsFocused();

  const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMEBzc2FmeS5jb20iLCJtZW1iZXJJZCI6MSwiaWF0IjoxNzIzMDAxNzU2LCJleHAiOjE3NTQ1Mzc3NTZ9.yQ_IgYEQzmf5O2_csfB095x3RcWrxdJynXGy6XqJT3Zc5-tQ-sSs4ycdMCxwKiWgj1_m8L83O3kKibIi7x0JJA';
  const memberId = 1;

  const getFriend = async () => {
    try {
      const response = await axios.get('https://i11b304.p.ssafy.io/api/friends', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
        params: {
          memberId: memberId,
        },
      });

      if (response.status === 200) {
        console.log(response.data);
        setFriendData(response.data);
        console.log('친구 리스트 로딩 성공');
      } else {
        console.log('친구 리스트 로딩 실패');
      }
    } catch (error) {
      console.error('친구 리스트 요청 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      getFriend();
      resetActiveText();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Header label="검색하기" />
      <View style={styles.p_value}>
        <Divide text1="User" text2="Item" />
      </View>
      <View style={styles.searchbar}>
        <Searchbar active={true} />
      </View>
      <View style={styles.p_value}>
        {activeText === 'text1' ? (
          friendData.map(friend => (
            <ListItem
              key={friend.friendId}
              pic="user" // {friend.profileImg}
              title={friend.nickname}
              content={friend.name}
              name="message-square"
              UserLevel="새싹"
              page="search"
            />
          ))
        ) : (
          <ListItem
            pic=""
            title="개망초"
            content="충청북도 청주시 서원구 분평동"
          />
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
