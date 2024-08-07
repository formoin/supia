import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from "react-native";
import Header from "../Atoms/Header";
import StoreBox from "../Organisms/StoreBox";
import Divide from "../Divide";
import useStore from '../store/useStore';
import axios from 'axios';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';

export default function StoreScreen() {
  const { activeText, setActiveText, resetActiveText } = useStore();
  const [background, setBackground] = useState(null);
  const [music, setMusic] = useState(null);
  const [point, setPoint] = useState(null);
  const isFocused = useIsFocused();

  useFocusEffect(
    React.useCallback(() => {
      resetActiveText();
    }, [resetActiveText])
  );

  useEffect(() => {
    getPoint();
    if (activeText === 'text1') {
      getBackground();
    } else if (activeText === 'text2') {
      getMusic();
    }
  }, [activeText]);

  const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMEBzc2FmeS5jb20iLCJtZW1iZXJJZCI6MSwiaWF0IjoxNzIzMDAxNzU2LCJleHAiOjE3NTQ1Mzc3NTZ9.yQ_IgYEQzmf5O2_csfB095x3RcWrxdJynXGy6XqJT3Zc5-tQ-sSs4ycdMCxwKiWgj1_m8L83O3kKibIi7x0JJA';
  const memberId = 1;

  const getBackground = async () => {
    try {
      const response = await axios.get('https://i11b304.p.ssafy.io/api/background/bgm', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
      if (response.status === 200) {
        console.log(response.data);
        setBackground(response.data);
        console.log("배경 리스트 저장");
      } else {
        console.log("배경 리스트 저장 실패");
      }
    } catch (error) {
      console.error("요청 중 오류 발생:", error);
    }
  };

  const getMusic = async () => {
    try {
      const response = await axios.get('https://i11b304.p.ssafy.io/api/background/bgi', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
      if (response.status === 200) {
        console.log(response.data);
        setMusic(response.data);
        console.log("음악 리스트 저장");
      } else {
        console.log("음악 리스트 저장 실패");
      }
    } catch (error) {
      console.error("요청 중 오류 발생:", error);
    }
  };

  const getPoint = async () => {
    try {
      const response = await axios.get(
        `https://i11b304.p.ssafy.io/api/members/my-info/${memberId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
          },
        }
      );
      if (response.status === 200) {
//        console.log(response.data);
//        setPoint(response.data.member.point);
        console.log("회원 정보 확인 성공");
      } else {
        console.log("회원 정보 확인 실패");
      }
    } catch (error) {
      console.error("요청 중 오류 발생:", error);
    }
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
      {activeText === 'text1' && (
        <StoreBox name="희망의 숲" />
      )}
      {activeText === 'text2' && (
        <StoreBox name="모닥불 타는 소리" />
      )}
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
