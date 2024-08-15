import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import Header from '../Atoms/Header';
import Divide from '../Divide';
import FriendAccept from '../Organisms/Message/FriendAcceptBox';
import FriendRequest from '../Organisms/Message/FriendRequestBox';
import GiftBox from '../Organisms/Message/GiftBox';
import useStore from '../store/useStore';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
import {Server_IP} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AlarmScreen() {
  const {activeText, setActiveText, resetActiveText} = useStore();
  const [gifts, setGifts] = useState([]);
  const [requestFriends, setRequestFriends] = useState([]);
  const [acceptFriends, setAcceptFriends] = useState([]);
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
        const friendsData = response.data;
        // category에 따라 다른 처리를 해줌
        const requestFriends = friendsData.filter(friend => friend.category === 3);
        const acceptFriends = friendsData.filter(friend => friend.category === 4);

        setRequestFriends(requestFriends); // category가 3인 경우
        setAcceptFriends(acceptFriends);   // category가 4인 경우

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

  return (
    <View style={styles.container}>
      <Header label="알림" />
      <View style={styles.divide}>
        <View style={styles.divideContent}>
          <Divide text1="친구" text2="선물" />
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {activeText === 'text1' ? (
            <View style={styles.contentContainer}>
              <FriendRequest friends={requestFriends} getFriends={getFriends} />
              <FriendAccept friends={acceptFriends} getFriends={getFriends} />
            </View>
          ) : (
            <View style={styles.contentContainer}>
              <GiftBox gifts={gifts} getGift={getGift} />
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // 화면 전체를 차지하도록 설정
  },
  divide: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
  },
  divideContent: {
    width: '95%',
    marginHorizontal: '2.5%',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 50, // 패딩 조정
  },
  contentContainer: {
    flex: 1,
  },
});
