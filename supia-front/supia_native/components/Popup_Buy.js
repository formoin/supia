import React from 'react';
import {View, Text, StyleSheet, Pressable, Image} from 'react-native';
import Button from './Atoms/Button_Green';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import useStore from './store/useStore';
import loginStore from './store/useLoginStore';
import {Server_IP} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Popup_Buy = ({
  goBuy,
  background,
  music,
  point,
  id,
  getPoint,
  getBackground,
  getMusic,
  getOwnBGI,
  getOwnBGM,
}) => {
  const {activeText} = useStore();
  // const {token} = loginStore.getState();
  const {getS3Url} = useStore();

  const sendThemeData = async () => {
    const token = await AsyncStorage.getItem('key');
    try {
      const response = await axios.get(`${Server_IP}/background/purchase/bgi`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
        params: {
          bgiId: background.id,
        },
      });

      if (response.status === 200) {
        getPoint();
        getBackground();
        getOwnBGI();

        console.log('테마 구매 정보 저장 성공');
      } else {
        console.log('테마 구매 정보 저장 실패');
      }
    } catch (error) {
      console.error('테마 구매 정보 저장 중 오류 발생:', error);
      alert('포인트가 부족합니다!');
    }
  };

  const sendMusicData = async () => {
    const token = await AsyncStorage.getItem('key');
    try {
      const response = await axios.get(`${Server_IP}/background/purchase/bgm`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
        params: {
          bgmId: music.id,
        },
      });

      if (response.status === 200) {
        getPoint();
        getMusic();
        getOwnBGM();

        console.log('음악 구매 정보 저장 성공');
      } else {
        console.log('음악 구매 정보 저장 실패');
      }
    } catch (error) {
      console.error('음악 구매 정보 저장 중 오류 발생:', error);
    }
  };

  const item = activeText === 'text1' ? background : music;
  const isBackground = activeText === 'text1';

  const handleBuyPress = async () => {
    goBuy();
    if (activeText === 'text1') {
      sendThemeData();
    } else if (activeText === 'text2') {
      sendMusicData();
    }
  };

  return (
    <View style={styles.modalView}>
      <View style={styles.header}>
        <Text style={styles.modalText}>
          {isBackground ? '배경사진' : '배경음악'}
        </Text>
        <Pressable onPress={goBuy}>
          <Octicons name="x" size={30} style={styles.closeIcon} />
        </Pressable>
      </View>
      {isBackground ? (
        <View style={styles.imageContainer}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Image source={{uri: getS3Url(item.path)}} style={styles.image} />
        </View>
      ) : (
        <View style={styles.musicContainer}>
          <FontAwesome name="file-sound-o" size={60} style={styles.soundIcon} />
          <Text style={styles.musicName}>{item.name}</Text>
        </View>
      )}
      <Text style={styles.text}>필요 Point: {item.price} P</Text>
      <Text style={styles.text}>내 Point: {point} P</Text>
      <Button label="구매하기" onPress={handleBuyPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  modalView: {
    width: 260,
    height: 350,
    borderRadius: 3,
    borderColor: 'rgba(0, 0, 0, 0.10)',
    backgroundColor: 'rgba(225, 219, 203, 0.90)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
    flex: 1,
    marginLeft: 30,
  },
  closeIcon: {
    paddingHorizontal: 10,
    marginRight: 5,
  },
  imageContainer: {
    width: 200,
    height: 160,
    borderRadius: 20,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    padding: 10,
  },
  itemName: {
    fontSize: 16,
    color: 'black',
    marginBottom: 10,
  },
  image: {
    width: 180,
    height: 120,
    borderRadius: 10,
  },
  musicContainer: {
    width: 200,
    height: 130,
    borderRadius: 20,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  soundIcon: {
    color: 'black',
  },
  musicName: {
    fontSize: 16,
    color: 'black',
    marginTop: 10,
  },
  text: {
    marginBottom: 10,
    fontSize: 16,
  },
});

export default Popup_Buy;
