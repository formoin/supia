import {useEffect, useRef, useState} from 'react';
import {Alert, PermissionsAndroid} from 'react-native';
import {
  RTCPeerConnection,
  mediaDevices,
  MediaStream,
  RTCSessionDescription,
  RTCIceCandidate,
} from 'react-native-webrtc';
//import Config from 'react-native-config';

// const TURN_SERVER = Config.TURN_SERVER;
const SOCKET_SERVER = 'ws://10.0.2.2:8080/';
// const CONFIG_USERNAME = Config.CONFIG_USERNAME;
// const CONFIG_CREDENTIAL = Config.CONFIG_CREDENTIAL;

// webRTC 순서
// 1. 미디어 디바이스에 대한 권한 받아오고 로컬(나)의 스트림(카메라 마이크) 연결
// 2. 통화페이지를 들어오면서 들고온 상대 유저 ID를 가지고 통화 요청(offer)
// 3. 요청을 받은 사람이 응답을 하면 TURN(지금은 STUN) 에서 ICE 후보군 찾음
// 4. 찾은 ICE로 쌍방향 통신이 진행

// WebRTC 설정을 위한 구성 객체입니다.
// TURN 서버의 주소와 인증 정보를 포함합니다.
const configuration = {
  iceServers: [
    {
      // STUN 서버 우선 사용
      // 나중에 TURN 서버를 구현해야 함
      urls: 'stun:stun.l.google.com:19302',
      //   urls: [TURN_SERVER], // TURN 서버의 URL
      //   username: CONFIG_USERNAME, // TURN 서버 인증용 사용자 이름
      //   credential: CONFIG_CREDENTIAL, // TURN 서버 인증용 비밀번호
    },
  ],
};

