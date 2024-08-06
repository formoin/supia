import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Alert } from 'react-native';
import Button_Green from './Button_Green';
import axios from 'axios';

export default function TextFrame({ memberId, friendId, onClose }) {
  const [text, setText] = useState('');

  const sendMessage = async () => {
    const Message = {
      fromMemberId: memberId,
      toMemberId: friendId,
      content: text,
    };

    try {
      const response = await axios.post('http://i11b304.p.ssafy.io/api/messages', Message);

      if (response.status === 200) {
        console.log("메세지 보내기 성공");
        Alert.alert('전송 완료', '메세지가 성공적으로 전송되었습니다.');
        setText('');
        onClose();
      } else {
        console.log("메세지 보내기 실패");
        Alert.alert('전송 실패', '메세지 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error("요청 중 오류 발생:", error);
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
    height: 207.044,
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
