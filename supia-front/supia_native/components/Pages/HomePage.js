import React, {useEffect, useState} from 'react';
import {View, Text, Pressable, StyleSheet, Image, ActivityIndicator} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import {useNavigation} from '@react-navigation/native';
import WeatherInfo from '../Atoms/HomeInfo/WeatherInfo';
import MyInfo from '../Atoms/HomeInfo/MyInfo';
import SlidePanel from '../Organisms/SlidePanel'; // 슬라이드 패널 컴포넌트 추가
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import axios from 'axios';
import loginStore from '../store/useLoginStore'
import useStore from '../store/useStore';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [memberInfo, setMemberInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { memberId, setMemberId } = useStore();
  const { token } = loginStore.getState()
  const { getS3Url } = useStore()

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
    try {
      const response = await axios.get('https://i11b304.p.ssafy.io/api/members/my-info', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
      if (response.status === 200) {
        console.log(response.data.member)
        console.log('썸네일주소', response.data.member.thumbnail);
        setMemberInfo(response.data.member)
        setMemberId(response.data.member.id);
        console.log('홈페이지 로딩 성공');
      } else {
        console.log('홈페이지 로딩 실패');
      }
    } catch (error) {
      console.error('홈페이지 요청 중 오류 발생:', error);
    } finally {
        setLoading(false); // 로딩 완료
      }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true)
      getInfo();
    });

    // 컴포넌트 언마운트 시 리스너 제거
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>로딩 . . .</Text>
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
          <Pressable style={{marginRight: 8}} onPress={() => navigation.navigate('Search')}>
            <Feather name="search" size={25} color="#8C8677" />
          </Pressable>
          <Pressable style={{marginRight: 10}} onPress={goAlarm}>
            <MaterialIcons name="notifications-outline" size={30} color="#8C8677" />
          </Pressable>
          <Pressable style={{marginRight: 10}} onPress={goMessage}>
            <Octicons name="mail" size={25} color="#8C8677" />
          </Pressable>
        </View>
      </View>

      <View style={styles.thumbcontainer}>
        <Pressable onPress={goMyForest}>
          <Image
            source={getImageUri(memberInfo.thumbnail)} // 이미지 경로
            style={styles.thumbnail}
          />
        </Pressable>
      </View>

      <View style={styles.foryou}>
        <Text style={styles.bagga}>For you</Text>
      </View>

      <View style={styles.info}>
        <WeatherInfo />
        <MyInfo level={memberInfo.level} point={memberInfo.point}/>
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
    padding: 10, // Added padding to ensure text doesn't get cut off
  },
  thumbcontainer:{
    width: '100%',
    height: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },  
  textContainer: {
    flex: 1, // Allow text container to take up available space
  },
  topRight: {
    flexDirection: 'row', // Arrange icons horizontally
    justifyContent: 'center', // Center icons vertically
    alignItems: 'center', // Center icons horizontally
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
    lineHeight: 30, // Adjust line height to ensure proper spacing
    marginTop: 10,
  },
  foryou: {
    width: '100%',
    height: '5%',
    marginBottom: 5,
    marginLeft: 10
  },
  thumbnail: {
    width: 330,
    height: '90%',
    marginLeft: 20,
    marginBottom: 20,
    borderRadius: 15,
    // transform: [{rotate: '180deg'}],
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
});
