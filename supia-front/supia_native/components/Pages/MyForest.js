import React, { useState, useEffect, useRef } from 'react'
import { View, Image, StyleSheet, Pressable, Modal, Text, Button, ImageBackground } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from "@react-navigation/native";
import BackgroundSetting from '../Organisms/BackgroundSetting'
import DictionaryForest from '../Organisms/DictionaryForest'
import axios from 'axios'
import { PanGestureHandler } from 'react-native-gesture-handler';
import useStore from '../store/useStore';
import Popup from '../Popup';
import {Server_IP, WS_IP, TURN_URL, TURN_ID, TURN_CREDENTIAL} from '@env';

const token =
'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMTFAbmF2ZXIuY29tIiwibWVtYmVySWQiOjcsImlhdCI6MTcyMzA3NDgwMSwiZXhwIjoxNzU0NjEwODAxfQ.2bMm_t46dnLK6MlmQJHvQAfBLdPvPK7m38xpLsJwj55d-lb91ZEYaLb8aK8YwiYfG3Ip_ho05HMcWNFDgp2xmA'

export default function MyForestScreen() {
  const navigation = useNavigation();
  const [isModalVisible1, setIsModalVisible1] = useState(false); // setting modal
  const [isModalVisible2, setIsModalVisible2] = useState(false); // dict modal
  const [showSticker, setShowSticker] = useState(false);

  const { droppedImages, updateImagePosition, setDroppedImages, setForestId } = useStore();
  const [bgiData, setBgiData] = useState(null);
  const [bgmData, setBgmData] = useState(null);

  const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwMDAwQG5hdmVyLmNvbSIsIm1lbWJlcklkIjo2LCJpYXQiOjE3MjMwMzMwNzUsImV4cCI6MTc1NDU2OTA3NX0.g8jpiTc7tLMNf_QvYq5SLLsIA1REIKPyl37c1w0OYXAGDJ6JOuDjDxh0zO8zORd0EZNgl2ADyEXaw6KmZ3lWwQ'

   const getForest = async () => {
     try {
         const response = await axios.get('https://i11b304.p.ssafy.io/api/forest',{
           headers: {
             Authorization: `Bearer ${token}`, // Authorization 헤더에 토큰 추가
             Accept: 'application/json',
                 'Content-Type': 'application/json; charset=utf-8',
             },
         });
          if (response.status === 200) {
               console.log(response.data)
               setForestId(data.forestId)
              console.log("숲 로딩 성공");
              console.log(data)
              const images = data.items.map(item => ({
                itemId: item.itemId,
                imageUrl: item.imgUrl,
                position: {
                  x: item.x,
                  y: item.y,
                },
              }));
            setDroppedImages(images);
          } else {
               console.log("숲 로딩 실패");
          }
      } catch (error) {
          console.error("숲 요청 중 오류 발생:", error);
      }
   };

  const getOwnBGI= async () => {
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
        console.log(response.data);
        setBgiData(response.data);
        console.log('내 테마 리스트 로딩 성공');
      } else {
        console.log('내 테마 리스트 로딩 실패');
      }
    } catch (error) {
      console.error('내 테마 리스트 요청 중 오류 발생:', error);
    }
  };

  const getOwnBGM= async () => {
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
        console.log(response.data);
        setBgiData(response.data);
        console.log('내 음악 리스트 로딩 성공');
      } else {
        console.log('내 음악 리스트 로딩 실패');
      }
    } catch (error) {
      console.error('내 음악 리스트 요청 중 오류 발생:', error);
    }
  }

   useEffect(() => {
     getForest();
     getOwnBGI();
     getOwnBGM();
   }, []);

//   useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', () => {
//         getForest();
//     });

//     // 컴포넌트 언마운트 시 리스너 제거
//     return unsubscribe;
// }, [navigation]);


  // 저장 팝업
  const [savePopupVisible, setSavePopupVisible] = useState(false);
  const handleOpenSavePopup = () => {
    setSavePopupVisible(true); // 팝업 열기
  };
  const handleCloseSavePopup = () => {
    setSavePopupVisible(false); // 팝업 닫기
    navigation.navigate("Home");
  };

  
  const goSetting = () => {
    setIsModalVisible1(!isModalVisible1);
  };
  
  const goHome = () => {
    handleOpenSavePopup()
    // navigation.navigate("Home");
  };
  
  const goDictionary = () => {
    setIsModalVisible2(!isModalVisible2);
  };


  const [draggedPosition, setDraggedPosition] = useState(null);

  // 드래그 중인 이미지의 위치를 업데이트하는 핸들러
  const onGestureEvent = (itemId) => (event) => {
    const { translationX, translationY } = event.nativeEvent;
    const droppedImage = droppedImages.find(img => img.itemId === itemId)
    setDraggedPosition({
      itemId,
      x: droppedImage.position.x + translationX,
      y: droppedImage.position.y + translationY,
    });
  };

  // 드래그가 끝났을 때의 핸들러
  const onHandlerStateChange = (itemId) => (event) => {
    if (event.nativeEvent.state === 5) { // 'end' 상태
      const { translationX, translationY } = event.nativeEvent;
      updateImagePosition(itemId, translationX, translationY);
      setDraggedPosition(null);
    }
  };

  // console.log('droppedImages:', droppedImages);
  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../../assets/basic/forest_2.png')}
        style={styles.image}
      >
        {droppedImages.map((imageData, index) => (
          <PanGestureHandler
          key={imageData.itemId}
          onGestureEvent={onGestureEvent(imageData.itemId)}
          onHandlerStateChange={onHandlerStateChange(imageData.itemId)}
        >
          <View
            style={[
              styles.imageWrapper,
              {
                transform: [
                  { translateX: draggedPosition?.itemId === imageData.itemId ? draggedPosition.x : imageData.position.x },
                  { translateY: draggedPosition?.itemId === imageData.itemId ? draggedPosition.y : imageData.position.y },
                ],
              },
            ]}
          >
            <Image
              source={{ uri: imageData.imageUrl }}
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

      {/* 저장 */}
      <Modal
        transparent={true}
        visible={savePopupVisible}
        onRequestClose={handleCloseSavePopup}>
        <View style={styles.modalBackground}>
          <Popup
            content="저장하시겠습니까?"
            onClose={handleCloseSavePopup}
            when='save'
            onDeleteSuccess={handleCloseSavePopup}
          />
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
