import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Text,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UploadModal from '../UploadModal';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import {Server_AI_IP} from '@env';
import {useNavigation} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import loginStore from '../store/useLoginStore';
import useStore from '../store/useStore';

const CapturePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [memberId, setMemberId] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [drawingImg, setDrawingImg] = useState(null);
  const [probsName, setProbsName] = useState(null);
  const [category, setCategory] = useState(null);
  const [orgUrl, setOrgUrl] = useState(null);
  const [code, setCode] = useState(null);
  const cameraRef = useRef(null);
  const devices = useCameraDevices();
  const device = devices ? devices.back : null;
  const {token} = loginStore.getState();
  const navigation = useNavigation();
  const [cameraKey, setCameraKey] = useState(0);
  const {fetchLocationData} = useStore();
  const [isCameraActive, setIsCameraActive] = useState(false);

  // 권한 얻기
  const getCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: '카메라 권한 요청',
            message: '사진을 찍기 위해 카메라 권한이 필요합니다.',
            buttonNeutral: '나중에',
            buttonNegative: '취소',
            buttonPositive: '확인',
          },
        );
        setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      } catch (err) {
        console.warn(err);
      }
    } else {
      setHasPermission(true); // iOS의 경우는 별도 권한 요청이 필요 없음
    }
  };

  // const loadMemberId = async () => {
  //   try {
  //     const storedMemberId = await AsyncStorage.getItem('memberId');
  //     if (storedMemberId !== null) {
  //       setUserId(storedMemberId);
  //     }
  //   } catch (error) {
  //     console.error('Failed to load userId:', error);
  //   }
  // };
  // useEffect(() => {
  //   getCameraPermission();
  //   // loadMemberId();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      console.log('카메라 페이지 입장');
      getCameraPermission();
      setIsCameraActive(true);
      return () => {
        setIsCameraActive(false);
      };
    }, []),
  );

  const takePictureAndUpload = async () => {
    setIsLoading(true);
    if (cameraRef.current) {
      try {
        // 새로운 사진을 찍고 새로운 경로를 할당
        const photo = await cameraRef.current.takePhoto({
          qualityPrioritization: 'balanced',
          quality: 100,
          format: 'png',
        });

        // 로그를 통해 새로운 경로가 갱신되는지 확인
        console.log('Photo taken:', photo.path);

        const newImageUri = 'file://' + photo.path;
        console.log('New image URI:', newImageUri);

        // 상태 업데이트
        setOrgUrl(photo.path);

        // 현재 날짜와 시간 추출
        const currentDate = new Date();
        const year = currentDate.getFullYear().toString().slice(2); // 연도 YY
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // 월 MM
        const day = currentDate.getDate().toString().padStart(2, '0'); // 일 DD
        const date = year + month + day; // YYMMDD 형식

        const hours = currentDate.getHours().toString().padStart(2, '0'); // 시 HH
        const minutes = currentDate.getMinutes().toString().padStart(2, '0'); // 분 MM
        const time = hours + minutes; // HHMM 형식

        // 사진을 서버에 업로드
        const formData = new FormData();
        formData.append('file', {
          uri: newImageUri,
          type: 'image/png',
          name: `photo_${date}_${time}.png`, // 이름 변경하여 중복 방지
        });
        formData.append('date', date);
        formData.append('time', time);
        formData.append('member_id', '1');

        const response = await axios.post(
          'https://i11b304.p.ssafy.io/ai/process-image/',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
              Accept: 'application/json',
            },
            timeout: 50000,
          },
        );

        console.log('Upload success', response.data);
        setDrawingImg(response.data.hand_drawing_img_url);
        setProbsName(response.data.probs_name);
        setCategory(response.data.category);
        setModalVisible(true); // data 가지고 팝업 띄우기
        getLocation();
      } catch (error) {
        console.error('Upload error', error);
      } finally {
        setIsLoading(false); // 로딩 끝
      }
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false); // 모달 닫기
  };

  const backtoWalk = () => {
    // setCameraKey(prevKey => prevKey + 1);
    navigation.navigate('Walk');
  };

  const getLocation = async () => {
    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        const {code} = await fetchLocationData(longitude, latitude);
        if (code) {
          setCode(code);
        } else {
          console.log('사진 위치 호출 실패');
        }
      },
      error => console.log('위치 정보 가져오기 실패:', error),
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  return (
    <View style={styles.container}>
      {hasPermission ? (
        device ? (
          <>
            <Camera
              ref={cameraRef}
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={isCameraActive}
              photo={true}
            />
            <View style={styles.focusFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
          </>
        ) : (
          <Text>Loading camera...</Text>
        )
      ) : (
        <Text>No camera permission</Text>
      )}
      <View style={{left: 10, top: 10}}>
        <Pressable onPress={backtoWalk}>
          <Entypo name="chevron-small-left" size={30} />
        </Pressable>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.capture}
          onPress={takePictureAndUpload}
        />
      </View>

      {isLoading && (
        <View style={[StyleSheet.absoluteFill, styles.loading]}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={{color: 'white'}}>스티커화 중...</Text>
          <Text style={{color: 'white'}}>누끼 따는 중...</Text>
        </View>
      )}

      {isModalVisible && (
        <View style={styles.modalBackground}>
          <UploadModal
            onClose={handleCloseModal}
            drawingImg={drawingImg}
            probsName={probsName}
            category={category}
            originalUrl={orgUrl}
            code={code}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  capture: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusFrame: {
    position: 'absolute',
    left: '10%',
    top: '30%',
    width: '80%',
    height: '40%',
    marginLeft: 0,
    marginTop: 0,
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: 'white',
  },
  topLeft: {
    borderTopWidth: 2,
    borderLeftWidth: 2,
    top: 0,
    left: 0,
  },
  topRight: {
    borderTopWidth: 2,
    borderRightWidth: 2,
    top: 0,
    right: 0,
  },
  bottomLeft: {
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    bottom: 0,
    left: 0,
  },
  bottomRight: {
    borderBottomWidth: 2,
    borderRightWidth: 2,
    bottom: 0,
    right: 0,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default CapturePage;
