import { View, Text, StyleSheet, Pressable } from 'react-native';
import Label from '../../Atoms/ListItem';
import React, { useState } from 'react';
import axios from 'axios';
import ReadMessageModal from './ReadMessageModal';

export default function MessageBox({messageId, type}) {
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    setModalVisible(true);
    markMessageAsRead(messageId);
  };


  const markMessageAsRead = async (messageId) => {
      const url = "https://i11b304.p.ssafy.io/api/messages/detail";

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
          },
          params: {
            messageId: messageId,
          }
        })

        if (response.status === 200) {
          console.log("메시지 읽음 처리 성공");
        } else {
          console.log("메시지 읽음 처리 실패");
        }
      } catch (error) {
        console.error("메세지 요청 중 오류 발생:", error);
      }
    };

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.messageHeader}>
          <Text style={styles.messageText}>쪽지</Text>
          <Text style={styles.timeText}>Today 10:30PM</Text>
        </View>
        <View style={styles.messageContent}>
          <Label pic="smileo" title="formoin" content="뭐하니?" />
          <Pressable style={styles.button} onPress={handlePress}>
            <Text style={styles.buttonText}>읽기</Text>
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
