import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Pressable,
  Modal,
  Text,
  Dimensions,
  ImageBackground,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import BackgroundSetting from '../Organisms/BackgroundSetting';
import DictionaryForest from '../Organisms/DictionaryForest';
import axios from 'axios';
import {PanGestureHandler} from 'react-native-gesture-handler';
import useStore from '../store/useStore';
import Popup from '../Popup';
import loginStore from '../store/useLoginStore';
import ViewShot from 'react-native-view-shot';
import Sound from 'react-native-sound';
import {Server_IP} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageResizer from 'react-native-image-resizer';

const {width, height} = Dimensions.get('window');

export default function MyForestScreen() {
  // const {token} = loginStore.getState();
  const navigation = useNavigation();
  const [isModalVisible1, setIsModalVisible1] = useState(false); // setting modal
  const [isModalVisible2, setIsModalVisible2] = useState(false); // dict modal
  const [showSticker, setShowSticker] = useState(false);
  // 캡쳐를 위해 버튼 숨기기
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const CaptureRef = useRef(null);
  const soundRef = useRef(null);

  const {
    droppedImages,
    updateImagePosition,
    setDroppedImages,
    setForestId,
    forestId,
    getS3Url,
    BGI,
    setBGI,
    BGM,
    setBGM,
    thumbnail,
  } = useStore();

  const [forestData, setForestData] = useState(null);
  const [bgiData, setBgiData] = useState(null);
  const [bgmData, setBgmData] = useState(null);
  const setForestImageUri = useStore(state => state.setForestImageUri);

  // 숲 정보 불러오기
  const getForest = async () => {
    const token = await AsyncStorage.getItem('key');

    console.log(droppedImages);

    try {
      const response = await axios.get(`${Server_IP}/forest`, {
        headers: {
          Authorization: `Bearer ${token}`, // Authorization 헤더에 토큰 추가
          Accept: 'application/json',

          'Content-Type': 'application/json; charset=utf-8',
        },
      });
      if (response.status === 200) {
        const data = response.data;
        console.log(data);
        console.log('숲 로딩 성공');
        setForestId(data.forestId);
        setBGI(data.bgi);
        setBGM(data.bgm);
        setForestData(data);
        const images = data.items.map(item => ({
          itemId: item.itemId,
          imageUrl: item.imgUrl,
          soundOn: item.soundOn,
          position: {
            x: item.x,
            y: item.y,
          },
        }));
        setDroppedImages(images);
      } else {
        console.log('숲 로딩 실패');
      }
    } catch (error) {
      console.error('숲 요청 중 오류 발생 :', error);
    }
  };

  // 보유 중인 BGI 불러오기
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
        // console.log(response.data);
        setBgiData(response.data);
        console.log('내 테마 리스트 로딩 성공');
      } else {
        console.log('내 테마 리스트 로딩 실패');
      }
    } catch (error) {
      console.error('내 테마 리스트 요청 중 오류 발생:', error);
    }
  };

  console.log(droppedImages);
  // 보유 중인 BGM 불러오기
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
        console.log(response.data);
        setBgmData(response.data);
        console.log('내 음악 리스트 로딩 성공');
      } else {
        console.log('내 음악 리스트 로딩 실패');
      }
    } catch (error) {
      console.error('내 음악 리스트 요청 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getForest();
      getOwnBGI();
      getOwnBGM();
    });
    // 컴포넌트 언마운트 시 리스너 제거
    return unsubscribe;
  }, [navigation]);

  // 저장 팝업
  const [savePopupVisible, setSavePopupVisible] = useState(false);

  const handleOpenSavePopup = () => {
    setSavePopupVisible(true); // 팝업 열기
  };

  const handleSave = async uri => {
    const token = await AsyncStorage.getItem('key');
    // 숲 상태 저장
    const payload = {
      bgm: BGM,
      bgi: BGI,
      forestId,
      thumbnail: uri,
      forestItemSettingRequestList: droppedImages.map(({itemId, position}) => ({
        itemId,
        x: position.x,
        y: position.y,
      })),
    };
    console.log('payload', payload);

    try {
      const response = await axios.post(`${Server_IP}/forest`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
      if (response.status === 200) {
        console.log('아이템 배치 저장 성공');
        setDroppedImages([])
      } else {
        console.log('아이템 배치 저장 실패');
      }
    } catch (error) {
      console.error('아이템 배치 요청 중 실패', error);
    }
    setBGM(null)
    navigation.navigate('Home');
  };

  const handleCloseSavePopup = async () => {
    setSavePopupVisible(false); // 팝업 닫기
    setIsButtonVisible(false); // 썸네일 찍기 전에 버튼 숨기기
    // 사진 찍기
    try {
      if (CaptureRef.current) {
        const uri = await CaptureRef.current.capture();
        console.log('Capture complete...', uri);
        const rotatedImage = await ImageResizer.createResizedImage(uri, 1450, 720, 'JPEG', 100, 270);
        handleSave(rotatedImage.uri);
      } else {
        console.log('Ref 렌더링 오류');
      }
    } catch (error) {
      console.error('Capture failed:', error);
    }
    // navigation.navigate('Home');
  };

  const handleCloseandNOSavePopup = async () => {
    setSavePopupVisible(false); // 팝업 닫기
    navigation.navigate('Home');
  };

  const goSetting = () => {
    setIsModalVisible1(!isModalVisible1);
  };

  const goHome = () => {
    setBGM(null)
    handleOpenSavePopup();
    // navigation.navigate("Home");
  };

  const goDictionary = () => {
    setIsModalVisible2(!isModalVisible2);
  };

  const [draggedPosition, setDraggedPosition] = useState(null);

  // 드래그 중인 이미지의 위치를 업데이트하는 핸들러
  const onGestureEvent = itemId => event => {
    const {translationX, translationY} = event.nativeEvent;
    const droppedImage = droppedImages.find(img => img.itemId === itemId);
    setDraggedPosition({
      itemId,
      x: droppedImage.position.x + translationX,
      y: droppedImage.position.y + translationY,
    });
  };

  // 드래그가 끝났을 때의 핸들러
  const onHandlerStateChange = itemId => event => {
    if (event.nativeEvent.state === 5) {
      // 'end' 상태
      const {translationX, translationY} = event.nativeEvent;
      updateImagePosition(itemId, translationX, translationY);
      setDraggedPosition(null);
    }
  };

  useEffect(() => {
    const handleSound = () => {
        if (soundRef.current) {
            // 이전 사운드를 정리
            soundRef.current.stop(() => {
                // release를 호출하기 전에 null 체크
                if (soundRef.current) {
                    soundRef.current.release();
                    soundRef.current = null;
                }

                // 새로운 사운드가 있으면 재생
                if (BGM) {
                    loadAndPlaySound();
                }
            });
        } else if (BGM) {
            // 현재 사운드가 없고 BGM이 있을 때 새로운 사운드 객체 생성
            loadAndPlaySound();
        }
    };

    const loadAndPlaySound = () => {
        const sound = new Sound(BGM, null, (error) => {
            if (error) {
                console.log('Failed to load the sound', error);
                return;
            }
            sound.play((success) => {
                if (success) {
                    console.log('Sound played successfully');
                } else {
                    console.log('Playback failed');
                }
                // release를 호출하기 전에 null 체크
                if (soundRef.current) {
                    soundRef.current.release();
                    soundRef.current = null;
                }
            });
        });

        soundRef.current = sound;
    };

    handleSound();

    // 컴포넌트 언마운트 시 사운드 정리
    return () => {
        if (soundRef.current) {
            soundRef.current.stop(() => {
                // release를 호출하기 전에 null 체크
                if (soundRef.current) {
                    soundRef.current.release();
                    soundRef.current = null;
                }
            });
        }
    };
}, [BGM]);

  // 아이템 소리
  const soundRefs = useRef({});
  const playItemSound = (itemId, url) => {
    if (soundRefs.current[itemId]) {
      soundRefs.current[itemId].release(); // 기존 사운드 객체 해제
      soundRefs.current[itemId] = null; // 참조 초기화
    }
    // 새로운 사운드 객체 생성 및 재생
    const sound = new Sound(url, null, error => {
      if (error) {
        console.log('Failed to load the item sound', error);
        return;
      }
      soundRefs.current[itemId] = sound;
      sound.play(success => {
        if (success) {
          console.log('Item sound played successfully');
        } else {
          console.log('Item sound playback failed');
        }
      });
    });
  };

  const stopItemSound = itemId => {
    if (soundRefs.current[itemId]) {
      soundRefs.current[itemId].stop(() => {
        console.log('Item sound stopped');
        soundRefs.current[itemId].release(); // 사운드 객체 해제
        soundRefs.current[itemId] = null; // 참조 초기화
      });
    }
  };

  useEffect(() => {
    if (forestData && forestData.items) {
      // forestData와 items가 존재하는지 확인
      droppedImages.forEach(item => {
        const soundInfo = forestData.items.find(
          sound => sound.itemId === item.itemId,
        );
        if (soundInfo) {
          if (item.soundOn === 1 || item.soundOn === true) {
            playItemSound(item.itemId, soundInfo.soundUrl); // 사운드 재생
          } else {
            stopItemSound(item.itemId); // 사운드 중지
          }
        }
      });
    } else {
      console.log('forestData or forestData.items is null or undefined');
    }
    return () => {
      // 컴포넌트가 언마운트되면 모든 사운드를 정리
      Object.keys(soundRefs.current).forEach(itemId => {
        soundRefs.current[itemId].release();
      });
    };
  }, [droppedImages]);

  return (
    <View style={styles.container}>
      {BGI ? (
        <ViewShot
          ref={CaptureRef}
          options={{format: 'png', quality: 0.9}}
          collapsable={false}>
          <ImageBackground
            source={{uri: getS3Url(BGI)}} // S3 URL 변환
            style={styles.image}
            resizeMode="stretch">
            {droppedImages.map((imageData, index) => (
              <PanGestureHandler
                key={imageData.itemId}
                onGestureEvent={onGestureEvent(imageData.itemId)}
                onHandlerStateChange={onHandlerStateChange(imageData.itemId)}>
                <View
                  style={[
                    styles.imageWrapper,
                    {
                      transform: [
                        {
                          translateX:
                            draggedPosition?.itemId === imageData.itemId
                              ? draggedPosition.y
                              : imageData.position.y,
                        },
                        {
                          translateY:
                            draggedPosition?.itemId === imageData.itemId
                              ? -draggedPosition.x
                              : -imageData.position.x,
                        },
                      ],
                    },
                  ]}>
                  <Image
                    source={{uri: imageData.imageUrl}}
                    style={styles.sticker}
                  />
                </View>
              </PanGestureHandler>
            ))}
          </ImageBackground>
        </ViewShot>
      ) : (
        <Text>숲을 로딩 중입니다...</Text>
      )}

      <Pressable
        style={styles.iconContainer}
        onPress={goSetting}
        visible={isButtonVisible}>
        <Ionicons name="settings-outline" style={styles.settingicon} />
      </Pressable>
      <Pressable
        style={styles.iconContainer}
        // onPress={goHome}
        visible={isButtonVisible}>
        <Feather name="home" style={styles.homeicon} onPress={goHome}/>
      </Pressable>
      <Pressable
        style={styles.iconContainer}
        // onPress={goDictionary}
        visible={isButtonVisible}>
        <Feather name="sidebar" style={styles.sideicon} onPress={goDictionary}/>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible1}
        onRequestClose={goSetting}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <BackgroundSetting
              goSetting={goSetting}
              bgiData={bgiData}
              bgmData={bgmData}
            />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible2}
        onRequestClose={goDictionary}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <DictionaryForest
              goDictionary={goDictionary}
              showSticker={showSticker}
              setShowSticker={setShowSticker}
            />
          </View>
        </View>
      </Modal>

      {/* 저장 */}
      {/* onRequestClose : 뒤로 가기 버튼*/}
      <Modal
        animationType="slide"
        transparent={true}
        visible={savePopupVisible}
        onRequestClose={handleCloseandNOSavePopup}>
        <View style={styles.popupBackground}>
          <Popup
            content="저장하시겠습니까?"
            onClose={handleCloseandNOSavePopup}
            when="save"
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
    // flex: 1,
    width: '100%',
    height: '100%',
    transform: [{rotate: '90deg'}],
    aspectRatio: 1, // 적절한 비율로 설정
  },
  iconContainer: {
    position: 'absolute',
  },
  homeicon: {
    top: height * 0.03,
    left: width * 0.87,
    fontSize: 30,
    color: 'white',
    transform: [{rotate: '90deg'}],
  },
  settingicon: {
    top: height * 0.03,
    left: width * 0.05,
    fontSize: 34,
    color: 'white',
    transform: [{rotate: '90deg'}],
  },
  sideicon: {
    top: height * 0.97,
    left: width * 0.87,
    fontSize: 34,
    color: 'white',
    transform: [{rotate: '90deg'}],
  },
  modalBackground: {
    position: 'absolute',
    bottom:width*0,
    right: 0,
    left:0,
    // backgroundColor:'black',
  },
  modalContainer: {
    transform: [{rotate: '90deg'}],
    borderRadius: 32,
  },

  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
  },
  sticker: {
    width: 200,
    height: 200,
    position: 'absolute',
    transform: [{rotate: '90deg'}],
  },
  popupBackground: {
    justifyContent: 'center', // 수직 중앙 정렬
    alignItems: 'center', // 수평 중앙 정렬
    height: '100%',
    transform: [{rotate: '90deg'}],
  },
  // popupContainer: {
  //   transform: [{rotate: '90deg'}],
  //   borderRadius: 32,
  // },
});