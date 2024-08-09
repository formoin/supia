// HomeComponent.js
import React, {useState, useRef} from 'react';
import {View, Text, Button, TextInput} from 'react-native';
import {
  RTCPeerConnection,
  RTCSessionDescription,
  mediaDevices,
} from 'react-native-webrtc';
import {WS_IP, TURN_URL, TURN_ID, TURN_CREDENTIAL} from '@env';
import useWebSocketStore from './SocketStore';

const ICE_SERVERS = [
  {
    urls: [TURN_URL],
    username: TURN_ID,
    credential: TURN_CREDENTIAL,
  },
];

const HomeComponent = ({userId, navigation}) => {
  const [targetUserId, setTargetUserId] = useState('');
  const peerConnectionRef = useRef(null);
  const websocket = useWebSocketStore(state => state.websocket);
  const connect = useWebSocketStore(state => state.connect);
  const setUserId = useWebSocketStore(state => state.setUserId);

  const handleStartCall = async () => {

    peerConnectionRef.current = new RTCPeerConnection({
      iceServers: ICE_SERVERS,
    });

    const localStream = await getUserMedia();
    localStream.getTracks().forEach(track => {
      peerConnectionRef.current.addTrack(track, localStream);
    });

    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);
    console.log('target: ' + targetUserId);
    websocket.send(
      JSON.stringify({
        type: 'offer',
        offer: offer,
        targetUserId: targetUserId,
        fromUserId: userId,
      }),
    );

    navigation.navigate('Call', {
      isCaller: true,
      targetUserId: targetUserId,
      userId: userId,
    });
  };


  const getUserMedia = () => {
    return new Promise((resolve, reject) => {
      mediaDevices
        .getUserMedia({video: true, audio: true})
        .then(stream => {
          resolve(stream);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  return (
    <View>
      <Text>Welcome, {userId}</Text>
      <TextInput
        placeholder="Enter target user ID"
        value={targetUserId}
        onChangeText={setTargetUserId}
      />
      <Button title="Start Call" onPress={handleStartCall} />
    </View>
  );
};

export default HomeComponent;
