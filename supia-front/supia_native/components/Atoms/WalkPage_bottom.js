import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Modal,
  Text,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import useStore from '../store/useStore';
import Button_Green from './Button_Green';
import Button_Red from './Button_Red';
import {useNavigation} from '@react-navigation/native';
import Popup_Call from '../Popup_Call';
import axios from 'axios';
import {captureRef} from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import loginStore from '../store/useLoginStore';
import {Server_IP} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WalkPage_bottom = ({onOpenPopup, distance, mapRef}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const {resetStopwatch, pauseStopwatch, setWalkEndTime} = useStore();
  const setRouteWidth = useStore(state => state.setRouteWidth);
  const finalDistance = useStore(state => state.finalDistance);
  const walkStartTime = useStore(state => state.walkStartTime);
  const walkEndTime = useStore(state => state.walkEndTime);
  const [friends, setFriends] = useState([]);
  const {items} = useStore();
  const {memberId, memberName} = useStore();
  // const { token } = loginStore.getState()
  const [modalVisible, setModalVisible] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const setCapturedImageUri = useStore(state => state.setCapturedImageUri);

  const onPressCamera = () => {
    navigation.navigate('Capture');
  };

  const formatTime = isoString => {
    if (!isoString) return '00:00';
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const sendWalkData = async () => {
    const token = await AsyncStorage.getItem('key');
    const currentTime = new Date().toISOString();
    const walkData = {
      memberId: memberId, // 수정
      walkStart: formatTime(walkStartTime),
      walkEnd: formatTime(currentTime),
      distance: parseFloat(distance.toFixed(2)),
      items: items,
    };

    try {
      const response = await axios.post(`${Server_IP}/walk`, walkData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
      });

      if (response.status === 200) {
        console.log(walkData);
        console.log('산책 정보 저장', response.data);
      } else {
        console.log(walkData);
        console.log('산책 저장 실패');
      }
    } catch (error) {
      console.log(walkData);
      console.error('산책 끝 요청 중 오류 발생:', error);
    }
  };

  const getFriends = async () => {
    const token = await AsyncStorage.getItem('key');

    try {
      const response = await axios.get(`${Server_IP}/friends`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
      setFriends(response.data);
      console.log(response.data);
      console.log('친구 리스트 불러오기 성공');
    } catch (error) {
      console.error('친구 목록을 가져오는 데 실패했습니다:', error);
    }
  };

  const onPressPause = useCallback(async () => {
    resetStopwatch(); // 스톱워치 리셋
    pauseStopwatch(); // 스톱워치 일시 정지
    sendWalkData();
    const currentTime = new Date().toISOString();
    setWalkEndTime(currentTime);
    setRouteWidth(4); // 경로 너비 설정
    // console.log('Final Distance:', distance.toFixed(2));

    setLoading(true); // 로딩 시작

    setTimeout(async () => {
      try {
        const uri = await captureRef(mapRef, {
          format: 'png',
          quality: 0.8,
        });
        console.log('Captured map image:', uri);
        setCapturedImageUri(uri);
      } catch (error) {
        console.error('Failed to capture map image:', error);
      } finally {
        setLoading(false); // 로딩 끝
        setModalVisible(true); // 모달 표시
      }
    }, 1000); // 1초 대기
  }, [
    resetStopwatch,
    pauseStopwatch,
    setWalkEndTime,
    setRouteWidth,
    distance,
    mapRef,
    setCapturedImageUri,
  ]);

  const onPressUser = () => {
    getFriends();
    setPopupVisible(true);
  };

  const handleConfirm = () => {
    setModalVisible(false);
    navigation.navigate('WalkRecord', {distance});
  };

  const handleCancel = () => {
    setModalVisible(false);
    navigation.navigate('Home');
  };

  const handlePopupClose = () => {
    setPopupVisible(false);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.buttonWrapper}>
          <Pressable onPress={onPressCamera} style={styles.iconContainer}>
            <Ionicons
              name="camera-outline"
              size={30}
              color="#A2AA7B"
              style={styles.whiteIcon}
            />
          </Pressable>
          <View style={styles.iconWithCircle}>
            <View style={styles.bg} />
            <Pressable onPress={onPressPause} style={styles.pauseButton}>
              <Entypo name="controller-paus" size={30} color="#141410" />
            </Pressable>
          </View>
          <Pressable onPress={onPressUser} style={styles.iconContainer}>
            <Feather
              name="user"
              size={30}
              color="#A2AA7B"
              style={styles.whiteIcon}
            />
          </Pressable>
        </View>

        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>산책 종료</Text>
              <Text style={styles.modalMessage}>
                산책 기록을 확인하시겠습니까?
              </Text>
              <View style={styles.buttonContainerModal}>
                <Button_Green label="네" onPress={handleConfirm} />
                <Button_Red label="아니오" onPress={handleCancel} />
              </View>
            </View>
          </View>
        </Modal>

        <TouchableWithoutFeedback onPress={handlePopupClose}>
          <View>
            <Popup_Call
              visible={popupVisible}
              onClose={handlePopupClose}
              onOpenPopup={onOpenPopup}
              friends={friends}
              memberId={memberId}
              memberName={memberName}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 15,
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    paddingHorizontal: 10,
  },
  whiteIcon: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#fff',
  },
  pauseButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#A2AA7B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#A2AA7B',
  },
  bg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(162, 170, 123, 0.8)',
    position: 'absolute',
    opacity: 0.8,
  },
  iconWithCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 50,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainerModal: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
});

export default WalkPage_bottom;
