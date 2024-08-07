import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Text,
} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Server_AI_IP} from '@env';

const token =
  'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMEBzc2FmeS5jb20iLCJtZW1iZXJJZCI6MSwiaWF0IjoxNzIzMDAxNzU2LCJleHAiOjE3NTQ1Mzc3NTZ9.yQ_IgYEQzmf5O2_csfB095x3RcWrxdJynXGy6XqJT3Zc5-tQ-sSs4ycdMCxwKiWgj1_m8L83O3kKibIi7x0JJA';
const CapturePage = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [memberId, setMemberId] = useState(null);
  const cameraRef = useRef(null);
  const devices = useCameraDevices();
  const device = devices ? devices.back : null;

  useEffect(() => {
    const getCameraPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Permission',
              message: 'App needs camera permission to take pictures',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
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

    getCameraPermission();
    // loadMemberId();
  }, []);

  const takePictureAndUpload = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePhoto({
        qualityPrioritization: 'balanced',
        quality: 100,
        format: 'png',
      });
      console.log(photo.path);
      console.log(Server_AI_IP);
      const newImageUri = 'file://' + photo.path;
      console.log(newImageUri);

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
        name: 'photo.png',
      });
      formData.append('date', date);
      formData.append('time', time);
      formData.append('member_id', '1');

      try {
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
        // data 가지고 팝업 띄우기
      } catch (error) {
        console.error('Upload error', error);
      }
    }
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
              isActive={true}
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
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.capture}
          onPress={takePictureAndUpload}
        />
      </View>
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
});

export default CapturePage;
