import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../Atoms/Header';
import DicDivide from '../DicDivide';
import Card from '../Atoms/Card';
import useStore from '../store/useStore';
import axios from 'axios';
import {Server_IP} from '@env';
import loginStore from '../store/useLoginStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DictionaryScreen() {
  const {activeDic, resetActiveDic} = useStore();
  const [speciesList, setSpeciesList] = useState([]);

  // api
  const fetchSpeciesData = async category => {
    const token = await AsyncStorage.getItem('key');
    try {
      const response = await axios.get(`${Server_IP}/items`, {
        headers: {
          Authorization: `Bearer ${token}`, // Authorization 헤더에 토큰 추가
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
        params: {
          category: category,
        },
        timeout: 5000,
      });
      // 성공적인 응답 처리
      if (response.status === 200) {
        // const speciesList = response.data;
        setSpeciesList(response.data);
        console.log('도감 성공', category, response.data);
        return speciesList;
      }
    } catch (error) {
      // 오류 처리
      if (error.response) {
        // 서버가 응답했지만 오류 코드가 있는 경우
        // console.error('Error:', error.response.data);
        if (error.response.status === 400) {
          console.error('도감 로딩 실패');
        }
      } else {
        console.error('Network Error:', error.message);
      }
    }
  };
  // useEffect를 사용하여 activeDic이 변경될 때마다 API 호출
  useEffect(() => {
    const categoryMap = {
      text1: '식물',
      text2: '동물',
      text3: '곤충',
      text4: '기타',
    };

    const category = categoryMap[activeDic];

    if (category) {
      fetchSpeciesData(category); // API 호출
    }
  }, [activeDic]); // activeDic이 변경될 때마다 호출

  const renderCard = () => {
    return (
      <View style={styles.Cardcontainer}>
        {speciesList.map(species => (
          <Card
            key={species.id}
            representativeImg={species.representativeImg}
            speciesName={species.speciesName}
            id={species.id}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header label="나의 자연 도감" />
      <View style={styles.p_value}>
        <DicDivide
          text1="식물"
          text2="동물"
          text3="곤충"
          text4="기타"
          style={styles.searchbar}
        />
      </View>

      <ScrollView>{renderCard()}</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  p_value: {
    padding: 20,
    // alignItems: 'center',
    paddingTop: 30,
  },
  Cardcontainer: {
    flexDirection: 'row', // 기본 방향을 수평으로 설정
    flexWrap: 'wrap', // 자식들이 줄을 넘어가도록 설정
    justifyContent: 'flex-start', // 카드들 사이에 동일한 간격 유지
    padding: 10,
  },
});
