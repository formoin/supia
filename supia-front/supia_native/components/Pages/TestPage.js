import React, {useEffect, useRef, useState} from 'react';
import {View, Button, StyleSheet} from 'react-native';
import {
  RTCView,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  mediaDevices,
} from 'react-native-webrtc';
import {WS_IP, TURN_URL, TURN_ID, TURN_CREDENTIAL} from '@env';

const ICE_SERVERS = {
  iceServers: [
    {
      urls: [TURN_URL],
      username: TURN_ID,
      credential: TURN_CREDENTIAL,
    },
  ],
};

const token =
  'Bearer ' +
  'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJydGNUZXN0M0BuYXZlci5jb20iLCJtZW1iZXJJZCI6NSwiaWF0IjoxNzIzMDE5NTMxLCJleHAiOjE3NTQ1NTU1MzF9.sCygAa7NjBVapBE3ZJr2d--VBfPARJLWCB_Stcw_ETJeGdI74nH8_2jDLGVXWY6YYSWLnPfzKXcnc9I2uKhs_A';

const WebRTCComponent = () => {
  const websocketRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  useEffect(() => {
    websocketRef.current = new WebSocket(WS_IP);

    websocketRef.current.onopen = () => {
      console.log('WebSocket connected');
      // 사용자 인증 로직
      const authMessage = {type: 'authenticate', token};
      websocketRef.current.send(JSON.stringify(authMessage));
    };

    websocketRef.current.onmessage = async message => {
      const data = JSON.parse(message.data);
      switch (data.type) {
        case 'authenticated':
          console.log('User authenticated');
          break;
        case 'offer':
          await handleOffer(data.offer);
          break;
        case 'answer':
          await handleAnswer(data.answer);
          break;
        case 'ice-candidate':
          await handleIceCandidate(data.candidate);
          break;
        default:
          break;
      }
    };

    websocketRef.current.onerror = error => {
      console.error('WebSocket error:', error);
    };

    websocketRef.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      websocketRef.current.close();
    };
  }, []);

  const handleOffer = async offer => {
    peerConnectionRef.current = new RTCPeerConnection({
      ICE_SERVERS,
    });

    peerConnectionRef.current.onicecandidate = event => {
      if (event.candidate) {
        websocketRef.current.send(
          JSON.stringify({
            type: 'ice-candidate',
            candidate: event.candidate,
          }),
        );
      }
    };

    peerConnectionRef.current.ontrack = event => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    await peerConnectionRef.current.setRemoteDescription(
      new RTCSessionDescription(offer),
    );

    const answer = await peerConnectionRef.current.createAnswer();
    await peerConnectionRef.current.setLocalDescription(answer);

    websocketRef.current.send(
      JSON.stringify({
        type: 'answer',
        answer: answer,
      }),
    );
  };

  const handleAnswer = async answer => {
    await peerConnectionRef.current.setRemoteDescription(
      new RTCSessionDescription(answer),
    );
  };

  const handleIceCandidate = async candidate => {
    await peerConnectionRef.current.addIceCandidate(
      new RTCIceCandidate(candidate),
    );
  };

  const createOffer = async () => {
    peerConnectionRef.current = new RTCPeerConnection({
      ICE_SERVERS,
    });

    peerConnectionRef.current.onicecandidate = event => {
      if (event.candidate) {
        websocketRef.current.send(
          JSON.stringify({
            type: 'ice-candidate',
            candidate: event.candidate,
          }),
        );
      }
    };

    peerConnectionRef.current.ontrack = event => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    const localStream = await getUserMedia();
    localStream.getTracks().forEach(track => {
      peerConnectionRef.current.addTrack(track, localStream);
    });
    setLocalStream(localStream);

    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);

    websocketRef.current.send(
      JSON.stringify({
        type: 'offer',
        offer: offer,
      }),
    );
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
    <View style={styles.container}>
      {localStream && (
        <RTCView
          streamURL={localStream.toURL()}
          style={styles.localVideo}
          objectFit="cover"
          mirror
        />
      )}
      {remoteStream && (
        <RTCView
          streamURL={remoteStream.toURL()}
          style={styles.remoteVideo}
          objectFit="cover"
        />
      )}
      <Button title="Start Call" onPress={createOffer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  localVideo: {
    width: 200,
    height: 150,
    position: 'absolute',
    bottom: 10,
    right: 10,
    zIndex: 1,
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
});

export default WebRTCComponent;
