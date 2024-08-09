import React, { useEffect, useRef, useState } from "react";
import { Alert, PermissionsAndroid } from "react-native";
import {
  RTCPeerConnection,
  mediaDevices,
  RTCSessionDescription,
  RTCIceCandidate,
} from "react-native-webrtc";
import { WS_IP, TURN_URL, TURN_ID, TURN_CREDENTIAL } from "@env";


const token = " ";

const configuration = {
  iceServers: [
    {
      urls: [TURN_URL],
      username: TURN_ID,
      credential: TURN_CREDENTIAL,
    },
  ],
};

const useMySocket = (userId, targetUserId) => {
  const ws = useRef(null); // WebSocket 인스턴스를 저장하기 위한 ref
  const pc = useRef(new RTCPeerConnection(configuration)); // WebRTC 연결을 위한 RTCPeerConnection 인스턴스
  const [localStream, setLocalStream] = useState(null); // 로컬 비디오 및 오디오 스트림
  const [remoteStream, setRemoteStream] = useState(null); // 원격 비디오 및 오디오 스트림
  const [isAudio, setIsAudio] = useState(true); // 오디오 사용 여부 상태
  const [isVideo, setIsVideo] = useState(true); // 비디오 사용 여부 상태
  const [isVideoFront, setIsVideoFront] = useState(true); // 전면/후면 카메라 전환 상태
  const [isWebSocketReady, setIsWebSocketReady] = useState(false);

  // 카메라 및 오디오 권한 요청 함수
  const requestCameraAndAudioPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ],
        {
          title: "카메라 및 마이크 권한 요청",
          message: "통화를 위해 카메라 및 마이크에 대한 권한이 필요합니다.",
          buttonNeutral: "나중에",
          buttonNegative: "취소",
          buttonPositive: "수락",
        }
      );
      return (
        granted["android.permission.CAMERA"] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted["android.permission.RECORD_AUDIO"] ===
          PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // 로컬 미디어 스트림을 가져오는 함수
  const getMedia = async () => {
    try {
      const stream = await mediaDevices.getUserMedia({
        audio: isAudio,
        video: isVideo
          ? { frameRate: 30, facingMode: isVideoFront ? "user" : "environment" }
          : false,
      });
      setLocalStream(stream);
      stream.getTracks().forEach((track) => {
        pc.current.addTrack(track, stream); // 각 트랙을 RTCPeerConnection에 추가
      });
    } catch (error) {
      Alert.alert(error instanceof Error ? error.message : String(error));
    }
  };

  // WebSocket 메시지를 만드는 함수
  const makeMessage = (type, data) => {
    const event = { type, data };
    return JSON.stringify(event);
  };

  // WebRTC 연결 설정 함수
  const makeConnection = () => {
    console.log("메이크 커넥션 시작");
    pc.current.onicecandidate = (event) => {
      const { candidate } = event;
      if (candidate && ws.current) {
        ws.current.send(
          makeMessage("ice", { candidate, targetId: targetUserId })
        );
      }
    };

    pc.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]); // 원격 스트림을 상태로 설정
    };

    ws.current.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);

      if (type === "authenticated") {
        console.log("Authenticated successfully");
        const registerMessage = makeMessage("register", { userId });
        ws.current.send(registerMessage);
        console.log(registerMessage);
      } else if (type === "register") {
        console.log("register 메세지 수신");

        // 등록 메시지를 받으면 offer 메시지 전송
        if (data.userId === targetUserId) {
          sendOffer();
        }

      } else if (type === 'offer') {
        console.log('offer 메세지 수신')(async function (offer) {
          await pc.current.setRemoteDescription(
            new RTCSessionDescription(offer)
          );
          const answer = await pc.current.createAnswer();
          await pc.current.setLocalDescription(answer);
          ws.current.send(
            makeMessage("answer", { answer, targetId: data.senderId })
          );
        })(data);
      } else if (type === "answer") {
        console.log("answer 메세지 수신")(async function (answer) {
          await pc.current.setRemoteDescription(
            new RTCSessionDescription(answer)
          );
        })(data);
      } else if (type === "ice") {
        console.log("ice 메세지 수신")(async function (ice) {
          await pc.current.addIceCandidate(new RTCIceCandidate(ice.candidate));
        })(data);
      }
    };

    ws.current.onclose = () => {
      endCall();
      console.log("종료");
      Alert.alert("WebSocket connection closed.");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error: ", error);
      Alert.alert(error instanceof Error ? error.message : String(error));
    };
  };

  // 오퍼 생성 및 전송 함수
  const sendOffer = async () => {
    console.log("send offer 시작");
    try {
      const offer = await pc.current.createOffer();
      await pc.current.setLocalDescription(offer);
      ws.current.send(
        makeMessage("offer", {
          offer,
          targetId: targetUserId,
          senderId: userId,
        })
      );
      console.log("보내기 성공");
    } catch (error) {
      Alert.alert(error instanceof Error ? error.message : String(error));
    }
  };

  // 초기 WebSocket 연결 설정 함수
  const initCall = async () => {
    try {
      ws.current = new WebSocket("wss://i11b304.p.ssafy.io/api/ws");

      ws.current.onopen = () => {
        // WebSocket 연결이 열릴 때 JWT 토큰을 사용하여 인증 메시지 전송
        console.log("WebSocket connection opened");
        ws.current.send(JSON.stringify({ type: "authenticate", token }));

        makeConnection(); // WebSocket 연결 후 연결 설정
      };
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : String(error)
      );
    }
  };

  // 통화 종료 함수
  const endCall = () => {
    console.log("endcall 실행");
    pc.current.close();
    ws.current && ws.current.close();
    setRemoteStream(null); // 원격 스트림을 null로 설정하여 스트림 종료
  };

  // 컴포넌트가 마운트될 때 초기화 작업 수행
  useEffect(() => {
    const initialize = async () => {
      const permissionGranted = await requestCameraAndAudioPermissions();
      if (permissionGranted) {
        await getMedia(); // 권한이 허가되면 미디어 스트림 가져오기
        initCall(); // WebSocket 연결 초기화
      } else {
        Alert.alert("Permissions not granted");
      }
    };
    initialize();

    return () => {
      endCall(); // 컴포넌트 언마운트 시 연결 종료
    };
  }, []);

  // targetUserId가 변경될 때마다 오퍼를 전송
  useEffect(() => {
    if (targetUserId) {
      sendOffer();
    }
  }, [targetUserId]);

  // 비디오, 오디오 상태가 변경될 때마다 미디어 스트림 다시 가져오기
  useEffect(() => {
    getMedia();
  }, [isVideoFront, isVideo, isAudio]);

  return {
    localStream,
    remoteStream,
    isVideoFront,
    isVideo,
    isAudio,
    setIsVideoFront,
    setIsVideo,
    setIsAudio,
    getMedia,
    ws,
  };
};

export default useMySocket;