import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../Atoms/Header';
import GiftBox from '../Organisms/Message/GiftBox';
import FriendAcceptBox from '../Organisms/Message/FriendAcceptBox';
import FriendRequestBox from '../Organisms/Message/FriendRequestBox';
import MessageBox from '../Organisms/Message/MessageBox';
import useStore from '../store/useStore';
import Divide from '../Divide';
import axios from 'axios';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';

export default function MessageScreen() {
  const [message, setMessage] = useState(null);
  const {activeText, setActiveText, resetActiveText} = useStore();

  useFocusEffect(
    React.useCallback(() => {
      resetActiveText();
    }, [resetActiveText]),
  );

  const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMEBzc2FmeS5jb20iLCJtZW1iZXJJZCI6MSwiaWF0IjoxNzIzMDAxNzU2LCJleHAiOjE3NTQ1Mzc3NTZ9.yQ_IgYEQzmf5O2_csfB095x3RcWrxdJynXGy6XqJT3Zc5-tQ-sSs4ycdMCxwKiWgj1_m8L83O3kKibIi7x0JJA';
  const memberId = 1;

  const getMessage = async () => {
    try {
      const response = await axios.get(
        "https://i11b304.p.ssafy.io/api/messages/to",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
          },
        },
      );
      if (response.status === 200) {
        console.log(response.data);
        setMessage(response.data);
        console.log('메세지함 리스트 로딩 성공');
      } else {
        console.log('메세지함 리스트 로딩 실패');
      }
    } catch (error) {
      console.error('메세지함 요청 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      getMessages();
      resetActiveText();
    }
  }, [isFocused]);

  return (
    <View>
      <Header label="메세지" />
      <View style={styles.divide}>
        <Divide text1="보낸 메세지" text2="받은 메세지" />
        <MessageBox />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    divide: {
        marginTop: 20,
        alignItems: 'center'
    }
});
