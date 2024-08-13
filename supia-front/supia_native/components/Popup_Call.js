import React, {useState, useRef} from 'react';
import Searchbar from './Organisms/SearchBar';
import Octicons from 'react-native-vector-icons/Octicons';
import Label from './Atoms/ListItem';
import Feather from 'react-native-vector-icons/Feather';
import {StyleSheet, View, Text, Modal, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {TouchableWithoutFeedback} from 'react-native';
import useWebSocketStore from './Pages/WebRTC/SocketStore';
import {Server_IP} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Popup_Call = ({
  visible,
  onClose,
  onOpenPopup,
  friends,
  memberId,
  memberName,
}) => {
  const [userId, setUserId] = useState('');
  const [targetUserId, setTargetUserId] = useState('');
  const connect = useWebSocketStore(state => state.connect);
  const setWebSocket = useWebSocketStore(state => state.setWebSocket);
  const peerConnectionRef = useRef(null);

  const navigation = useNavigation();

  const goCallPage = async friend => {
    setTargetUserId(friend.id); // 여기에 친구의 ID 설정

    navigation.navigate('Call', {
      isCaller: true,
      targetUserId: targetUserId,
      userId: memberId,
      memberName: memberName,
    });
  };

  const handleAcceptCall = async offerUser => {
    navigation.navigate('Call', {
      isCaller: false,
      targetUserId: offerUser,
      userId: memberId,
      memberName: memberName,
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
              <Searchbar active={true} />
              {friends.map(friend => (
                <View key={friend.id}>
                  <View style={styles.callOptionsRow}>
                    <Label
                      title={friend.nickname}
                      content={friend.name}
                      url={friend.profileImg}
                      name="phone-call"
                      onClose={onClose}
                      onOpenPopup={onOpenPopup}
                    />
                    <Pressable
                      onPress={() => goCallPage(friend)}
                      style={styles.callButton}>
                      <Feather name="video" size={24} />
                    </Pressable>
                  </View>
                </View>
              ))}
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
    height: 400,
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
  callOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 10,
    width: '90%',
  },
  callButton: {
    paddingLeft: 25,
  },
});
