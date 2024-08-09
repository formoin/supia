import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Pressable, Text, ActivityIndicator } from 'react-native';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import Header from '../Atoms/Header';
import GiftBox from '../Organisms/Message/GiftBox';
import FriendAcceptBox from '../Organisms/Message/FriendAcceptBox';
import FriendRequestBox from '../Organisms/Message/FriendRequestBox';
import SentMessage from '../Organisms/Message/SentMessageBox';
import SendMessage from '../Organisms/Message/SendMessageBox';
import Octicons from 'react-native-vector-icons/Octicons';
import useStore from '../store/useStore';
import loginStore from '../store/useLoginStore';
import Divide from '../Divide';
import axios from 'axios';

export default function MessageScreen() {
  const isFocused = useIsFocused();
  const [toMessage, setToMessage] = useState(null);
  const [fromMessage, setFromMessage] = useState(null);
  const [edit, setEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const { activeText, setActiveText, resetActiveText } = useStore();
  const { token } = loginStore.getState()

  const onPressPencil = () => {
    setEdit(prevEdit => !prevEdit);
  };

  useFocusEffect(
    React.useCallback(() => {
      resetActiveText();
      setEdit(false);
    }, [resetActiveText]),
  );


  // messageId, fromMemberNickname, toMemberNickname, content, category, sentTime, check
  // category(1: 일반 메세지, 2: 선물, 3: 친구 요청) -> 1

  const getFromMessage = async () => {
    try {
      setIsLoading(true); // 로딩 시작
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
        const filteredMessages = response.data.filter(message => message.category === 1);
        setFromMessage(filteredMessages);
        console.log(filteredMessages)
        console.log('보낸 메세지함 리스트 로딩 성공');
      } else {
        console.log('보낸 메세지함 리스트 로딩 실패');
      }
    } catch (error) {
      console.error('보낸 메세지함 요청 중 오류 발생:', error);
    } finally {
      setIsLoading(false); // 로딩 완료
    }
  };

  const getToMessage = async () => {
    try {
      setIsLoading(true); // 로딩 시작
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
        const filteredMessages = response.data.filter(message => message.category === 1);
        setToMessage(filteredMessages);
        console.log('받은 메세지함 리스트 로딩 성공');
      } else {
        console.log('받은 메세지함 리스트 로딩 실패');
      }
    } catch (error) {
      console.error('받은 메세지함 요청 중 오류 발생:', error);
    } finally {
      setIsLoading(false); // 로딩 완료
    }
  };

  useEffect(() => {
    setEdit(false);
    if (activeText === 'text1') {
      getFromMessage();
    } else if (activeText === 'text2') {
      getToMessage();
    }
  }, [activeText]);

  useFocusEffect(
    React.useCallback(() => {
      resetActiveText();
    }, [resetActiveText])
  );

  return (
    <View>
      <Header label="메세지" />
      <View style={styles.divideContainer}>
        <Divide text1="보낸 메세지" text2="받은 메세지" />
        <Pressable onPress={onPressPencil} style={styles.pencilIcon}>
          <Octicons name="pencil" size={16} />
        </Pressable>
      </View>
      <View style={styles.boxContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#A2AA7B" /> // 로딩 중일 때 표시할 컴포넌트
        ) : activeText === 'text1' ? (
          <SendMessage edit={edit} fromMessage={fromMessage} onDelete={getFromMessage} />
        ) : (
          <SentMessage edit={edit} toMessage={toMessage} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  divideContainer: {
    marginTop: 20,
    flexDirection: 'row',
    marginLeft: 25,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  pencilIcon: {
    paddingRight: 25,
  },
  boxContainer: {
    alignItems: 'center',
  },
});
