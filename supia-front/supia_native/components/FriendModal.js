import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ModalHeader from './Atoms/ModalHeader';
import ModalImage from './Atoms/ModalImage';
import ModalLevel from './Atoms/ModalLevel';
import Green from './Atoms/Button_Green';
import Red from './Atoms/Button_Red';
import axios from 'axios'

export default function FriendModal({ UserName, UserLevel, onClose, page, memberId, toId }) {
  const [isFriendRequested, setIsFriendRequested] = useState(false);

    const sendFriendRequest = async () => {
      const friendRequest = {
        fromId: memberId,
        toId: toId,
      };

      const message = {
      	from_user_id: memberId,
      	to_user_id: toId,
        title: "친구 신청",
      	context: `${memberName}님이 친구를 요청했습니다.`,
      	category: 2,
      	is_check: 0,
      }

      try {
        const response = await axios.post('http://i11b304.p.ssafy.io/api/friends', friendRequest, message, {
          headers: {
             Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          console.log("친구 요청 성공");
        } else {
          console.log("친구 요청 실패");
        }
      } catch (error) {
        console.error("친구 요청 중 오류 발생:", error);
      }
    };

  const handleButtonClick = () => {
    setIsFriendRequested(!isFriendRequested);
    sendFriendRequest();
  };

  return (
    <View style={styles.container}>
      <ModalHeader UserName={UserName} onClose={onClose} />
      <View style={styles.line} />
      <ModalImage />
      <View style={styles.modalLevelContainer}>
        <ModalLevel UserLevel={UserLevel} />
        {page === 'search' && (
          <View style={styles.button}>
            {isFriendRequested ? (
              <Green label="요청 대기" />
            ) : (
              <Green label="친구 요청" onPress={handleButtonClick} />
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 260,
    height: 280,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.10)',
    backgroundColor: '#ECEADE',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
    alignItems: 'center',
    padding: 10,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: '#A2AA7B',
    width: '100%',
    margin: 10,
  },
  modalLevelContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  button: {
    marginLeft: 30,
    marginTop: 10,
  },
});
