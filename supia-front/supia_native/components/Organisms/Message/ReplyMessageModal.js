import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Modal, TextInput} from 'react-native';
import axios from 'axios';
import PopupHeader from '../../Atoms/PopupHeader';
import Searchbar from '../../Organisms/SearchBar';
import Green from '../../Atoms/Button_Green';
import loginStore from '../../store/useLoginStore';
import {Server_IP} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useStore from '../../store/useStore';

export default function ReplyMessageModal({visible, onClose, toMessage}) {
  const [text, setText] = useState('');
  const [friendName, setFriendName] = useState('');
  const {memberId} = useStore();

  useEffect(() => {
    if (toMessage && toMessage.length > 0) {
      setFriendName(toMessage[0].fromMemberNickname || '정보 없음');
    }
  }, [toMessage]);

  const sendMessage = async () => {
    const token = await AsyncStorage.getItem('key');

    const Message = {
      fromMemberId: memberId,
      toMemberId: 8,
      content: text,
    };

    try {
      const response = await axios.post(`${Server_IP}/messages`, Message, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
      });

      if (response.status === 200) {
        console.log('메세지 보내기 성공');
      } else {
        console.log('메세지 보내기 실패');
      }
    } catch (error) {
      console.error('요청 중 오류 발생:', error);
    }
  };

  const handleSend = () => {
    sendMessage();
    onClose();
    alert('메세지가 성공적으로 전송되었습니다.');
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <PopupHeader Label="답장하기" onClose={onClose} />
          <View style={styles.mar}></View>
          <Searchbar active={false} searchName={friendName} />
          <View style={styles.rectangle}>
            <TextInput
              style={styles.textInput}
              placeholder="내용을 입력하세요"
              value={text}
              onChangeText={setText}
              multiline
            />
          </View>
          <Green label="전송하기" onPress={handleSend} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: 290,
    height: 389,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    padding: 20,
  },
  timeText: {
    fontSize: 12,
    marginTop: 15,
    marginLeft: 8,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  rectangle: {
    width: 235,
    height: 194,
    marginTop: 20,
    marginBottom: 10,
    flexShrink: 0,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A2AA7B',
    opacity: 1,
  },
  mar: {
    marginTop: 15,
  },
  textInput: {
    padding: 10,
  },
});
