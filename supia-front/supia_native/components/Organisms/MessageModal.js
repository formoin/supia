import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PopupHeader from '../Atoms/PopupHeader';
import Button_Green from '../Atoms/Button_Green';
import Button_Red from '../Atoms/Button_Red';

const MessageModal = ({
  visible,
  onClose,
  isEditMode,
  recipient,
  setRecipient,
  message,
  setMessage,
  imageUrl,
  onAccept,
  onReject,
  onSend,
  onCheck,
}) => {
  const [messageToSend, setMessageToSend] = useState('');

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            {imageUrl ? (
              <PopupHeader Label="선물" onClose={onClose} />
            ) : (
              <PopupHeader Label="메세지" onClose={onClose} />
            )}
          </View>

          <View style={styles.recipientSection}>
            <Text style={{padding: 10}}>TO:</Text>
            <TextInput
              style={styles.recipientInput}
              value={recipient}
              onChangeText={setRecipient}
              editable={isEditMode}
            />
            {isEditMode && (
              <TouchableOpacity onPress={() => setRecipient('')}>
                <Text style={styles.clearButton}>X</Text>
              </TouchableOpacity>
            )}
          </View>
          {/* 메세지와 이미지를 구분 -> 이미지 url이 들어오는 경우 이미지로 간주하고
            중앙 부분은 이미지를 출력, 아래 부분은 안내 메세지를 출력한다.
            메세지의 경우 중앙 부분은 받은 메세지를 출력, 하단 부분은 송신할 메세지를 입력*/}
          {imageUrl ? (
            <Image source={{uri: imageUrl}} style={styles.giftImage} />
          ) : (
            <TextInput
              style={styles.messageBox}
              value={message}
              onChangeText={setMessage}
              editable={imageUrl}
              multiline
            />
          )}

          {imageUrl ? (
            <TextInput
              style={styles.SendMessageBox}
              value={message}
              onChangeText={setMessage}
              editable={!imageUrl}
              multiline
            />
          ) : (
            <TextInput
              style={styles.SendMessageBox}
              value={messageToSend}
              onChangeText={messageToSend}
              editable={imageUrl}
              multiline
            />
          )}

          {/* 메세지와 이미지를 구분 -> 이미지가 있으면 수락과 거절
          텍스트만 있으면 답장과 확인으로 구분*/}

          <View style={styles.buttonContainer}>
            {imageUrl ? (
              <Button_Green label="수락" onPress={onAccept} />
            ) : (
              <Button_Green label="답장" onPress={onSend} />
            )}
            {imageUrl ? (
              <Button_Red label="거절" onPress={onReject} />
            ) : (
              <Button_Red label="확인" onPress={onCheck} />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  recipientSection: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#A9A9A9',
    borderRadius: 40,
  },
  recipientInput: {
    flex: 1,
    marginLeft: 5,
  },
  clearButton: {
    marginLeft: 5,
    color: 'red',
  },
  giftImage: {
    width: 100,
    height: 100,
    marginTop: 20,
  },
  messageBox: {
    minHeight: 120,
  },
  SendMessageBox: {
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
    minHeight: 120,
  },
  imageInput: {
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
});

export default MessageModal;
