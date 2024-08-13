import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Label from '../../Atoms/ListItem';
import React, {useState, useCallback} from 'react';
import axios from 'axios';
import ReadMessageModal from './ReadMessageModal';
import moment from 'moment';
import loginStore from '../../store/useLoginStore';
import {Server_IP} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SentMessage({edit, toMessage, onDelete, getToMessage}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(toMessage);
  // const {token} = loginStore.getState();

  const messageDetail = useCallback(
    async messageId => {
      setLoading(true);
      const url = `${Server_IP}/messages/detail`;

      const token = await AsyncStorage.getItem('key');

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
          },
          params: {
            messageId: messageId,
          },
        });

        if (response.status === 200) {
          setSelectedMessage(response.data);
          console.log(response.data);
          console.log('메시지 확인 성공');
        } else {
          console.log('메시지 확인 실패');
        }
      } catch (error) {
        console.error('메세지 확인 중 오류 발생:', error);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const messageDelete = useCallback(
    async messageId => {
      const token = await AsyncStorage.getItem('key');

      setLoading(true);
      const url = `${Server_IP}/messages`;

      try {
        const response = await axios.delete(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
          },
          params: {
            messageId: messageId,
          },
        });

        if (response.status === 200) {
          console.log('메시지 삭제 성공');
          setMessages(prevMessages =>
            prevMessages.filter(message => message.messageId !== messageId),
          );
          onDelete();
          setModalVisible(false);
        } else {
          console.log('메시지 삭제 실패');
        }
      } catch (error) {
        console.error('메세지 삭제 중 오류 발생:', error);
      } finally {
        setLoading(false);
      }
    },
    [onDelete],
  );

  const handlePress = message => {
    if (edit) {
      messageDelete(message.messageId);
    } else {
      messageDetail(message.messageId);
      setSelectedMessage(message);
      setModalVisible(true);
    }
  };

  const formatSentTime = dateString => {
    return dateString
      ? moment(dateString).format('YYYY/MM/DD HH:mm')
      : '정보 없음';
  };

  const truncateMessage = content => {
    const firstLine = content.split('\n')[0];
    return content.length > firstLine.length
      ? `${firstLine} ...더보기`
      : firstLine;
  };

  return (
    <View>
      {loading ? ( // 로딩 상태 표시
        <ActivityIndicator size="large" color="#0000ff" />
      ) : messages && messages.length > 0 ? (
        messages.map(message => (
          <View key={message.messageId} style={styles.container}>
            <View style={styles.messageHeader}>
              <Text style={styles.messageText}>쪽지</Text>
              <Text style={styles.timeText}>
                {formatSentTime(message.sentTime)}
              </Text>
            </View>
            <View style={styles.messageContent}>
              <Label
                url={message.fromMemberImg}
                title={message.fromMemberNickname}
                content={truncateMessage(message.content)}
              />
              <Pressable
                style={[
                  styles.button,
                  edit
                    ? styles.deleteButton
                    : message.check
                    ? styles.readButtonGray
                    : styles.readButton,
                ]}
                onPress={() => handlePress(message)}>
                <Text style={styles.buttonText}>
                  {edit ? '삭제' : message.check ? '읽음' : '읽기'}
                </Text>
              </Pressable>
            </View>
          </View>
        ))
      ) : (
        <Text>메시지가 없습니다.</Text>
      )}

      {selectedMessage && (
        <ReadMessageModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
          }}
          type="text2"
          toMessage={[selectedMessage]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: '95%',
    height: 100,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  messageContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageText: {
    fontSize: 16,
  },
  timeText: {
    fontSize: 16,
    color: 'gray',
  },
  button: {
    width: 45,
    height: 35,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: '#C28C7E',
  },
  readButton: {
    backgroundColor: '#A2AA7B',
  },
  readButtonGray: {
    backgroundColor: '#BEBEBE',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
});
