import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, FlatList} from 'react-native';
import Header from '../Atoms/Header';
import StoreBox from '../Organisms/StoreBox';
import Divide from '../Divide';
import useStore from '../store/useStore';
import axios from 'axios';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import {Server_IP} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

import loginStore from '../store/useLoginStore';

export default function StoreScreen() {
  const {activeText, resetActiveText} = useStore();
  const [background, setBackground] = useState([]);
  const [music, setMusic] = useState([]);
  const [point, setPoint] = useState(null);
  const [id, setId] = useState(null);
  const [level, setLevel] = useState(null);
  const isFocused = useIsFocused();
  // const {token} = loginStore.getState();
  const [ownedBGI, setOwnedBGI] = useState([]); // 소유한 배경 ID 저장
  const [ownedBGM, setOwnedBGM] = useState([]); // 소유한 음악 ID 저장

  useFocusEffect(
    React.useCallback(() => {
      resetActiveText();
    }, [resetActiveText]),
  );

  useEffect(() => {
    getPoint();
    if (activeText === 'text1') {
      getOwnBGI();
      getBackground();
    } else if (activeText === 'text2') {
      getOwnBGM();
      getMusic();
    }
  }, [activeText]);

  const getBackground = async () => {
    const token = await AsyncStorage.getItem('key');

    try {
      const response = await axios.get(`${Server_IP}/background/bgi`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
      if (response.status === 200) {
        setBackground(response.data);
        console.log('배경 리스트 저장');
      } else {
        console.log('배경 리스트 저장 실패');
      }
    } catch (error) {
      console.error('배경 리스트 요청 중 오류 발생:', error);
    }
  };

  const getMusic = async () => {
    const token = await AsyncStorage.getItem('key');

    try {
      const response = await axios.get(`${Server_IP}/background/bgm`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
      if (response.status === 200) {
        setMusic(response.data);
        console.log(response.data);
        console.log('음악 리스트 저장');
      } else {
        console.log('음악 리스트 저장 실패');
      }
    } catch (error) {
      console.error('음악 리스트 요청 중 오류 발생:', error);
    }
  };

  const getPoint = async () => {
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
        setPoint(response.data.member.point);
        setId(response.data.member.id);
        setLevel(response.data.member.level);
        console.log('회원 정보 확인 성공');
      } else {
        console.log('회원 정보 확인 실패');
      }
    } catch (error) {
      console.error('회원 정보 요청 중 오류 발생:', error);
    }
  };

  const getOwnBGI = async () => {
    const token = await AsyncStorage.getItem('key');

    try {
      const response = await axios.get(`${Server_IP}/background/own-bgi`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
      if (response.status === 200) {
        const itemIds = response.data.map(item => item.itemId);
        setOwnedBGI(itemIds);

        console.log('내 테마 리스트 로딩 성공');
      } else {
        console.log('내 테마 리스트 로딩 실패');
      }
    } catch (error) {
      console.error('내 테마 리스트 요청 중 오류 발생:', error);
    }
  };

  const getOwnBGM = async () => {
    const token = await AsyncStorage.getItem('key');

    try {
      const response = await axios.get(`${Server_IP}/background/own-bgm`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
      if (response.status === 200) {
        const itemIds = response.data.map(item => item.itemId);
        setOwnedBGM(itemIds);
        console.log('내 음악 리스트 로딩 성공');
      } else {
        console.log('내 음악 리스트 로딩 실패');
      }
    } catch (error) {
      console.error('내 음악 리스트 요청 중 오류 발생:', error);
    }
  };

  const renderItem = ({item}) => {
    const isOwned =
      activeText === 'text1'
        ? ownedBGI.includes(item.id)
        : ownedBGM.includes(item.id);

    return (
      <StoreBox
        name={item.name}
        {...(activeText === 'text1' ? {background: item} : {music: item})}
        point={point}
        id={id}
        level={level}
        isOwned={isOwned}
        getPoint={getPoint}
        getBackground={getBackground}
        getMusic={getMusic}
        getOwnBGI={getOwnBGI}
        getOwnBGM={getOwnBGM}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header label="상점" />
      </View>
      <View style={styles.divideContainer}>
        <Divide text1="배경사진" text2="배경음악" />
        <Text style={styles.pointText}>내 포인트 {`${point} P`}</Text>
      </View>
      <FlatList
        data={activeText === 'text1' ? background : music}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    marginBottom: 30,
  },
  divideContainer: {
    // flexDirection: 'row', // 행 방향으로 설정
    // alignItems: 'center', // 세로 중앙 정렬
    // justifyContent: 'space-between', // 양쪽 끝에 배치
    width: '95%',
    marginLeft:'2.5%'
    
  },
  pointText:{
    position: 'absolute',
    right: 0,
    bottom:7,
    alignItems: 'center',
  }
});
