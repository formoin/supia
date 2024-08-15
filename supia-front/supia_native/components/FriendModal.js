import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import ModalHeader from './Atoms/ModalHeader';
import ModalImage from './Atoms/ModalImage';
import ModalLevel from './Atoms/ModalLevel';
import Green from './Atoms/Button_Green';
import Red from './Atoms/Button_Red';
import axios from 'axios';
import {Server_IP} from '@env';
import loginStore from './store/useLoginStore';
import useStore from './store/useStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FriendModal({
  onClose,
  page,
  toId,
  friendDetail,
  userDetail,
  user,
  friend
}) {
  const [isFriendRequested, setIsFriendRequested] = useState(false);
  const {memberId} = useStore();

  const sendFriendRequest = async () => {
    const token = await AsyncStorage.getItem('key');
    const friendRequest = {
      fromId: memberId,
      toId: user.memberId,
    };
    try {
      const response = await axios.post(`${Server_IP}/friends`, friendRequest, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
      });

      if (response.status === 200) {
        console.log('친구 요청 성공');
      } else {
        console.log('친구 요청 실패');
      }
    } catch (error) {
      console.error('친구 요청 중 오류 발생:', error);
    }
  };

  const handleButtonClick = () => {
    sendFriendRequest();
    setIsFriendRequested(!isFriendRequested);
  };

  // 검색 페이지와 친구 페이지에 따라 다르게 렌더링
  if (page === 'search' && userDetail) {
    return (
      <View style={styles.container}>
        <ModalHeader
          UserName={userDetail.nickname}
          onClose={onClose}
          url={userDetail.profileImg}
        />
        <View style={styles.line} />
        <ModalImage uri={userDetail.thumbnail} />
        <View style={styles.modalLevelContainer}>
          <ModalLevel UserLevel={userDetail.level} />
          <View style={styles.button}>
            {isFriendRequested ? (
              <Green label="요청 대기" />
            ) : (
              <Green label="친구 요청" onPress={handleButtonClick} />
            )}
          </View>
        </View>
      </View>
    );
  }

  if (page === 'friend' && friendDetail) {
    return (
      <View style={styles.container}>
        <ModalHeader
          UserName={friendDetail.nickname}
          onClose={onClose}
          url={friendDetail.profileImg}
        />
        <View style={styles.line} />
        <ModalImage uri={friendDetail.thumbnail} />
        <View style={styles.modalLevelContainer}>
          <ModalLevel UserLevel={friendDetail.level} />
        </View>
      </View>
    );
  }

  // 기본적으로 아무 것도 렌더링하지 않음
  return null;
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
    shadowOffset: {width: 0, height: 4},
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
    marginTop: 18,
  },
});
