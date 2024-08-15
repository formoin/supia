import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import PopupHeader from '../../Atoms/PopupHeader';
import Searchbar from '../../Organisms/SearchBar';
import Green from '../../Atoms/Button_Green';
import ReplyMessage from './ReplyMessageModal';
import moment from 'moment';

export default function ReadMessageModal({ visible, onClose, type, fromMessage, toMessage }) {
  const [isReplyModalVisible, setReplyModalVisible] = useState(false);

  const handleReplyPress = () => {
    onClose()
    setReplyModalVisible(true);
  };

  const handleReplyClose = () => {
    setReplyModalVisible(false);
  };

  const formatSentTime = (dateString) => {
    return dateString ? moment(dateString).format('YYYY/MM/DD HH:mm') : '정보 없음';
  };
  const messageContent = type === 'text1' ? fromMessage : toMessage;
  // console.log(messageContent)

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <PopupHeader Label="메세지 확인" onClose={onClose} />
            {messageContent && messageContent.length > 0 ? (
              <>
                <Text style={styles.timeText}>보낸 시간: {formatSentTime(messageContent[0].sentTime)}</Text>
                <Searchbar active={false} searchName={type === 'text1' ? messageContent[0].toMemberNickname : messageContent[0].fromMemberNickname} />
                <View style={styles.rectangle}>
                  <Text style={styles.text}>{messageContent[0].content}</Text>
                </View>
                {type === 'text1' ? (
                  <Green label="확인완료" onPress={onClose} />
                ) : (
                  <Green label="답장하기" onPress={handleReplyPress} />
                )}
              </>
            ) : (
              <Text style={styles.timeText}>보낸 시간: 정보 없음</Text>
            )}
          </View>
        </View>
      </Modal>

      <ReplyMessage visible={isReplyModalVisible} onClose={handleReplyClose} toMessage={toMessage} />
    </>
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
    height: 166,
    marginTop: 20,
    marginBottom: 10,
    flexShrink: 0,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A2AA7B',
    opacity: 1,
  },
  text: {
    padding: 10,
  },
});
