
import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';

import {
  RTCView,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  mediaDevices,
} from 'react-native-webrtc';
import useWebSocketStore from './SocketStore';
import {WS_IP, TURN_URL, TURN_ID, TURN_CREDENTIAL} from '@env';

const ICE_SERVERS = [
  {
    urls: [TURN_URL],
    username: TURN_ID,
    credential: TURN_CREDENTIAL,
  },

  {urls: 'stun:stun.l.google.com:19302'},

];

const CallComponent = ({route, navigation}) => {
  const {userId, targetUserId, isCaller} = route.params;
  const peerConnectionRef = useRef(null);
  const websocket = useWebSocketStore(state => state.websocket);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  useEffect(() => {
    console.log('userID' + userId);
    const initPeerConnection = async () => {
      if (!peerConnectionRef.current) {
        console.log('peerConnectionRef 형성');
        peerConnectionRef.current = new RTCPeerConnection({
          iceServers: ICE_SERVERS,
        });

        peerConnectionRef.current.oniceconnectionstatechange = () => {
          console.log(
            'ICE connection state:',
            peerConnectionRef.current.iceConnectionState,
          );
        };

        const localStream = await getUserMedia();
        localStream.getTracks().forEach(track => {
          console.log('Adding local track:', track);
          peerConnectionRef.current.addTrack(track, localStream);
        });
        setLocalStream(localStream);
      }
    };

    initPeerConnection();

    websocket.onmessage = async message => {
      try {
        const data = JSON.parse(message.data);
        console.log('WebSocket message received:', data);
        switch (data.type) {
          case 'offer':
            if (data.targetUserId === userId) {
              await handleOffer(data.offer);
            }
            break;
          case 'answer':
            console.log('answer 받음');
            if (data.targetUserId === userId) {
              console.log('handleAnswer 실행');
              await handleAnswer(data.answer);
            }
            break;
          case 'ice-candidate':
            if (data.targetUserId === userId) {
              await handleIceCandidate(data.candidate);
            }
            break;
          default:
            console.log('알 수 없는 메시지 타입:', data.type);
            break;
        }
      } catch (error) {
        console.error('JSON Parse error:', error);

      }
    };

    if (isCaller) {
      createOffer();
    }

    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [isCaller]);

  const handleOffer = async offer => {
    const ps = peerConnectionRef.current;
    ps.onicecandidate = event => {
      console.log('handleOffer onicecandidate 확인 : ' + event);

      if (event.candidate) {
        websocket.send(
          JSON.stringify({
            type: 'ice-candidate',
            candidate: event.candidate,
            targetUserId: targetUserId,
            fromUserId: userId,
          }),
        );
      }
    };

    ps.ontrack = event => {
      if (event.streams && event.streams[0]) {
        console.log('handleOffer setRemoteStream 확인 : ' + event.streams[0]);

        setRemoteStream(event.streams[0]);
      }
    };

    await ps.setRemoteDescription(new RTCSessionDescription(offer));
    console.log('handleOffer setRemoteDescription 확인 : ' + offer);
    const answer = await ps.createAnswer();
    await ps.setLocalDescription(answer);
    console.log('handleOffer setLocalDescription(answer) 확인 : ' + answer);


    websocket.send(
      JSON.stringify({
        type: 'answer',
        answer: answer,
        targetUserId: targetUserId,

        fromUserId: userId,

      }),
    );
  };

  const handleAnswer = async answer => {

    const pc = peerConnectionRef.current;
    console.log('handleAnswer peer connection 확인 : ' + pc);
    console.log('Setting remote description for answer:', answer);
    await pc.setRemoteDescription(new RTCSessionDescription(answer));
    console.log('Remote description for answer set');
  };

  const handleIceCandidate = async candidate => {
    const pc = peerConnectionRef.current;
    console.log('Adding received ICE candidate:', candidate);
    await pc.addIceCandidate(new RTCIceCandidate(candidate));
    console.log('ICE candidate added');
  };

  const createOffer = async () => {
    console.log('createOffer peer connection 확인 : ' + pc);
    const pc = peerConnectionRef.current;

    pc.onicecandidate = event => {
      console.log('createOffer onicecandidate 확인 : ' + event);

      if (event.candidate) {
        websocket.send(
          JSON.stringify({
            type: 'ice-candidate',
            candidate: event.candidate,
            targetUserId: targetUserId,
            fromUserId: userId,
          }),
        );
      }
    };

    pc.ontrack = event => {
      if (event.streams && event.streams[0]) {
        console.log('createOffer ontrack 확인 : ' + event.streams[0]);

        setRemoteStream(event.streams[0]);
      }
    };

    const localStream = await getUserMedia();
    localStream.getTracks().forEach(track => {
      pc.addTrack(track, localStream);
    });
    setLocalStream(localStream);

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    console.log('createOffer setLocalDescription(offer) 확인 : ' + offer);


    websocket.send(
      JSON.stringify({
        type: 'offer',
        offer: offer,
        targetUserId: targetUserId,
        fromUserId: userId,

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

export default CallComponent;
