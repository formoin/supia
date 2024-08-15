import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import {useNavigation} from '@react-navigation/native';
import WeatherInfo from '../Atoms/HomeInfo/WeatherInfo';
import MyInfo from '../Atoms/HomeInfo/MyInfo';
import axios from 'axios';
import loginStore from '../store/useLoginStore';
import useStore from '../store/useStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Server_IP} from '@env';
import EventSource from 'react-native-sse';
import LoadingScreen from './LoadingPage';
import CallModal from '../CallModal';
export default function HomeScreen() {
  const navigation = useNavigation();
  const [memberInfo, setMemberInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const {token} = loginStore.getState();
  const [hasUnread, setHasUnread] = useState(false); // 알림 여부
  const [unreadCount, setUnreadCount] = useState(0); // 안 읽은 메시지 수
  const [modalVisible, setModalVisible] = useState(false); // Call 모달
  const eventSourceRef = useRef(null); // SSE 요청 객체
  const [callFriend, setCallFriend] = useState(null); // 전화 연결
  const {
    getS3Url,
    weeklyWalkHistory,
    fetchWalkHistory,
    memberId,
    setMemberId,
    memberName,
    setMemberName,
  } = useStore(state => ({
    getS3Url: state.getS3Url,
    weeklyWalkHistory: state.weeklyWalkHistory,
    memberId: state.memberId,
    setMemberId: state.setMemberId,
    memberName: state.memberName,
    setMemberName: state.setMemberName,
    fetchWalkHistory: state.fetchWalkHistory,
    weeklyWalkHistory: state.weeklyWalkHistory,
  }));
  useEffect(() => {
    if (callFriend) {
      setModalVisible(true);
    }
  }, [callFriend]);

  const calWalkData = datas => {
    if (!datas || datas.length === 0) {
      return 0;
    }
    return datas.reduce((total, data) => total + data.totalDistance, 0);
  };

  const goDictionary = () => {
    navigation.navigate('Dictionary');
  };

  const goMyForest = () => {
    navigation.navigate('MyForest');
  };

  const goMessage = () => {
    navigation.navigate('Message');
  };

  const goAlarm = () => {
    setHasUnread(false);
    navigation.navigate('Alarm');
  };

  const getInfo = async () => {
    const token = await AsyncStorage.getItem('key');
    try {
      const response = await axios.get(`${Server_IP}/members/my-info`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
      });

      if (response.status === 200) {
        //console.log(token)
        console.log(response.data.member);
        setMemberInfo(response.data.member);
        setMemberId(response.data.member.id);
        setMemberName(response.data.member.name);
        setUnreadCount(response.data.member.unreadMessage);

        // isCheckAlarm 값이 0보다 크면 true로 설정

        if (!eventSourceRef.current) {
          setHasUnread(response.data.member.isCheckAlarm > 0);

          const es = new EventSource(
            `${Server_IP}/notification/subscribe/${response.data.member.id}`,
          );

          es.addEventListener('message', event => {
            console.log('New message event:', event.data);
            setUnreadCount(event.data); // 정수로 변환하여 설정
          });

          es.addEventListener('alarm', event => {
            console.log('New alarm event:', event.data);
            setHasUnread(event.data > 0); // 알람 데이터가 0보다 크면 true로 설정
          });

          es.addEventListener('call', event => {
            const data = JSON.parse(event.data);
            setCallFriend(data);
          });

          es.addEventListener('error', event => {
            console.error('SSE Error:', event.message);
          });

          es.addEventListener('close', () => {
            console.log('SSE Connection closed.');
          });

          eventSourceRef.current = es;
        }
      }
    } catch (error) {
      console.error('Error fetching member info:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      await getInfo();
      fetchWalkHistory();
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);

  if (loading) {
    return (
      <View style={{flex: 1}}>
        <LoadingScreen />
      </View>
    );
  }

  if (!memberInfo) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Member info loading . . .</Text>
      </View>
    );
  }

  const getImageUri = thumbnail => {
    const timestamp = Date.now();
    if (thumbnail.startsWith('file://')) {
      return {uri: thumbnail}; // File path
    } else {
      return {uri: getS3Url(thumbnail + `?timestamp=${timestamp}`)}; // S3 경로일 때
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.Headcontainer}>
        <View style={styles.textContainer}>
          <Text style={styles.hello}>Hello {memberInfo.nickname}</Text>
          <Text style={styles.bagga}>Welcome {memberInfo.name}!</Text>
          {callFriend && (
            <CallModal
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              friend={callFriend}
              friendId={callFriend.memberId}
              friendName={callFriend.name}
              friendNickName={callFriend.nickname}
              friendProfileImg={callFriend.profileImg}
            />
          )}
        </View>
        <View style={styles.topRight}>
          <Pressable
            style={{marginRight: 8}}
            onPress={() => navigation.navigate('Search')}>
            <Feather name="search" size={25} color="#8C8677" />
          </Pressable>
          <Pressable style={{marginRight: 10}} onPress={goAlarm}>
            <MaterialIcons
              name="notifications-outline"
              size={30}
              color="#8C8677"
            />
            {hasUnread && <View style={styles.badge} />}
          </Pressable>
          <Pressable style={{marginRight: 10}} onPress={goMessage}>
            <Octicons name="mail" size={25} color="#8C8677" />
            {unreadCount > 0 && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <View style={styles.thumbcontainer}>
        <Pressable onPress={goMyForest}>
          <Image
            source={getImageUri(memberInfo.thumbnail)}
            style={styles.thumbnail}
          />
        </Pressable>
      </View>

      <View style={styles.foryou}>
        <Text style={styles.bagga}>For Me</Text>
      </View>

      <View style={styles.info}>
        <WeatherInfo />
        <MyInfo
          level={memberInfo.level}
          point={memberInfo.point}
          distance={calWalkData(weeklyWalkHistory)}
        />
      </View>

      <Pressable style={styles.slideHandleContainer} onPress={goDictionary}>
        <View style={styles.slideHandle} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  Headcontainer: {
    width: '100%',
    height: '12%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  thumbcontainer: {
    width: '100%',
    height: '30%',
  },
  textContainer: {
    flex: 1,
  },
  topRight: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hello: {
    color: '#414141',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  bagga: {
    color: '#321C1C',
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 30,
    marginTop: 10,
  },
  foryou: {
    width: '100%',
    height: '5%',
    marginBottom: 5,
    marginLeft: 10,
  },
  thumbnail: {
    width: '90%',
    height: '90%',
    marginLeft: 20,
    marginBottom: 20,
    borderRadius: 15,
  },
  info: {
    width: '90%',
    height: '50%',
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  slideHandleContainer: {
    position: 'absolute',
    top: '40%',
    bottom: 0,
    right: 0,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: '10%',
  },
  slideHandle: {
    width: 10,
    height: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 5,
  },
  badge: {
    position: 'absolute',
    right: 2,
    top: 0,
    backgroundColor: 'red',
    width: 12,
    height: 12,
    borderRadius: 15,
  },
  badgeContainer: {
    position: 'absolute',
    top: -5,
    right: -8,
    backgroundColor: 'green',
    borderRadius: 10,
    width: 15,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
