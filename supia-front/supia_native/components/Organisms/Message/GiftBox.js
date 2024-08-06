import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import Label from '../../Atoms/ListItem';
import React, { useState } from 'react';
import axios from 'axios';
import ReadMessageModal from './ReadMessageModal';

export default function GiftBox({messageId, friendName}) {
  const [modalVisible, setModalVisible] = useState(false);

  const onPress = () => {
    alert("선물 확인")
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
          <Label pic="infocirlceo" title="선물 도착" content={`${friendName}님이 개망초를 보냈습니다.`} />
          <Pressable style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>확인</Text>
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
    backgroundColor: '#A2AA7B',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
});
