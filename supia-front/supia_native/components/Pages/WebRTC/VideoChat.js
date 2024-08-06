import React, {useEffect, useRef, useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View, Image} from 'react-native';
import {RTCView} from 'react-native-webrtc'; // WebRTC 비디오 뷰 컴포넌트
import useMySocket from './useSocket'; // 커스텀 훅을 import
import useDrag from './useDrag';
import {useRoute} from '@react-navigation/native';
import ViewShot from 'react-native-view-shot';
import {
  btnCameraReverse,
  btnAudioOff,
  btnAudioOn,
  btnVideoOn,
  btnVideoOff,
  icVideoOffHuman,
  icAudioOff,
} from '../../../assets/Callimages'; // 버튼 및 아이콘 이미지

function VideoChat({navigation}) {
  const route = useRoute();
  const ref = useRef(null);
  const {userId, targetUserId} = route.params;
  const [capturedImage, setCapturedImage] = useState(null);

  // WebRTC 및 드래그 훅에서 상태 및 함수 가져오기
  const {
    localStream,
    remoteStream,
    isVideoFront,
    isVideo,
    isAudio,
    setIsVideoFront,
    setIsVideo,
    setIsAudio,
    endCall,
    getMedia,
  } = useMySocket(userId, targetUserId);

  const {panResponder, style} = useDrag(); // 드래그 기능 훅 사용

  // 권한 요청 함수
  const requestStoragePermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: '저장소 권한 요청 ',
            message: '저장소 정보를 사용하기 위해 권한이 필요합니다.',
            buttonNeutral: '나중에',
            buttonNegative: '취소',
            buttonPositive: '확인',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true; // iOS or 다른 플랫폼
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // setIsVideoFront, setIsVideo, setIsAudio 상태 관리 최적화
  useEffect(() => {
    getMedia();
  }, [isVideoFront, isVideo, isAudio]);

  useEffect(() => {
    requestStoragePermission();
  }, []);

  //화면 전환 함수
  const changeScreen = screen => {
    navigation.navigate(screen); // 화면 전환
  };

  // 편집된 이미지를 저장하는 함수
  const saveEditedImage = path => {
    console.log('Edited image saved at:', path);
    // AI에 보내는 함수 필요
  };

  // 화면 촬영
  const onCaptureScreen = async () => {
    try {
      const uri = await ref.current.capture();
      console.log('Capture complete...', uri);
      setCapturedImage(uri); // 캡처된 이미지를 상태로 저장
      // 파일을 저장할 경로 설정
      const filePath = `${RNFS.DocumentDirectoryPath}/capturedImage.png`;
      await RNFS.moveFile(uri, filePath);
      console.log('Image saved to', filePath);
      sendImageToServer(filePath);
    } catch (error) {
      console.error('Capture failed:', error);
      Alert.alert(
        'Capture Failed',
        'An error occurred while capturing the screen.',
      );
    }
  };

  // 서버로 PNG 이미지 전송
  const sendImageToServer = async filePath => {
    const now = new Date();
    const date = now.toISOString().split('T')[0]; // YYYY-MM-DD 형식
    const time = now.toTimeString().split(' ')[0]; // HH:MM:SS 형식

    const formData = new FormData();
    formData.append('member_id', userId);
    formData.append('date', date);
    formData.append('time', time);
    formData.append('file', {
      uri: `file://${filePath}`,
      type: 'image/png',
      name: `${userId}_.png`,
    });

    try {
      const response = await axios.post('https://업로드 서버', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // 받고 나면 다시 받아온 파일 저장

      console.log('Image uploaded successfully:', response.data);
    } catch (error) {
      console.error('Image upload failed:', error);
      Alert.alert(
        'Upload Failed',
        'An error occurred while uploading the image.',
      );
    }
  };

  return (
    <View style={styles.container}>
      <ViewShot
        style={styles.captureArea}
        ref={ref}
        options={{
          format: 'jpg',
          quality: 0.9,
        }}>
        {/* 원격 비디오 스트림 표시 */}
        <RTCView
          style={styles.remoteRTCView}
          objectFit="cover"
          streamURL={remoteStream ? remoteStream.toURL() : ''} // 원격 스트림 URL 설정
        />
        {/* 원격 사용자 이름 표시 */}
        <View style={styles.remoteNameView}>
          <Text style={styles.remoteNameText}>
            {remoteStream ? '김퍼즐' : '연결 대기중'}{' '}
            {/* 원격 스트림 상태에 따라 텍스트 변경 */}
          </Text>
        </View>
        {/* 로컬 비디오 스트림 및 컨트롤 버튼 */}

        <Animated.View
          style={[styles.localView, style]}
          {...panResponder.panHandlers}>
          <RTCView
            style={styles.localRTCView}
            objectFit="cover"
            streamURL={localStream ? localStream.toURL() : ''} // 로컬 스트림 URL 설정
          />
          {/* 비디오가 꺼져 있을 때 비디오 꺼짐 아이콘 표시 */}
          {!isVideo && (
            <Image
              source={icVideoOffHuman}
              style={styles.localVideoIcon}
              resizeMode="contain"
            />
          )}

          <View style={styles.localNameView}>
            <Text style={styles.userNameText}>홍길동</Text>
            {/* 오디오가 꺼져 있을 때 오디오 꺼짐 아이콘 표시 */}
            {!isAudio && (
              <Image
                source={icAudioOff}
                style={styles.localAudioIcon}
                resizeMode="contain"
              />
            )}
          </View>
        </Animated.View>
      </ViewShot>
      {/* 아이콘 컨트롤 버튼 */}
      <View style={styles.iconView}>
        {/* 통화 종료 버튼 */}
        <Pressable
          onPress={() => {
            endCall();
            changeScreen('Walk');
          }}>
          <View style={{width: 57, height: 57, backgroundColor: 'white'}}>
            <Text>통화 종료</Text>
          </View>
        </Pressable>
        {/* 카메라 촬영 버튼 */}
        <Pressable onPress={onCaptureScreen}>
          <View style={{width: 57, height: 57, backgroundColor: 'white'}}>
            <Text>찰칵</Text>
          </View>
        </Pressable>
        {/* 카메라 전환 버튼 */}
        <Pressable onPress={() => setIsVideoFront(!isVideoFront)}>
          <Image source={btnCameraReverse} style={styles.icon} />
        </Pressable>
      </View>
    </View>
  );
}

// 스타일 시트 정의
const styles = StyleSheet.create({
  container: {
    flex: 1, // 컨테이너를 화면 전체 크기로 설정
    position: 'relative', // 자식 요소들을 절대 위치로 배치할 수 있도록 설정
  },
  remoteRTCView: {
    flex: 1, // 원격 비디오가 컨테이너를 차지하도록 설정
  },
  localView: {
    alignItems: 'center', // 로컬 비디오를 중앙에 배치
    position: 'absolute', // 절대 위치로 설정하여 화면의 특정 위치에 배치
    bottom: 173, // 화면 하단에서 173px 위에 위치
    right: 15, // 화면 오른쪽에서 15px 떨어진 위치
    width: 100, // 로컬 비디오의 너비 설정
    height: 140, // 로컬 비디오의 높이 설정
  },
  localRTCView: {
    position: 'absolute', // 절대 위치로 설정하여 부모 컨테이너에 맞게 크기 조정
    width: '100%', // 부모 컨테이너의 너비에 맞춤
    height: '100%', // 부모 컨테이너의 높이에 맞춤
  },
  userNameText: {
    padding: 3.25, // 텍스트의 패딩 설정
    textAlign: 'center', // 텍스트를 중앙 정렬
    fontSize: 18, // 텍스트의 폰트 크기 설정
    color: 'white', // 텍스트 색상 설정
    backgroundColor: 'black', // 배경 색상 설정
    opacity: 0.8, // 투명도 설정
  },
  remoteNameView: {
    alignItems: 'center', // 사용자 이름을 중앙 정렬
  },
  remoteNameText: {
    position: 'absolute', // 절대 위치로 설정하여 화면 하단에 배치
    bottom: 173, // 화면 하단에서 173px 위에 위치
    padding: 3.25, // 텍스트의 패딩 설정
    borderRadius: 5, // 테두리 둥글게 설정
    backgroundColor: 'black', // 배경 색상 설정
    color: 'white', // 텍스트 색상 설정
  },
  localNameView: {
    flexDirection: 'row', // 텍스트와 아이콘을 가로 방향으로 배치
    justifyContent: 'center', // 중앙 정렬
    alignItems: 'center', // 세로 방향으로 중앙 정렬
    position: 'absolute', // 절대 위치로 설정하여 화면 하단에 배치
    bottom: 0, // 화면 하단에 붙도록 설정
    width: '100%', // 부모 컨테이너의 너비에 맞춤
    backgroundColor: 'black', // 배경 색상 설정
  },
  localAudioIcon: {
    width: 15, // 오디오 아이콘의 너비 설정
    height: 18, // 오디오 아이콘의 높이 설정
    marginLeft: 5, // 왼쪽 여백 설정
  },
  localVideoIcon: {
    width: '100%', // 로컬 비디오 아이콘의 너비 설정
    height: '100%', // 로컬 비디오 아이콘의 높이 설정
    backgroundColor: '#d0d0d0', // 비디오 꺼짐 상태에서 배경 색상 설정
  },
  exitButton: {
    position: 'absolute', // 절대 위치로 설정하여 화면 오른쪽 상단에 배치
    top: 23, // 화면 상단에서 23px 떨어진 위치
    right: 15, // 화면 오른쪽에서 15px 떨어진 위치
    alignItems: 'center', // 버튼 안의 내용 중앙 정렬
    padding: 5, // 버튼의 패딩 설정
    borderRadius: 8, // 버튼의 테두리를 둥글게 설정
    backgroundColor: '#e57373', // 버튼의 배경 색상 설정
  },
  buttonText: {
    fontSize: 18, // 버튼 텍스트의 폰트 크기 설정
    fontWeight: '700', // 버튼 텍스트의 폰트 굵기 설정
  },
  iconView: {
    flex: 1, // 아이콘 뷰가 화면의 남은 공간을 차지하도록 설정
    flexDirection: 'row', // 아이콘을 가로 방향으로 배치
    justifyContent: 'space-between', // 아이콘 간의 간격을 균등하게 설정
    position: 'absolute', // 절대 위치로 설정하여 화면 하단에 배치
    bottom: 0, // 화면 하단에 붙도록 설정
    width: '100%', // 부모 컨테이너의 너비에 맞춤
    padding: 30, // 아이콘 뷰의 패딩 설정
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // 배경 색상 및 투명도 설정
  },
  icon: {
    width: 57, // 아이콘의 너비 설정
    height: 57, // 아이콘의 높이 설정
  },
});

export default VideoChat;
