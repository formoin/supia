import {View, Text, StyleSheet, Pressable} from 'react-native';
import Label from '../../Atoms/ListItem';
import React, {useState} from 'react';
import axios from 'axios';
import ReadMessageModal from './ReadMessageModal';
import loginStore from '../../store/useLoginStore';
import moment from 'moment';
import {Server_IP} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FriendRequestBox({friends, getFriends}) {
  const [friend, setFriend] = useState(friends);
  const [modalVisible, setModalVisible] = useState(false);
  // const { token } = loginStore.getState();

  const formatTime = dateString => {
    return dateString
      ? moment(dateString).format('YYYY/MM/DD HH:mm')
      : '시간 정보 없음';
  };

  const handleAccept = async messageId => {
    const token = await AsyncStorage.getItem('key');

    try {
      const response = await axios.get(`${Server_IP}/friends/accept`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
        params: {messageId},
      });
      if (response.status === 200) {
        console.log('친구 요청 수락 성공');
        alert('친구 요청을 수락했습니다.');
        removeFriendItem(messageId);
      } else {
        console.log('친구 요청 수락 실패');
      }
    } catch (error) {
      console.error('친구 요청 수락 중 오류 발생:', error);
    }
  };

  const handleDelete = async messageId => {
    const token = await AsyncStorage.getItem('key');

    try {
      const response = await axios.delete(`${Server_IP}/friends/refuse`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
        params: {messageId},
      });
      if (response.status === 200) {
        console.log('친구 요청 거절 성공');
        alert('친구 요청을 거절했습니다.');
        removeFriendItem(messageId);
      } else {
        console.log('친구 요청 거절 실패');
      }
    } catch (error) {
      console.error('친구 요청 거절 중 오류 발생:', error);
    }
  };

  const removeFriendItem = messageId => {
    setFriend(prevFriend =>
      prevFriend.filter(item => item.messageId !== messageId),
    );
  };

  //  if (!friends || friends.length === 0) {
  //    return <Text>친구 요청이 없습니다.</Text>;
  //  }

  return (
    <View>
      {friends.map(friendItem => (
        <View key={friendItem.messageId} style={styles.container}>
          <View style={styles.messageHeader}>
            <Text style={styles.messageText}>시스템</Text>
            <Text style={styles.timeText}>
              {formatTime(friendItem.sentTime)}
            </Text>
          </View>
          <View style={styles.messageContent}>
            <Label
              title={friendItem.fromMemberNickname || '제목 없음'}
              content={friendItem.content || '내용이 없습니다.'}
              url={friendItem.fromMemberImg || '기본 이미지 URL'}
            />
            <Pressable
              style={styles.green}
              onPress={() => handleAccept(friendItem.messageId)}>
              <Text style={styles.buttonText}>수락</Text>
            </Pressable>
            <Pressable
              style={styles.red}
              onPress={() => handleDelete(friendItem.messageId)}>
              <Text style={styles.buttonText}>거절</Text>
            </Pressable>
          </View>
        </View>
      ))}

      <ReadMessageModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        friendName={friend[0]?.fromMemberNickname || 'Unknown'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: '100%',
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
    marginLeft: 20,
  },
  messageText: {
    fontSize: 16,
  },
  timeText: {
    fontSize: 16,
    color: 'gray',
  },
  green: {
    width: 45,
    height: 35,
    backgroundColor: '#A2AA7B',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    marginRight: 50,
  },
  red: {
    width: 45,
    height: 35,
    backgroundColor: '#C28C7E',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    marginRight: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
});
