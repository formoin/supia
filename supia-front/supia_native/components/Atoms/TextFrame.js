import React, {useState} from 'react';
import {StyleSheet, View, TextInput, Alert} from 'react-native';
import Button_Green from './Button_Green';
import axios from 'axios';
import loginStore from '../store/useLoginStore';
import useStore from '../store/useStore';
import {Server_IP} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from './CustomAlert';

export default function TextFrame({friend, user, page, onClose}) {
  const [text, setText] = useState('');
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const {memberId} = useStore();

  const sendMessage = async () => {
    const token = await AsyncStorage.getItem('key');

    const toMemberId = page === 'search' ? user.memberId : friend.memberId;
    const Message = {
      fromMemberId: memberId,
      toMemberId: toMemberId,
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
        setAlertTitle('전송 완료')
        setAlertMessage('메세지가 성공적으로 전송되었습니다.')
        setIsAlertVisible(true);
        Alert.alert('전송 완료', '메세지가 성공적으로 전송되었습니다.');
        setText('');
        if (onClose) {
          onClose();
        }
      } else {
        console.log('메세지 보내기 실패');
        Alert.alert('전송 실패', '메세지 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('요청 중 오류 발생:', error);
      Alert.alert('오류', '메세지 전송 중 오류가 발생했습니다.');
    }
  };

  const NoteSubmit = () => {
    if (text.trim() === '') {
      Alert.alert('입력 오류', '텍스트를 입력해 주세요.');
      return;
    }
    sendMessage();
  };

  return (
    <View style={styles.container}>
      <View style={styles.rectangle}>
        <TextInput
          style={styles.textInput}
          placeholder="내용을 입력하세요"
          value={text}
          onChangeText={setText}
          multiline
        />
      </View>
      <Button_Green label="보내기" onPress={NoteSubmit} />

      <CustomAlert 
        visible={isAlertVisible}
        onClose={() => setIsAlertVisible(false)} 
        title={alertTitle}
        message={alertMessage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  rectangle: {
    width: 277,
    height: 207,
    flexShrink: 0,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A2AA7B',
    opacity: 1,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  textInput: {
    width: '100%',
    padding: 8,
    fontSize: 16,
  },
});
