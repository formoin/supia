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

export default function SendMessage({edit, fromMessage, onDelete}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(fromMessage);
  // const { token } = loginStore.getState()


  const messageDetail = useCallback(
    async messageId => {
      const token = await AsyncStorage.getItem('key');
      setLoading(true);
      const url = `${Server_IP}/messages/detail`;

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
        console.log('메시지 확인 성공');
      } else {
        console.log('메시지 확인 실패');
      }

    } catch (error) {
      console.error('메세지 확인 중 오류 발생:', error);
    } finally {
      setLoading(false);
    }
  }, []);

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
          ); // 삭제 후 상태 업데이트
          onDelete(); // 부모 컴포넌트에 메시지 삭제를 알림
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
      : '시간 정보 없음';
  };

  return (
    <View>
      {loading ? (
        <ActivityIndicator size="large" color="#A2AA7B" />
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
                url={message.toMemberImg}
                title={message.toMemberNickname}
                content={message.content}
              />
              <Pressable
                style={[
                  styles.button,
                  edit ? styles.deleteButton : styles.confirmButton,
                ]}
                onPress={() => handlePress(message)}>
                <Text style={styles.buttonText}>{edit ? '삭제' : '확인'}</Text>
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
            setSelectedMessage(null);
          }}
          type="text1"
          fromMessage={selectedMessage ? [selectedMessage] : []}
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
  confirmButton: {
    backgroundColor: '#A2AA7B',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
});
