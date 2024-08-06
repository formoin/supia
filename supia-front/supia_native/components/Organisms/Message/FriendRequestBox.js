import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import Label from '../../Atoms/ListItem';
import React, { useState } from 'react';
import axios from 'axios';
import ReadMessageModal from './ReadMessageModal';

export default function FriendRequestBox({messageId, friendName}) {
  const [modalVisible, setModalVisible] = useState(false);

  const okPress = () => {
    handleAccept(messageId)
    alert(`${friendName}님의 친구 요청을 수락했습니다.`)
  };

  const noPress = () => {
    handleDelete(messageId)
    alert(`${friendName}님의 친구 요청을 거절했습니다.`)
  };

  const handleAccept = async ({messageId}) => { // 친구 요청 수락
      try {
        const response = await axios.get("http://i11b304.p.ssafy.io/api/friends/accept");
      } catch (error) {
        console.error("친구 수락 실패:", error);
      }
  };

  const handleDelete = async ({messageId}) => { // 친구 요청 거절
      try {
        const response = await axios.delete("http://i11b304.p.ssafy.io/api/friends/refuse");
      } catch (error) {
        console.error('친구 거절 실패', error);
      }
  };

  const markMessageAsRead = async (messageId) => {
      const url = "http://i11b304.p.ssafy.io/api/messages/detail";
      const data = { is_check: true };

      try {
        const response = await axios.patch(url, data)

        if (response.status === 200) {
          console.log("메시지 읽음 처리 성공");
        } else {
          console.log("메시지 읽음 처리 실패");
        }
      } catch (error) {
        console.error("요청 중 오류 발생:", error);
      }
  };

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.messageHeader}>
          <Text style={styles.messageText}>시스템</Text>
          <Text style={styles.timeText}>Today 10:30PM</Text>
        </View>
        <View style={styles.messageContent}>
          <Label pic="infocirlceo" title="친구 신청" content={`${friendName}님이 친구를 요청했습니다.`} />
          <Pressable style={styles.green} onPress={okPress}>
            <Text style={styles.buttonText}>수락</Text>
          </Pressable>
          <Pressable style={styles.red} onPress={noPress}>
            <Text style={styles.buttonText}>거절</Text>
          </Pressable>
        </View>
      </View>

      <ReadMessageModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        friendName="formoin"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: '100%',
    height: 100,
    backgroundColor: '#ECEADE',
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
    marginRight: 10
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
});
