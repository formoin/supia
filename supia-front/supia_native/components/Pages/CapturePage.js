import React, {useEffect, useState, useRef} from 'react';
import ImageEditor from '@react-native-community/image-editor';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Image,
  Animated,
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
  const {memberId} = useStore();
  const [isModalVisible, setModalVisible] = useState(false);
  const [drawingImg, setDrawingImg] = useState(null);
  const [probsName, setProbsName] = useState(null);
  const [category, setCategory] = useState(null);
  const [orgUrl, setOrgUrl] = useState(null);
  const [code, setCode] = useState(null);
  const [capturedPhotoUri, setCapturedPhotoUri] = useState(null);
  const cameraRef = useRef(null);
  const devices = useCameraDevices();
  const device = devices ? devices.back : null;
  const {token} = loginStore.getState();
  const navigation = useNavigation();
  const {fetchLocationData} = useStore();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const scanAnimation = useRef(new Animated.Value(0)).current;

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

  const startScanAnimation = () => {
    scanAnimation.setValue(0);
    Animated.loop(
      Animated.timing(scanAnimation, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ).start();
  };

  const takePictureAndUpload = async () => {
    setIsLoading(true);
    // setDrawingImg(null)
    // console.log('null드로잉',drawingImg)
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePhoto({
          qualityPrioritization: 'balanced',
          quality: 100,
          format: 'png',
        });

        const newImageUri = 'file://' + photo.path;
        setCapturedPhotoUri(newImageUri);

        // 애니메이션 시작
        startScanAnimation();

        // 이미지 회전 (90도 예시)
        const rotatedImage = await ImageResizer.createResizedImage(
          newImageUri,
          photo.width,
          photo.height,
          'PNG',
          100,
          0,
        );
        console.log(rotatedImage);

        const formData = new FormData();
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2);
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hour = now.getHours().toString().padStart(2, '0');
        const minute = now.getMinutes().toString().padStart(2, '0');
        const date = `${year}${month}${day}`;
        const time = `${hour}${minute}`;

        formData.append('file', {
          uri: rotatedImage.uri,
          type: 'image/png',
          name: `${date}_${time}.png`,
        });
        formData.append('date', date);
        formData.append('time', time);
        formData.append('member_id', memberId);

        const response = await axios.post(
          'https://stirring-dodo-bursting.ngrok-free.app/ai/process-image',
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
        console.log('response: ', response.data.hand_drawing_img_url);
        setProbsName(response.data.probs_name);
        setCategory(response.data.category);
        // setModalVisible(true);
        getLocation();
      } catch (error) {
        console.error('Upload error', error);
        if (error.response) {
          console.log('Error details:', error.response.data);
        }
      } finally {
        setIsLoading(false);
        setCapturedPhotoUri(null);
      }
    }
  };

  useEffect(() => {
    if (drawingImg) {
      setModalVisible(true);
    }
  }, [drawingImg]);

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

  const scanLineTransform = scanAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-150, 150],
  });

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

      {capturedPhotoUri && isLoading ? (
        <View style={styles.capturedPhotoContainer}>
          <Image
            source={{uri: capturedPhotoUri}}
            style={styles.capturedPhoto}
            resizeMode="cover"
          />
          <Animated.View
            style={[
              styles.scanLine,
              {transform: [{translateX: scanLineTransform}]},
            ]}
          />
        </View>
      ) : null}

      {isModalVisible && (
        <KeyboardAvoidingView
          style={styles.modalBackground}
          behavior="height" // Android에서는 'height' 사용
          keyboardVerticalOffset={5}>
          <UploadModal
            onClose={handleCloseModal}
            drawingImg={drawingImg}
            probsName={probsName}
            category={category}
            originalUrl={orgUrl}
            code={code}
          />
        </KeyboardAvoidingView>
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
  capturedPhotoContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 188,
  },
  capturedPhoto: {
    width: 300,
    height: 310,
    borderRadius: 10,
  },
  scanLine: {
    position: 'absolute',
    height: 310,
    width: 20, // 선의 두께를 조정
    backgroundColor: 'rgba(162, 170, 123, 0.6)',
  },
});

export default CapturePage;