// WebSocket과 WebRTC 연결을 관리하는 커스텀 훅입니다.
const useMySocket = (userId, targetUserId) => {
  // 웹소켓과 peerConnection 객체를 참조하는 Ref 객체입니다.
  const ws = useRef(new WebSocket(SOCKET_SERVER)); // 웹소켓 객체 생성
  const pc = useRef(new RTCPeerConnection(configuration)); // RTCPeerConnection 객체 생성
  const [localStream, setLocalStream] = useState(null); // 로컬 스트림 상태
  const [remoteStream, setRemoteStream] = useState(null); // 원격 스트림 상태
  const [isAudio, setIsAudio] = useState(true); // 오디오 활성화 여부
  const [isVideo, setIsVideo] = useState(true); // 비디오 활성화 여부
  const [isVideoFront, setIsVideoFront] = useState(true); // 전면 카메라 사용 여부

  const requestCameraAndAudioPermissions = async () => {
    // 카메라랑 마이크에 대한 권한을 가져옴
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
      return (
        granted['android.permission.CAMERA'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.RECORD_AUDIO'] ===
          PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // 미디어 장치로부터 오디오 및 비디오 스트림을 가져옵니다.
  const getMedia = async () => {
    try {
      // 사용자 미디어 장치에서 오디오 및 비디오 스트림을 가져옵니다.
      const stream = await mediaDevices.getUserMedia({
        audio: isAudio,
        video: isVideo
          ? {
              frameRate: 30,
              facingMode: isVideoFront ? 'user' : 'environment', // 전면 카메라 또는 후면 카메라
            }
          : false,
      });
      setLocalStream(stream); // 로컬 스트림 상태 업데이트
      stream.getTracks().forEach(track => {
        pc.current.addTrack(track, stream);
      }); // RTCPeerConnection에 로컬 스트림 추가
    } catch (error) {
      Alert.alert(error instanceof Error ? error.message : String(error));
    }
  };

  // WebSocket 메시지를 생성하는 함수입니다.
  // WebSocket에서 사용할 이벤트 타입과 데이터를 JSON 문자열로 반환합니다.
  const makeMessage = (type, data) => {
    const event = {type, data}; // 이벤트 객체 생성
    return JSON.stringify(event); // JSON 문자열로 변환
  };

  // WebRTC PeerConnection과 WebSocket 연결을 설정하는 함수입니다.
  const makeConnection = () => {
    // ICE 후보가 생성될 때 호출되는 이벤트 핸들러입니다.
    pc.current.onicecandidate = event => {
      const {candidate} = event;
      if (candidate) {
        ws.current.send(
          makeMessage('ice', {candidate, targetId: targetUserId}),
        ); // ICE 후보를 웹소켓을 통해 전송
      }
    };

    // 원격 스트림이 추가될 때 호출되는 이벤트 핸들러입니다.
    pc.current.ontrack = event => {
      setRemoteStream(event.streams[0]); // 원격 스트림 상태 업데이트
    };

    // 웹소켓 연결이 열릴 때 호출되는 이벤트 핸들러입니다.
    ws.current.onopen = () => {
      Alert.alert('연결 성공'); // 연결 성공 알림
    };

    // 웹소켓 연결이 닫힐 때 호출되는 이벤트 핸들러입니다.
    ws.current.onclose = () => {
      Alert.alert('연결이 종료되었습니다'); // 연결 종료 알림
    };

    // 웹소켓에서 오류가 발생할 때 호출되는 이벤트 핸들러입니다.
    ws.current.onerror = error => {
      Alert.alert(error instanceof Error ? error.message : String(error));
    };

    // 웹소켓에서 메시지를 수신할 때 호출되는 이벤트 핸들러입니다.
    ws.current.onmessage = event => {
      const {type, data} = JSON.parse(event.data); // 메시지에서 타입과 데이터 추출

      switch (type) {
        case 'offer':
          (async function (offer) {
            await pc.current.setRemoteDescription(offer); // 원격 설명 설정
            const answer = await pc.current.createAnswer(); // 응답 생성
            await pc.current.setLocalDescription(answer); // 로컬 설명 설정
            ws.current.send(
              makeMessage('answer', {answer, targetId: data.senderId}),
            ); // 응답을 웹소켓을 통해 전송
          })(data);
          break;

        case 'answer':
          (async function (answer) {
            await pc.current.setRemoteDescription(answer); // 원격 설명 설정
          })(data);
          break;

        case 'ice':
          (async function (ice) {
            await pc.current.addIceCandidate(ice.candidate); // ICE 후보를 PeerConnection에 추가
          })(data);
          break;
      }
    };
  };

  // WebRTC 연결 요청을 보내는 함수입니다.
  const sendOffer = async () => {
    try {
      const offer = await pc.current.createOffer(); // 오퍼 생성
      await pc.current.setLocalDescription(offer); // 로컬 설명 설정
      ws.current.send(
        makeMessage('offer', {offer, targetId: targetUserId, senderId: userId}),
      ); // 오퍼를 웹소켓을 통해 전송
    } catch (error) {
      Alert.alert(error instanceof Error ? error.message : String(error));
    }
  };

  // 사용자 등록 및 WebRTC 연결 초기화
  const initCall = async () => {
    try {
      // regist는 로그인할 때도 하면 좋을 거 같은데
      const registerMessage = makeMessage('register', {userId});
      ws.current.send(registerMessage);
      makeConnection();
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : String(error),
      );
    }
  };

  // 컴포넌트가 마운트될 때 호출됩니다.
  useEffect(() => {
    const initialize = async () => {
      const permissionGranted = await requestCameraAndAudioPermissions();
      if (permissionGranted) {
        await getMedia();
        initCall();
      } else {
        Alert.alert('Permissions not granted');
      }
    };
    initialize();
  }, []);

  useEffect(() => {
    // 통화 페이지 들어가면 targetUserId에게 요청 보냄
    if (targetUserId) {
      sendOffer();
    }
  }, [targetUserId]);

  // 비디오 프론트, 비디오, 오디오 설정이 변경될 때 호출됩니다.
  useEffect(() => {
    getMedia(); // 설정 변경에 따라 미디어 스트림을 다시 가져옵니다.
  }, [isVideoFront, isVideo, isAudio]);

  // 훅에서 사용할 상태와 설정 함수를 반환합니다.
  return {
    localStream,
    remoteStream,
    isVideoFront,
    isVideo,
    isAudio,
    setIsVideoFront,
    setIsVideo,
    setIsAudio,
  };
};

export default useMySocket;
