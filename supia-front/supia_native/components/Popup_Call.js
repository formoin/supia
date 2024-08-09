import React from 'react';
import Searchbar from './Organisms/SearchBar';
import Octicons from 'react-native-vector-icons/Octicons';
import Label from './Atoms/ListItem';
import Feather from 'react-native-vector-icons/Feather';
import {StyleSheet, View, Text, Modal, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {TouchableWithoutFeedback} from 'react-native';
import useWebSocketStore from './Pages/WebRTC/SocketStore';

import {
  RTCPeerConnection,
  RTCSessionDescription,
  mediaDevices,
} from 'react-native-webrtc';
import {WS_IP, TURN_URL, TURN_ID, TURN_CREDENTIAL} from '@env';
const ICE_SERVERS = [
  {
    urls: [TURN_URL],
    username: TURN_ID,
    credential: TURN_CREDENTIAL,
  },
];

// 버튼을 누르면 각 항목의 userId를 TargetUserId로 받아줘야 함
const Popup_Call = ({visible, onClose, onOpenPopup}) => {
  const [userId, setUserId] = useState('');
  const [targetUserId, setTargetUserId] = useState('');
  const connect = useWebSocketStore(state => state.connect);
  const setWebSocket = useWebSocketStore(state => state.setWebSocket);
  const peerConnectionRef = useRef(null);

  const navigation = useNavigation();

  const goCallPage = async () => {
    // 통화 시 ws 서버를 연결하고
    const ws = connect(WS_IP, token);
    setWebSocket(ws);

    // 인증을 받는다
    ws.onmessage = async message => {
      const data = JSON.parse(message.data);
      // 인증 성공 메시지를 수신했을 때
      if (data.type === 'authenticated') {
        console.log('User authenticated');
        // 인증된 사용자 정보를 부모 컴포넌트에 전달
        onAuthenticated(ws, data.userId);

        peerConnectionRef.current = new RTCPeerConnection({
          iceServers: ICE_SERVERS,
        });
      }
    };

    // localStream 설정하고
    const localStream = await getUserMedia();
    localStream.getTracks().forEach(track => {
      peerConnectionRef.current.addTrack(track, localStream);
    });

    // 통화 하고 싶은 사람한테 메세지를 보내줘야 함

    // 메세지를 전한 다음에는 Call페이지로 이동해서 수신을 대기
    // 통화를 요청한 사람이 answer를 해주는 사람이라서 isCaller가 되면 안돼!!
    navigation.navigate('Call', {
      isCaller: false,
      targetUserId: targetUserId,
      userId: userId,
    });
  };

  // 통화를 받는 사람이 offer보내는 함수 작성
  const handleAcceptCall = async offerUser => {
    const ws = connect(WS_IP, token);
    setWebSocket(ws);

    // 인증을 받는다
    ws.onmessage = async message => {
      const data = JSON.parse(message.data);
      // 인증 성공 메시지를 수신했을 때
      if (data.type === 'authenticated') {
        console.log('User authenticated');
        // 인증된 사용자 정보를 부모 컴포넌트에 전달
        onAuthenticated(ws, data.userId);

        peerConnectionRef.current = new RTCPeerConnection({
          iceServers: ICE_SERVERS,
        });
      }
    };

    //localStream 설정
    const localStream = await getUserMedia();
    localStream.getTracks().forEach(track => {
      peerConnectionRef.current.addTrack(track, localStream);
    });

    // 얘가 offer를 보내는 사람이니까 isCaller true 처리
    navigation.navigate('Call', {
      isCaller: true,
      targetUserId: offerUser,
      userId: userId,
    });
  };

  // 유저의 카메라, 오디오를 가져오는 단계
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

  if (!visible) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBackground}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View style={styles.titleRow}>
                <Text style={styles.modalTitle}>연락처</Text>
                <Pressable onPress={onClose}>
                  <Octicons name="x" size={30} />
                </Pressable>
              </View>
              <Searchbar active={true} style={styles.search} />
              <View style={styles.line} />
              <View style={styles.callOptionsRow}>
                <Label
                  pic="user"
                  title="mill"
                  content="김미량"
                  name="phone-call"
                  onClose={onClose}
                  onOpenPopup={onOpenPopup}
                />
                <Pressable onPress={goCallPage}>
                  <Feather name="video" size={24} />
                </Pressable>
              </View>
              <View style={styles.line} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default Popup_Call;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  line: {
    width: 290,
    height: 1,
    borderWidth: 1,
    borderColor: '#A2AA7B',
    opacity: 1,
    marginVertical: 10,
  },
  callOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 30,
    width: '100%',
  },
});
