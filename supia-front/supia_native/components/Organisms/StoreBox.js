
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  Button,
  TouchableOpacity,
} from 'react-native';
import Button_Green from '../Atoms/Button_Green';
import Button_Red from '../Atoms/Button_Red';
import Line from '../Atoms/Line';
import Popup_Buy from '../Popup_Buy';
import useStore from '../store/useStore';

import Entypo from 'react-native-vector-icons/Entypo';
import Sound from 'react-native-sound'


export default function StoreBox({ name, background, music, point, id, level, isOwned, getPoint,
 getBackground, getMusic, getOwnBGI, getOwnBGM }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { getS3Url } = useStore();
  const [isPlaying, setIsPlaying] = useState(false); // 음악 재생 상태
  const { playSound, playingSoundId } = useStore((state) => ({
    playSound: state.playSound,
    playingSoundId: state.playingSoundId,
  }));

  const levelNames = {
    0: '씨앗',
    1: '새싹',
    2: '잎새',
    3: '꽃',
    4: '열매',
  };

  const isBackground = Boolean(background);
  const item = isBackground ? background : music;

  const goBuy = () => {
    if (point - item.price < 0) {
      alert('포인트가 부족합니다!');
      console.log(point - item.price);
    } else {
      setIsModalVisible(!isModalVisible);
    }
  };

  // 음악 재생 및 정지 기능
  useEffect(() => {
    // 현재 아이템이 재생 중인지 여부를 결정
    setIsPlaying(playingSoundId === item.id);
  }, [playingSoundId, item.id]);

  const toggleSound = () => {
    const url = getS3Url(item.path);

    if (isPlaying) {
      // 음악이 재생 중일 때 클릭하면 음악을 멈추고 상태 초기화
      setIsPlaying(false);
      playSound('', item.id); // 소리 멈추기
    } else {
      // 음악이 재생 중이 아닐 때 클릭하면 새로운 음악을 재생
      setIsPlaying(true);
      playSound(url, item.id, () => setIsPlaying(false)); // 음악 재생 후 상태 업데이트
    }
  };

  return (
    <View>
      <View style={styles.container}>
        {isBackground ? (

          <Image
            source={{ uri: getS3Url(item.path) }}
            style={styles.image}
          />
        ) : (
          <TouchableOpacity onPress={toggleSound}>
            <Entypo name={isPlaying ? "controller-paus" : "beamed-note"} size={35} color="black" />
          </TouchableOpacity>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.textbig}>{name}</Text>
          <Text style={styles.textsmall}>{item.price} P</Text>
        </View>
        <View style={styles.button}>

          {level >= item.level && !isOwned && (
            <Button_Green label="구매하기" onPress={goBuy} />
          )}
          {isOwned && (
            <Button_Red label="구매완료" />
          )}
          {level < item.level && !isOwned && (
            <TouchableOpacity style={styles.disabledButton} disabled={true}>
              <Text style={styles.disabledButtonText}>Lv.{levelNames[item.level]}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.line}>
        <Line />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}

        onRequestClose={goBuy}
      >
        <View style={styles.popupContainer}>
          <View style={styles.popup}>
            <Popup_Buy goBuy={goBuy} background={background} music={music} point={point} id={id} getPoint={getPoint}
             getBackground={getBackground} getMusic={getMusic} getOwnBGI={getOwnBGI} getOwnBGM={getOwnBGM} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 15,
    backgroundColor: 'lightgray',
    marginRight: 12,
    marginLeft: 15,
  },
  soundIcon: {
    color: 'black',
    marginRight: 12,
    marginLeft: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 15,
  },
  textbig: {
    fontSize: 18,
    marginBottom: 8,
  },
  textsmall: {
    fontSize: 16,
  },
  button: {
    marginRight: 20,
  },
  disabledButton: {
    width: 72,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 5,
    backgroundColor: 'lightgray',
    paddingBottom: 3,
  },
  disabledButtonText: {
    color: 'darkgray',
  },
  line: {
    alignItems: 'center',
  },
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: to dim the background
  },
  popup: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
