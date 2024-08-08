import { View, Text, StyleSheet, Pressable } from 'react-native';
import Label from '../../Atoms/ListItem';
import React, { useState } from 'react';
import axios from 'axios';
import ReadMessageModal from './ReadMessageModal';

export default function sentMessage({messageId}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [msgDetail, setMsgDetail] = useState(null);

  const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwMDAwQG5hdmVyLmNvbSIsIm1lbWJlcklkIjo2LCJpYXQiOjE3MjMwMzYwMzQsImV4cCI6MTc1NDU3MjAzNH0.OTJ1PJyv3x1bFCXqM0N560D1bic1c9JyaJyz8RcqJXU9aICkDLIFtJ3V8_CA1s0PGxqoejj6sNoKpgdLsqPcZQ'

  // messageId, fromMemberNickname, toMemberNickname, content, category, sentTime, check
  const messageDetail = async () => {
      const url = "https://i11b304.p.ssafy.io/api/messages/detail";

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
          },
          params: {
            messageId: 1,
          }
        })

        if (response.status === 200) {
          setMsgDetail(response.data)
          console.log("메시지 확인 성공");
        } else {
          console.log("메시지 확인 실패");
        }
      } catch (error) {
        console.error("메세지 확인 중 오류 발생:", error);
      }
    };

     const handlePress = () => {
       messageDetail();
       setModalVisible(true);
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
