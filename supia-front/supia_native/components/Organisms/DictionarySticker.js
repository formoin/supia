import React, {useState, useEffect} from 'react';
import Header from '../Atoms/Header';
import useStore from '../store/useStore';
import Octicons from 'react-native-vector-icons/Octicons';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import {
  GestureHandlerRootView,
  LongPressGestureHandler,
} from 'react-native-gesture-handler';
import axios from 'axios';
// import loginStore from "../store/useLoginStore";
import {Server_IP} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DictionarySticker({id, setShowSticker, speciesName}) {
  const {
    droppedImages,
    addDroppedImage,
    removeDroppedImage,
    setDroppedImages,
    getS3Url,
    playSound,
  } = useStore();
  const [speciesDetail, setSpeciesDetail] = useState(null);
  const [playingSound, setPlayingSound] = useState(null); // 현재 재생 중인 음원 ID 저장

  // const { token } = loginStore.getState();
  const position = {x: -400, y: 5};

  const isImageUsed = itemId => {
    return droppedImages.some(img => img.itemId === itemId);
  };

  const onLongPress = Id => () => {
    const item = speciesDetail.items.find(item => item.id === Id);
    const imgUrl = item.imgUrl;
    const itemId = item.id;
    const soundOn = item.soundOn;
    if (!isImageUsed(itemId)) {
      addDroppedImage(itemId, imgUrl, position, soundOn);
      console.log('추가', droppedImages);
    } else {
      removeDroppedImage(itemId);
      console.log('빼기', droppedImages);
    }
  };

  // API 호출 함수
  const fetchSpeciesDetail = async speciesId => {
    const token = await AsyncStorage.getItem('key');

    try {
      const response = await axios.get(`${Server_IP}/items/detail`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
        params: {
          speciesId: speciesId,
        },
      });
      if (response.status === 200) {
        console.log('도감 상세 성공:', response.data); // API 응답 데이터 콘솔에 출력
        setSpeciesDetail(response.data);
      }
    } catch (error) {
      if (error.response) {
        console.error('도감 상세 API Error:', error);
        if (error.response.status === 400) {
          console.error('종 세부정보 로딩 실패');
        }
      } else {
        console.error('Network Error:', error.message);
      }
    }
  };

  useEffect(() => {
    fetchSpeciesDetail(id); // speciesName으로 API 호출
  }, [id]);

  //소리
  const toggleSound = id => {
    const updatedDroppedImages = droppedImages.map(item => {
      if (item.itemId === id) {
        const newSoundState = item.soundOn === 0 ? 1 : 0; // 새로운 사운드 상태
        updateSoundStatus(id, newSoundState); // 서버에 업데이트
        console.log(
          `아이템 ${id}의 사운드 상태: ${newSoundState ? '켜짐' : '꺼짐'}`,
        );
        return {...item, soundOn: newSoundState}; // 새로운 사운드 상태를 가진 아이템 반환
      }
      return item; // 다른 아이템은 그대로 반환
    });

    setDroppedImages(updatedDroppedImages); // 상태 업데이트
  };

  const updateSoundStatus = async (id, soundOn) => {
    const token = await AsyncStorage.getItem('key');

    console.log(id, soundOn);
    try {
      const response = await axios.patch(
        `${Server_IP}/forest`,
        {
          itemId: id,

          soundOn: soundOn,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
          },
        },
      );

      console.log('소리 상태가 업데이트되었습니다:');
    } catch (error) {
      console.error('소리 상태 업데이트 중 오류 발생:', error);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.headerContainer}>
        <Header label="나의 도감" goto="MyForest" />
        <Pressable onPress={() => setShowSticker(false)} style={{padding: 7}}>
          <Octicons name="x" size={30} style={styles.closeIcon} />
        </Pressable>
      </View>
      <Text style={styles.speciesName}>{speciesName}</Text>

      <ScrollView contentContainerStyle={styles.Cardcontainer}>
        {speciesDetail?.items.map(item => {
          // 각 아이템의 isImageUsed를 계산합니다.
          const used = isImageUsed(item.id);
          const foundItem = droppedImages.find(
            droppedItem => droppedItem.itemId === item.id,
          );

          return (
            <View key={item.id} style={[styles.card, used && styles.usedCard]}>
              <LongPressGestureHandler onActivated={onLongPress(item.id)}>
                <View style={styles.sticker}>
                  <Image
                    source={{uri: item.imgUrl}}
                    style={{
                      width: 110,
                      height: 110,
                      marginVertical: 4,
                      transform: [{rotate: '90deg'}],
                    }}
                  />

                  {used && (
                    <Pressable
                      onPress={() => toggleSound(item.id)}
                      style={styles.soundButton}>
                      <Text style={styles.soundButtonText}>
                        {foundItem ? (foundItem.soundOn ? '🔊' : '🔇') : '🔇'}
                      </Text>
                    </Pressable>
                  )}
                </View>
              </LongPressGestureHandler>
              <Text>{item.acquireDate}</Text>
            </View>
          );
        })}
      </ScrollView>
    </GestureHandlerRootView>
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
    paddingRight: 20,
  },
  Cardcontainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // 자식들이 줄을 넘어가도록 설정
    justifyContent: 'flex-start',
  },
  card: {
    width: '30%',
    height: 150,
    borderRadius: 10, // border-radius: 10px;
    borderWidth: 1,
    margin: 5,
    alignItems: 'center',
  },
  speciesName: {
    fontSize: 25, // Adjust the size as needed
    textAlign: 'center',
    marginVertical: 10,
  },
  soundButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'transparent', // 투명 배경
    padding: 5,
  },
  soundButtonText: {
    fontSize: 20, // 아이콘 크기
  },
  usedCard: {
    borderWidth: 3, // 두꺼운 경계선
    borderColor: 'green', // 원하는 색상으로 변경
  },
});
