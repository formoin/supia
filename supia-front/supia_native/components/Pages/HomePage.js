import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ActivityIndicator,
  Button,  // 추가
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import { useNavigation } from '@react-navigation/native';
import WeatherInfo from '../Atoms/HomeInfo/WeatherInfo';
import MyInfo from '../Atoms/HomeInfo/MyInfo';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import axios from 'axios';
import loginStore from '../store/useLoginStore';
import useStore from '../store/useStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Server_IP } from '@env';
import EventSource from 'react-native-event-source';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [memberInfo, setMemberInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const {token} = loginStore.getState();
  const [hasUnread, setHasUnread] = useState(true); // 안 읽은 알람이 있는지 여부
  const [unreadCount, setUnreadCount] = useState(1); // 안 읽은 메세지의 수
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
  }));

  // 주간 총 산책 거리 계산
  const calWalkData = (datas) => {
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
        console.log(response.data.member);
        setMemberInfo(response.data.member);
        setMemberId(response.data.member.id);
        setMemberName(response.data.member.name);
        console.log('홈페이지 로딩 성공');
        const id = response.data.member.id

        const es = new EventSource(`${Server_IP}/notification/subscribe/${id}`);
        console.log(es)

        es.addEventListener("message", (event) => {
          console.log("New message event:", event.data);
        });

        es.addEventListener("alarm", (event) => {
          console.log("New alarm event:", event.data);
        });

        es.addEventListener("error", (event) => {
          if (event.type === "error") {
            console.error("Connection error:", event.message);
          } else if (event.type === "exception") {
            console.error("Error:", event.message, event.error);
          }
        });

        es.addEventListener("close", (event) => {
          console.log("Close SSE connection.");
        });

      } else {
        console.log('홈페이지 로딩 실패');
      }
    } catch (error) {
      console.error('홈페이지 요청 중 오류 발생:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      await getInfo();;
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>로딩 . . .</Text>
      </View>
    );
  }

  if (!memberInfo) {
    return (
      <View style={styles.loadingContainer}>
        <Text>member info 로딩 . . .</Text>
      </View>
    );
  }

  const getImageUri = (thumbnail) => {
    if (thumbnail.startsWith('file://')) {
      return { uri: thumbnail }; // file 경로일 때
    } else {
      return { uri: getS3Url(thumbnail) }; // S3 경로일 때
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.Headcontainer}>
        <View style={styles.textContainer}>
          <Text style={styles.hello}>Hello {memberInfo.nickname}</Text>
          <Text style={styles.bagga}>반갑습니다 {memberInfo.name}님</Text>
        </View>
        <View style={styles.topRight}>
          <Pressable style={{ marginRight: 8 }} onPress={() => navigation.navigate('Search')}>
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
          <Pressable style={{ marginRight: 10 }} onPress={goMessage}>
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
        <Text style={styles.bagga}>For you</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

