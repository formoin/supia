import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../Atoms/Header';
import Divide from '../Divide';
import FriendAccept from '../Organisms/Message/FriendAcceptBox';
import FriendRequest from '../Organisms/Message/FriendRequestBox';
import GiftBox from '../Organisms/Message/GiftBox';
import useStore from '../store/useStore';
import axios from 'axios';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';

export default function AlarmScreen() {
  const { activeText, resetActiveText } = useStore();
  const isFocused = useIsFocused();
  const [alarm, setAlarm] = useState(null);


  const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMEBzc2FmeS5jb20iLCJtZW1iZXJJZCI6MSwiaWF0IjoxNzIzMDA1MDg1LCJleHAiOjE3NTQ1NDEwODV9.ch7Dr2fSthZGXwjCxIWpH_aIT-NlPVSMfT6wfV3iyC2TprADLaSBXvpMQf_m7hKSq5Oz7Ym6QBPPQjHZ8t8ARA';
  const memberId = 1;

  // messageId, fromMemberNickname, toMemberNickname, content, category, sentTime, check
  // category(1: 일반 메세지, 2: 선물, 3: 친구 요청) -> 2, 3
  const getAlarm = async () => {
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
//        console.log(response.data);
        setAlarm(response.data);
        console.log('친구, 선물 알림 로딩 성공');
      } else {
        console.log('친구, 선물 알림 로딩 실패');
      }
    } catch (error) {
      console.error('친구, 선물 알림 요청 중 오류 발생:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (isFocused) {
        resetActiveText();
        getAlarm();
      }
    }, [isFocused, resetActiveText]),
  );

  return (
    <View>
      <Header label="알림" />
      <View style={styles.divide}>
        <Divide text1="친구" text2="선물" />
        <View>
          {activeText === 'text1' ? (
            <>
              <FriendAccept />
              <FriendRequest />
            </>
          ) : (
            <GiftBox />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  divide: {
    marginTop: 20,
    alignItems: 'center',
  },
});
