import React, {useState, useEffect} from 'react';
import Header from '../Atoms/Header';
import useStore from '../store/useStore';
import DicDivide from '../DicDivide';
import Card from '../Atoms/Card';
import Octicons from 'react-native-vector-icons/Octicons';
import { View, StyleSheet, Pressable, ScrollView, Button } from 'react-native';
import DictionarySticker from './DictionarySticker'
import {Server_IP, WS_IP, TURN_URL, TURN_ID, TURN_CREDENTIAL} from '@env';
import axios from 'axios';
import loginStore from '../store/useLoginStore';

export default function DictionaryForest({goDictionary, showSticker, setShowSticker}) {
  const {activeDic, resetActiveDic} = useStore();
  const [speciesList, setSpeciesList] = useState([]);
  const { token } = loginStore.getState() 

  // api
  const fetchSpeciesData = async (category) => {
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
      });
      // 성공적인 응답 처리
      if (response.status === 200) {
          // const speciesList = response.data;
          setSpeciesList(response.data)
          console.log(response.data)
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
      text1: 1,
      text2: 2,
      text3: 3,
      text4: 4,
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
            mini={true}
            setShowSticker={setShowSticker}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
        <View style={styles.headerContainer}>
            <Header label="나의 도감" noback='noback'/>
            <Pressable onPress={goDictionary} style={styles.closeButton}>
              <Octicons name="x" size={30} style={styles.closeIcon} />
            </Pressable>
        </View>
          <View style={styles.p_value}>
            <DicDivide
              text1="식물"
              text2="동물"
              text3="곤충"
              text4="기타"
            />
          </View>
        <ScrollView>
          {renderCard()}
        </ScrollView>

        {showSticker && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
          <DictionarySticker 
            setShowSticker={setShowSticker} 
            speciesName={showSticker.speciesName}
          />
          </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 362,
    height: 408,
    borderRadius: 32,
    backgroundColor: '#FCFCFC',
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    paddingRight: 20
  },
  closeButton: {
    padding: 7,
  },
  closeIcon: {
    color: 'black',
  },
  p_value: {
    padding: 20,
    alignItems: 'center',
    paddingTop: 30,
  },
  Cardcontainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // 자식들이 줄을 넘어가도록 설정
    justifyContent: 'flex-start',
    padding: 10,
  },
});
