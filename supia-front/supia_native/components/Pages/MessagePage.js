import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import Header from '../Atoms/Header';
import GiftBox from '../Organisms/Message/GiftBox';
import FriendAcceptBox from '../Organisms/Message/FriendAcceptBox';
import FriendRequestBox from '../Organisms/Message/FriendRequestBox';
import SentMessage from '../Organisms/Message/SentMessageBox';
import SendMessage from '../Organisms/Message/SendMessageBox';
import useStore from '../store/useStore';
import Divide from '../Divide';
import axios from 'axios';

export default function MessageScreen() {
  const isFocused = useIsFocused();
  const [toMessage, setToMessage] = useState(null);
  const [fromMessage, setFromMessage] = useState(null);
  const { activeText, setActiveText, resetActiveText } = useStore();

  useFocusEffect(
    React.useCallback(() => {
      resetActiveText();
    }, [resetActiveText]),
  );

  const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwMDAwQG5hdmVyLmNvbSIsIm1lbWJlcklkIjo2LCJpYXQiOjE3MjMwMzMwNzUsImV4cCI6MTc1NDU2OTA3NX0.g8jpiTc7tLMNf_QvYq5SLLsIA1REIKPyl37c1w0OYXAGDJ6JOuDjDxh0zO8zORd0EZNgl2ADyEXaw6KmZ3lWwQ'

  // messageId, fromMemberNickname, toMemberNickname, content, category, sentTime, check
  // category(1: 일반 메세지, 2: 선물, 3: 친구 요청) -> 1
  const getFromMessage = async () => {
    try {
      const response = await axios.get(
        "https://i11b304.p.ssafy.io/api/messages/from",
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
        setFromMessage(response.data);
        console.log('보낸 메세지함 리스트 로딩 성공');
      } else {
        console.log('보낸 메세지함 리스트 로딩 실패');
      }
    } catch (error) {
      console.error('보낸 메세지함 요청 중 오류 발생:', error);
    }
  };

  const getToMessage = async () => {
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
        setToMessage(response.data);
        console.log('받은 메세지함 리스트 로딩 성공');
      } else {
        console.log('받은 메세지함 리스트 로딩 실패');
      }
    } catch (error) {
      console.error('받은 메세지함 요청 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      getFromMessage();
      getToMessage();
      resetActiveText();
    }
  }, [isFocused]);

  return (
    <View>
      <Header label="메세지" />
      <View style={styles.divide}>
        <Divide text1="보낸 메세지" text2="받은 메세지" />
        {activeText === 'text1' ? (
          <SendMessage />
        ) : (
          <SentMessage />
        )}
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
