import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import Label from '../../Atoms/ListItem';
import React, { useState } from 'react';
import axios from 'axios';
import ReadMessageModal from './ReadMessageModal';
import moment from 'moment';
import { Server_IP } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function FriendRequestBox({ friends, getFriends }) {
  const [friend, setFriend] = useState(friends);
  const [modalVisible, setModalVisible] = useState(false);

  const formatTime = (dateString) => {
    return dateString
      ? moment(dateString).format('YYYY/MM/DD HH:mm')
      : '시간 정보 없음';
  };

  const handleAccept = async (messageId) => {
    const token = await AsyncStorage.getItem('key');

    try {
      const response = await axios.get(`${Server_IP}/friends/accept`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
        params: { messageId },
      });
      if (response.status === 200) {
        console.log('친구 요청 수락 성공');
        alert('친구 요청을 수락했습니다.');
        getFriends()
        removeFriendItem(messageId);
      } else {
        console.log('친구 요청 수락 실패');
      }
    } catch (error) {
      console.error('친구 요청 수락 중 오류 발생:', error);
    }
  };

  const handleDelete = async (messageId) => {
    const token = await AsyncStorage.getItem('key');

    try {
      const response = await axios.delete(`${Server_IP}/friends/refuse`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
        params: { messageId },
      });
      if (response.status === 200) {
        console.log('친구 요청 거절 성공');
        alert('친구 요청을 거절했습니다.');
        getFriends()
        removeFriendItem(messageId);
      } else {
        console.log('친구 요청 거절 실패');
      }
    } catch (error) {
      console.error('친구 요청 거절 중 오류 발생:', error);
    }
  };

  const removeFriendItem = (messageId) => {
    setFriend((prevFriend) =>
      prevFriend.filter((item) => item.messageId !== messageId)
    );
  };

  return (
    <View>
      {friends.map((friendItem) => (
        <View key={friendItem.messageId} style={styles.container}>
          <View style={styles.messageHeader}>
            <Text style={styles.messageText}>시스템</Text>
            <Text style={styles.timeText}>{formatTime(friendItem.sentTime)}</Text>
          </View>
          <View style={styles.messageContent}>
            <Label
              title={friendItem.fromMemberNickname}
              content={friendItem.content}
              url={friendItem.fromMemberImg}
            />
            <Pressable
              style={styles.green}
              onPress={() => handleAccept(friendItem.messageId)}
            >
              <Text style={styles.buttonText}>수락</Text>
            </Pressable>
            <Pressable
              style={styles.red}
              onPress={() => handleDelete(friendItem.messageId)}
            >
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
    marginTop: height * 0.02, // 2% of screen height
    width: '100%',
    height: height * 0.12, // 12% of screen height
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.04, // 4% of screen width
    paddingVertical: height * 0.01, // 1% of screen height
  },
  messageContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: width * 0.04, // 4% of screen width
    paddingVertical: height * 0.01, // 1% of screen height
    marginLeft: width * 0.05, // 5% of screen width
  },
  messageText: {
    fontSize: width * 0.04, // 4% of screen width
  },
  timeText: {
    fontSize: width * 0.04, // 4% of screen width
    color: 'gray',
  },
  green: {
    width: width * 0.12, // 12% of screen width
    height: height * 0.045, // 4.5% of screen height
    backgroundColor: '#A2AA7B',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: height * 0.01, // 1% of screen height
    marginRight: width * 0.12, // 12% of screen width
  },
  red: {
    width: width * 0.12, // 12% of screen width
    height: height * 0.045, // 4.5% of screen height
    backgroundColor: '#C28C7E',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: height * 0.01, // 1% of screen height
    marginRight: width * 0.015, // 1.5% of screen width
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: width * 0.025, // 2.5% of screen width
  },
});