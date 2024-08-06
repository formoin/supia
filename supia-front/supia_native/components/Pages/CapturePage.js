//import React, {useRef, useState} from 'react';
//import {
//  View,
//  StyleSheet,
//  TouchableOpacity,
//  Text,
//  PermissionsAndroid,
//  Platform,
//  Alert,
//} from 'react-native';
//import {Camera, useCameraDevice} from 'react-native-vision-camera';
//import RNFS from 'react-native-fs';
//import axios from 'axios';
//
//function CaptureScreen() {
//  const [isCameraActive, setIsCameraActive] = useState(true);
//  const [photoUri, setPhotoUri] = useState(null);
//  const cameraRef = useRef(null);
//  const device = useCameraDevice('back');
//
//  // 권한 요청 함수
//  const requestCameraPermission = async () => {
//    if (Platform.OS === 'android') {
//      try {
//        const granted = await PermissionsAndroid.request(
//          PermissionsAndroid.PERMISSIONS.CAMERA,
//        );
//        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//          Alert.alert(
//            '카메라 권한',
//            '사진 촬영을 위해 카메라 권한이 필요합니다.',
//          );
//          return false;
//        }
//        return true;
//      } catch (err) {
//        console.warn(err);
//        return false;
//      }
//    }
//    return true;
//  };
//
//  // 사진 촬영 함수
//  const takePhoto = async () => {
//    try {
//      if (cameraRef.current) {
//        const photo = await cameraRef.current.takePhoto({
//          format: 'jpg', // 촬영할 이미지 형식 지정
//        });
//        const filePath = `${
//          RNFS.DocumentDirectoryPath
//        }/photo_${Date.now()}.jpg`;
//        await RNFS.writeFile(filePath, photo.uri, 'base64');
//
//        setPhotoUri(filePath);
//        sendPhotoToServer(filePath);
//        setIsCameraActive(false); // 카메라 비활성화
//      }
//    } catch (error) {
//      console.error('Error taking photo:', error);
//      Alert.alert('Error', 'Failed to take photo.');
//    }
//  };
//
//  // 서버로 사진 전송
//  const sendPhotoToServer = async filePath => {
//    const now = new Date();
//    const formData = new FormData();
//    formData.append('member_id', 'example_member_id');
//    formData.append('date', now.toISOString().split('T')[0]); // YYYY-MM-DD 형식
//    formData.append('time', now.toTimeString().split(' ')[0]); // HH:MM:SS 형식
//    formData.append('file', {
//      uri: `file://${filePath}`,
//      type: 'image/jpeg',
//      name: 'capturedPhoto.jpg',
//    });
//
//    try {
//      const response = await axios.post(
//        'https://yourserver.com/process_image',
//        formData,
//        {
//          headers: {
//            'Content-Type': 'multipart/form-data',
//          },
//        },
//      );
//      console.log('Photo uploaded successfully:', response.data);
//    } catch (error) {
//      console.error('Photo upload failed:', error);
//      Alert.alert(
//        'Upload Failed',
//        'An error occurred while uploading the photo.',
//      );
//    }
//  };
//
//  React.useEffect(() => {
//    requestCameraPermission();
//  }, []);
//
//  return (
//    <View style={styles.container}>
//      {isCameraActive && (
//        <Camera
//          ref={cameraRef}
//          style={StyleSheet.absoluteFill}
//          device={device}
//          isActive={true}
//          photo={true}
//        />
//      )}
//      <TouchableOpacity onPress={takePhoto} style={styles.captureButton}>
//        <Text style={styles.buttonText}>사진 촬영</Text>
//      </TouchableOpacity>
//      {photoUri && (
//        <View>
//          <Text>Photo captured at: {photoUri}</Text>
//        </View>
//      )}
//    </View>
//  );
//}
//
//const styles = StyleSheet.create({
//  container: {
//    flex: 1,
//    justifyContent: 'center',
//    alignItems: 'center',
//    backgroundColor: '#fff',
//  },
//  captureButton: {
//    position: 'absolute',
//    bottom: 30,
//    padding: 10,
//    backgroundColor: '#007bff',
//    borderRadius: 5,
//  },
//  buttonText: {
//    color: '#fff',
//    fontSize: 16,
//  },
//});
//
//export default CaptureScreen;
