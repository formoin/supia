import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import Header from '../Atoms/Header';
import Divide from '../Divide';
import FriendAccept from '../Organisms/Message/FriendAcceptBox';
import FriendRequest from '../Organisms/Message/FriendRequestBox';
import GiftBox from '../Organisms/Message/GiftBox';
import useStore from '../store/useStore';
import axios from 'axios';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import loginStore from '../store/useLoginStore';
import {Server_IP} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AlarmScreen() {

  const { activeText, setActiveText, resetActiveText } = useStore();
  const isFocused = useIsFocused();
  const [gifts, setGifts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      resetActiveText();
    }, [resetActiveText])
  );

  useEffect(() => {
    if (activeText === 'text1') {
      getFriends();
    } else if (activeText === 'text2') {
      getGift();
    }
  }, [activeText]);


  // 선물 내역 불러오기
  const getGift = async () => {
    const token = await AsyncStorage.getItem('key');
    try {
      setIsLoading(true);
      const response = await axios.get(`${Server_IP}/messages/gift-box`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
      if (response.status === 200) {
        setGifts(response.data);
        console.log('선물 내역 로딩 성공:', response.data);
      } else {
        console.log('선물 내역 로딩 실패');
      }
    } catch (error) {
      console.error('선물 내역 중 오류 발생:', error);
    } finally {
      setIsLoading(false); // 로딩 완료
    }
  };

  // 친구 요청 내역 불러오기
  const getFriends = async () => {
    const token = await AsyncStorage.getItem('key');
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${Server_IP}/messages/notification-box`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
          },
        },
      );
      if (response.status === 200) {
        setFriends(response.data);
        console.log('친구 요청 로딩 성공:', response.data);
      } else {
        console.log('친구 요청 로딩 실패');
      }
    } catch (error) {
      console.error('친구 요청 로딩 중 오류 발생:', error);
    } finally {
      setIsLoading(false); // 로딩 완료
    }
  };

  useEffect(() => {
    setActiveText('text1');
  }, []);

  useEffect(() => {
    if (activeText === 'text1') {
      getFriends();
    } else if (activeText === 'text2') {
      getGift();
    }
  }, [activeText]);

  useFocusEffect(
    React.useCallback(() => {
      resetActiveText();
    }, [resetActiveText]),
  );

  return (
    <View>
      <Header label="알림" />
      <View style={styles.divide}>
        <View style={{width: '95%', marginLeft:'2.5%'}}>
          <Divide text1="친구" text2="선물" />
        </View>
        <ScrollView>
          {activeText === 'text1' ? (
            <FriendRequest friends={friends} getFriends={getFriends} />
          ) : (
            <GiftBox gifts={gifts} />
          )}
        </ScrollView>
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
