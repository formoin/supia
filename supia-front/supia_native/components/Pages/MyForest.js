import React, { useState, useEffect, panRef } from 'react'
import { View, Image, StyleSheet, Pressable, Modal, Text, Button, ImageBackground } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from "@react-navigation/native";
import BackgroundSetting from '../Organisms/BackgroundSetting'
import DictionaryForest from '../Organisms/DictionaryForest'
import axios from 'axios'
import { PanGestureHandler } from 'react-native-gesture-handler';
import useStore from '../store/useStore';

export default function MyForestScreen({memberId}) {
  const navigation = useNavigation();
  const [forestData, setForestData] = useState(null);
  const [isModalVisible1, setIsModalVisible1] = useState(false); // setting modal
  const [isModalVisible2, setIsModalVisible2] = useState(false); // dict modal
  const [showSticker, setShowSticker] = useState(false);
  const { droppedImages, updateImagePosition } = useStore();
  // const getForest = async () => {
  //   try {
  //       const response = await axios.get('http://i11b304.p.ssafy.io/api/forest');
  //        if (response.status === 200) {
  //             console.log(response.data)
  //             setForestData(response.data);
  //             console.log("숲 로딩 성공");
  //        } else {
  //             console.log("숲 로딩 실패");
  //        }
  //    } catch (error) {
  //        console.error("요청 중 오류 발생:", error);
  //    }
  // };

  // useEffect(() => {
  //   getForest();
  // }, []);


  const goSetting = () => {
    setIsModalVisible1(!isModalVisible1);
  };
  
  const goHome = () => {
    navigation.navigate("Home");
  };
  
  const goDictionary = () => {
    setIsModalVisible2(!isModalVisible2);
  };

  // 드래그 중인 이미지의 위치를 업데이트하는 핸들러
  const onGestureEvent = (event, index) => {
    const { translationX, translationY } = event.nativeEvent;
    updateImagePosition(index, translationX, translationY);
  };

  // 드래그가 끝났을 때의 핸들러
  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === 5) { // 5는 END 상태
      // 드래그가 끝난 후 위치를 store에 저장
      const { translationX, translationY } = event.nativeEvent;
      // `updateImagePosition` 함수로 store에 위치 업데이트
    }
  };

  console.log('droppedImages:', droppedImages);
  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../../assets/basic/forest_2.png')}
        style={styles.image}
      >
        {droppedImages.map((imageData, index) => (
          <PanGestureHandler
            key={index}
            onGestureEvent={(event) => onGestureEvent(event, index)}
            onHandlerStateChange={onHandlerStateChange}
            ref={panRef}
          >
            <View style={[styles.imageWrapper, {
              transform: [
                { translateX: imageData.position.x },
                { translateY: imageData.position.y },
              ],
            }]}>
              <Image
                source={{ uri: imageData.imageUri }}
                style={styles.sticker}
              />
            </View>
          </PanGestureHandler>
        ))}
      </ImageBackground>


      <Pressable style={styles.iconContainer} onPress={goSetting}>
        <Ionicons name="settings-outline" style={styles.settingicon} />
      </Pressable>
      <Pressable style={styles.iconContainer} onPress={goHome}>
        <Feather name="home" style={styles.homeicon} />
      </Pressable>
      <Pressable style={styles.iconContainer} onPress={goDictionary}>
        <Feather name="sidebar" style={styles.sideicon} />
      </Pressable>


      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible1}
        onRequestClose={goSetting}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <BackgroundSetting goSetting={goSetting} />
          </View>
        </View>
      </Modal>
      <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible2}
          onRequestClose={goDictionary} 
        >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <DictionaryForest goDictionary={goDictionary} showSticker={showSticker} setShowSticker={setShowSticker}

            />
          </View>
        </View>
      </Modal>

    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    position: 'absolute',
  },
  homeicon: {
    top: 20,
    left: 365,
    fontSize: 30,
    color: 'white',
    transform: [{ rotate: '90deg' }],
  },
  settingicon: {
    top: 20,
    left: 20,
    fontSize: 34,
    color: 'white',
    transform: [{ rotate: '90deg' }],
  },
  sideicon: {
    top: 770,
    left: 365,
    fontSize: 34,
    color: 'white',
    transform: [{ rotate: '90deg' }],
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems:"center",
  },
  modalContainer: {
    transform: [{ rotate: '90deg' }],
    // borderRadius: 32,
    // backgroundColor: '#FCFCFC',
    // padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
  },
  sticker: {
    width: 110, 
    height: 110,
    position: 'relative'
  }
});
