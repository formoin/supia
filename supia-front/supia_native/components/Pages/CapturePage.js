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
  Image, // 이미지 표시를 위해 추가
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UploadModal from '../UploadModal';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import {Server_IP} from '@env';
import {useNavigation} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import loginStore from '../store/useLoginStore';
import useStore from '../store/useStore';
import ImageResizer from 'react-native-image-resizer';

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
  const {fetchLocationData} = useStore();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [photoUri, setPhotoUri] = useState(null); // 찍은 사진의 URI를 저장할 상태 추가

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
      setHasPermission(true); // iOS의 경우 별도 권한 요청이 필요 없음
    }
  };

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
        // 사진 찍기
        const photo = await cameraRef.current.takePhoto({
          qualityPrioritization: 'balanced',
          quality: 100,
          format: 'png',
        });

        const newImageUri = 'file://' + photo.path;
        setPhotoUri(newImageUri); // 사진 URI 저장

        // 현재 날짜와 시간 가져오기
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2); // YY
        const month = (now.getMonth() + 1).toString().padStart(2, '0'); // MM
        const day = now.getDate().toString().padStart(2, '0'); // DD
        const hour = now.getHours().toString().padStart(2, '0'); // HH
        const minute = now.getMinutes().toString().padStart(2, '0'); // MM

        const date = `${year}${month}${day}`; // YYMMDD
        const time = `${hour}${minute}`; // HHMM

        // 이미지 회전
        const rotatedImage = await ImageResizer.createResizedImage(
          newImageUri,
          photo.width,
          photo.height,
          'PNG',
          100,
          0, // 회전 각도
        );

        console.log('Rotated image URI:', rotatedImage.uri);

        const formData = new FormData();
        formData.append('file', {
          uri: rotatedImage.uri,
          type: 'image/png',
          name: `${date}_${time}.png`,
        });
        formData.append('date', date);
        formData.append('time', time);
        formData.append('member_id', memberId);

        const response = await axios.post(
          'https://i11b304.p.ssafy.io/ai/process-image/',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
              Accept: 'application/json',
            },
          },
        );

        setDrawingImg(response.data.hand_drawing_img_url);
        setProbsName(response.data.probs_name);
        setCategory(response.data.category);
        setModalVisible(true); // 모달 띄우기
        getLocation();
      } catch (error) {
        console.error('Upload error', error);
        if (error.response) {
          console.log('Error details:', error.response.data);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false); // 모달 닫기
  };

  const backtoWalk = () => {
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
        <TouchableOpacity style={styles.capture} onPress={takePictureAndUpload} />
      </View>

      {isLoading && (
        <View style={[StyleSheet.absoluteFill, styles.loading]}>
          <ActivityIndicator size="large" color="#0000ff" />
          {photoUri && <Image source={{uri: photoUri}} style={styles.capturedImage} />}
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
  capturedImage: {
    width: 200, // 원하는 크기로 조절
    height: 200,
  },
});

export default CapturePage;
