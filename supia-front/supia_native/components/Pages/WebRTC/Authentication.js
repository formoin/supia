import React, {useEffect, useRef, useState} from 'react';
import {View, Text, Button, TextInput} from 'react-native';
import useWebSocketStore from './SocketStore';
import {WS_IP, TURN_URL, TURN_ID, TURN_CREDENTIAL} from '@env';
import {RTCPeerConnection, mediaDevices} from 'react-native-webrtc';

const SIGNALING_SERVER_URL = WS_IP;
const token =
  'Bearer ' +
  'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJydGNUZXN0M0BuYXZlci5jb20iLCJtZW1iZXJJZCI6NSwiaWF0IjoxNzIzMTc1OTkwLCJleHAiOjE3NTQ3MTE5OTB9.f4ZfnXG4P3jxXxlr5zr28FM1ddZq7MMbLjuqE7rrvAYtnN3iPTIAMvxEfOU_1SVMJgviWf76N2TsHdBxf3E1Bw';

const ICE_SERVERS = [
  {
    urls: [TURN_URL],
    username: TURN_ID,
    credential: TURN_CREDENTIAL,
  },
];

const AuthComponent = ({onAuthenticated}) => {
  const [userId, setUserId] = useState(''); // 사용자 ID 상태
  const connect = useWebSocketStore(state => state.connect);
  const peerConnectionRef = useRef(null); // RTCPeerConnection 인스턴스를 저장할 참조
  const setWebSocket = useWebSocketStore(state => state.setWebSocket);

  const handleConnect = () => {
    const ws = connect(SIGNALING_SERVER_URL, token);

    ws.onmessage = async message => {
      const data = JSON.parse(message.data);
      // 인증 성공 메시지를 수신했을 때
      if (data.type === 'authenticated') {
        console.log('User authenticated');
        // 인증된 사용자 정보를 부모 컴포넌트에 전달
        onAuthenticated(ws, userId);

      }
    };
  };

  return (
    <View>
      {/* 사용자 ID 입력 필드 */}
      <TextInput
        placeholder="Enter your user ID"
        value={userId}
        onChangeText={setUserId}
      />
      {/* 연결 버튼 클릭 시 handleConnect 함수 호출 */}
      <Button title="Connect" onPress={handleConnect} />
    </View>
  );
};

export default AuthComponent;
