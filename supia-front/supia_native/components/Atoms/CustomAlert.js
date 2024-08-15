import React from 'react';
import { StyleSheet, View, Text, Modal, Pressable } from 'react-native';

const CustomAlert = ({ visible, message, onClose, title }) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.rectangle}>
          <View style={styles.messageContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
          </View>
          <Pressable 
            style={styles.button}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>확인</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 배경을 흐리게
  },
  rectangle: {
    width: '80%',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A2AA7B',
    justifyContent: 'space-between', // 버튼과 메시지 사이에 공간을 만듭니다.
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    height: '20%', // 높이를 설정합니다.
  },
  messageContainer: {
    flex: 1, // 남은 공간을 차지하여 세로 중앙 정렬
    justifyContent: 'center', // 세로 중앙 정렬
    alignItems: 'center', // 가로 중앙 정렬
  },
  message: {
    textAlign: 'center',
    marginBottom: 10, // 필요에 따라 조정 가능
    fontSize: 15,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10, // 필요에 따라 조정 가능
    fontSize: 17,
  },
  button: {
    backgroundColor: 'grey', // 버튼 색상을 초록색으로 변경
    borderRadius: 5,
    paddingVertical: 7, // 버튼의 세로 패딩을 늘려서 크기를 키움
    paddingHorizontal: 15, // 버튼의 가로 패딩
    alignItems: 'center',
  },
  buttonText: {
    color: 'white', // 글자 색상
    fontSize: 14, // 글자 크기
  }
});

export default CustomAlert;