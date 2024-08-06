import {View, Text, StyleSheet, Pressable} from 'react-native';
import Header from '../Atoms/Header';
import Label from '../Atoms/ListItem';
import React, { useState } from 'react';
import axios from 'axios';
import MessageBox from '../Organisms/Message/MessageBox';
import GiftBox from '../Organisms/Message/GiftBox';
import FriendRequestBox from '../Organisms/Message/FriendRequestBox';
import FriendAcceptBox from '../Organisms/Message/FriendAcceptBox';

export default function MessageScreen() {
  const [message, setMessage] = useState(null);

  // messageId, fromMemberId, content, category, sentTime
  // category (1: 일반 메세지, 2: 선물, 3: 친구 요청)
  const getMessage = async () => {
    try {
      const response = await axios.get(
        "http://i11b304.p.ssafy.io/api/messages",
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
      console.error('요청 중 오류 발생:', error);
    }
  };

  return (
    <View>
      <Header label="메세지" />
      <GiftBox />
      <FriendAcceptBox />
      <FriendRequestBox />
      <MessageBox />
    </View>
  );
}

const styles = StyleSheet.create({

});
