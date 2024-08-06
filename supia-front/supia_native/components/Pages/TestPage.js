import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import useMySocket from '../Pages/WebRTC/useSocket'; // WebSocket 커스텀 훅

const TestWebRTCPage = () => {
  const userId = 99; // 고정된 테스트 사용자 ID
  const targetUserId = 100; // 상대방 사용자 ID
  const navigation = useNavigation();

  const {ws} = useMySocket(userId, null); // targetUserId는 null로 설정

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple(
          [
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          ],
          {
            title: 'Camera and Microphone Permission',
            message:
              'This app needs access to your camera and microphone for video calls.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (
          granted['android.permission.CAMERA'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('You can use the camera and microphone');
        } else {
          console.log('Camera or Microphone permission denied');
          Alert.alert(
            'Permission Denied',
            'You need to grant camera and microphone permissions to use this feature.',
          );
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      console.log('Permissions are not required for iOS or other platforms.');
    }
  };

  useEffect(() => {
    if (ws) {
      // WebSocket 연결 후 등록 메시지 전송
      const registerMessage = JSON.stringify({
        type: 'register',
        data: {userId},
      });
      ws.send(registerMessage);
      console.log('User registered with ID:', userId);
    }
  }, [ws, userId]);

  const enterRoom = () => {
    // VideoChatScreen으로 이동
    navigation.navigate('VideoChat', {userId, targetUserId});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.userIdText}>회원 ID: {userId}</Text>
      <Button title="방 입장" onPress={enterRoom} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  userIdText: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default TestWebRTCPage;
