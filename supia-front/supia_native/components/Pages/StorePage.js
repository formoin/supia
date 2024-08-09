import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList } from "react-native";
import Header from "../Atoms/Header";
import StoreBox from "../Organisms/StoreBox";
import Divide from "../Divide";
import useStore from '../store/useStore';
import axios from 'axios';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import loginStore from '../store/useLoginStore';

export default function StoreScreen() {
  const { activeText, resetActiveText } = useStore();
  const [background, setBackground] = useState([]);
  const [music, setMusic] = useState([]);
  const [point, setPoint] = useState(null);
  const [id, setId] = useState(null);
  const [level, setLevel] = useState(null);
  const isFocused = useIsFocused();
  const { token } = loginStore.getState();
  const [ownedBGI, setOwnedBGI] = useState([]); // 소유한 배경 ID 저장
  const [ownedBGM, setOwnedBGM] = useState([]); // 소유한 음악 ID 저장

  useFocusEffect(
    React.useCallback(() => {
      resetActiveText();
    }, [resetActiveText])
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
    try {
      const response = await axios.get('https://i11b304.p.ssafy.io/api/background/bgi', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
      if (response.status === 200) {
        setBackground(response.data);
        console.log("배경 리스트 저장");
      } else {
        console.log("배경 리스트 저장 실패");
      }
    } catch (error) {
      console.error("배경 리스트 요청 중 오류 발생:", error);
    }
  };

  const getMusic = async () => {
    try {
      const response = await axios.get('https://i11b304.p.ssafy.io/api/background/bgm', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
      if (response.status === 200) {
        setMusic(response.data);
        console.log("음악 리스트 저장");
      } else {
        console.log("음악 리스트 저장 실패");
      }
    } catch (error) {
      console.error("음악 리스트 요청 중 오류 발생:", error);
    }
  };

  const getPoint = async () => {
    try {
      const response = await axios.get(
        "https://i11b304.p.ssafy.io/api/members/my-info",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
          },
        }
      );
      if (response.status === 200) {
        setPoint(response.data.member.point);
        setId(response.data.member.id);
        setLevel(response.data.member.level);
        console.log("회원 정보 확인 성공");
      } else {
        console.log("회원 정보 확인 실패");
      }
    } catch (error) {
      console.error("회원 정보 요청 중 오류 발생:", error);
    }
  };

  const getOwnBGI = async () => {
    try {
      const response = await axios.get("https://i11b304.p.ssafy.io/api/background/own-bgi",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
          },
        },
      );
      if (response.status === 200) {
        setOwnedBGI(response.data.map(item => item.id)); // 소유한 배경 ID 목록 저장
        console.log('내 테마 리스트 로딩 성공');
      } else {
        console.log('내 테마 리스트 로딩 실패');
      }
    } catch (error) {
      console.error('내 테마 리스트 요청 중 오류 발생:', error);
    }
  };

  const getOwnBGM = async () => {
    try {
      const response = await axios.get("https://i11b304.p.ssafy.io/api/background/own-bgm",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
          },
        },
      );
      if (response.status === 200) {
        setOwnedBGM(response.data.map(item => item.id)); // 소유한 음악 ID 목록 저장
        console.log('내 음악 리스트 로딩 성공');
      } else {
        console.log('내 음악 리스트 로딩 실패');
      }
    } catch (error) {
      console.error('내 음악 리스트 요청 중 오류 발생:', error);
    }
  };

  const renderItem = ({ item }) => {
    const isOwned = activeText === 'text1'
      ? ownedBGI.includes(item.id)
      : ownedBGM.includes(item.id);

    return (
      <StoreBox
        name={item.name}
        {...(activeText === 'text1' ? { background: item } : { music: item })}
        point={point}
        id={id}
        level={level}
        isOwned={isOwned} // 소유 여부 전달
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
        <Text style={{ marginRight: 90 }}>
          내 포인트 {`${point} P`}
        </Text>
      </View>
      <FlatList
        data={activeText === 'text1' ? background : music}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginLeft: 75,
  },
});
