import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Alert } from 'react-native';
import Button_Green from './Button_Green';

export default function TextFrame() {
  const [text, setText] = useState('');

  const NoteSubmit = () => {
    if (text.trim() === '') {
      Alert.alert('입력 오류', '텍스트를 입력해 주세요.');
      return;
    }
    // 실제 제출 처리 로직을 여기에 추가합니다.
    Alert.alert('제출 완료', `입력한 내용: ${text}`);
    setText(''); // 제출 후 입력 필드를 비웁니다.
  };

  return (
    <View style={styles.container}>
      <View style={styles.rectangle}>
        <TextInput
          style={styles.textInput}
          placeholder="내용을 입력하세요"
          value={text}
          onChangeText={setText}
          multiline // 여러 줄 입력을 허용합니다.
        />
      </View>
      <Button_Green label="보내기" onPress={NoteSubmit}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center', // 수직으로 가운데 정렬
    alignItems: 'center', // 수평으로 가운데 정렬
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 16, // 버튼과의 간격을 위해 여백 추가
  },
  textInput: {
    width: '100%',
    height: '100%',
    padding: 8,
    fontSize: 16,
  },
});
