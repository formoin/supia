import React, {useState} from 'react';
import {Text, View, Pressable, StyleSheet, Modal, Image} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import FriendModal from '../../FriendModal';
import NoteModal from '../../NoteModal';
import Popup from '../../Popup';
import axios from 'axios';
import loginStore from '../../store/useLoginStore';
import useStore from '../../store/useStore';
import {Server_IP} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Label({
  url,
  title,
  content,
  name,
  UserLevel,
  onOpenPopup,
  onClose,
  page,
  handleFriendChange,
  friend,
  user,
  type
}) {
  const [FriendModalVisible, setFriendModalVisible] = useState(false);
  const [SearchModalVisible, setSearchModalVisible] = useState(false);
  const [NoteModalVisible, setNoteModalVisible] = useState(false);
  const [DeletePopupVisible, setDeletePopupVisible] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const [friendDetail, setFriendDetail] = useState(null);
  const {getS3Url} = useStore();

  const getUserDetail = async () => { // 유저 상세정보
    const token = await AsyncStorage.getItem('key');
    try {
      const response = await axios.get(`${Server_IP}/search/member`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
        params: {
          findId: user.memberId,
        },
      });

      if (response.status === 200) {
        console.log(response.data);
        setUserDetail(response.data);
        console.log('유저 정보 로딩 성공');
      } else {
        console.log('유저 정보 로딩 실패');
      }
    } catch (error) {
      console.error('유저 정보 요청 중 오류 발생:', error);
    }
  };

  const getFriendDetail = async () => { // 친구 프로필
    const token = await AsyncStorage.getItem('key');
    try {
      const response = await axios.get(`${Server_IP}/friends/detail`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
        params: {
          friendId: friend.friendId,
        },
      });

      if (response.status === 200) {
        console.log(response.data);
        setFriendDetail(response.data);
        console.log('친구 정보 로딩 성공');
      } else {
        console.log('친구 정보 로딩 실패');
      }
    } catch (error) {
      console.error('친구 정보 요청 중 오류 발생:', error);
    }
  };

  const handleOpenUserModal = () => {
    if (page === 'search') {
      getUserDetail();
      setSearchModalVisible(true); // 검색 모달 열기
    } else if (page === 'friend') {
      getFriendDetail();
      setFriendModalVisible(true); // 친구 모달 열기
    }
  };

  const handleCloseUserModal = () => {
    setFriendModalVisible(false); // 친구 모달 닫기
    setSearchModalVisible(false); // 검색 모달 닫기
  };

  const handleOpenNoteModal = () => {
    setNoteModalVisible(true); // NoteModal 열기
  };

  const handleCloseNoteModal = () => {
    setNoteModalVisible(false); // NoteModal 닫기
  };

  const handleOpenDeletePopup = () => {
    setDeletePopupVisible(true); // 삭제 팝업 열기
  };

  const handleCloseDeletePopup = () => {
    setDeletePopupVisible(false); // 삭제 팝업 닫기
  };

  const onPress = () => {
    if (name === 'message-square') {
      handleOpenNoteModal();
    } else if (name === 'phone-call') {
      onOpenPopup(title);
      onClose();
    } else if (name === 'x') {
      handleOpenDeletePopup();
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handleOpenUserModal}>
      {url ? (
        <Image
          source={{ uri: getS3Url(url) }}
          style={[
            styles.image,
            type === 'gift' && styles.rotatedImage, // type이 gift이면 90도 회전
          ]}
        />
      ) : (
        <Image
          source={{ uri: url }}
          style={[
            styles.image,
            type === 'gift' && styles.rotatedImage, // type이 gift이면 90도 회전
          ]}
        />
      )}
      </Pressable>
      <View style={styles.profile}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.content}>{content}</Text>
      </View>
      <Pressable onPress={onPress}>
        <Feather name={name} size={24} />
      </Pressable>

      {/* FriendModal */}
      <Modal
        transparent={true}
        visible={FriendModalVisible}
        onRequestClose={handleCloseUserModal}>
        <View style={styles.modalBackground}>
          <FriendModal
            friendDetail={friendDetail}
            onClose={handleCloseUserModal}
            page="friend"
            friend={friend}
          />
        </View>
      </Modal>

      {/* SearchModal */}
      <Modal
        transparent={true}
        visible={SearchModalVisible}
        onRequestClose={handleCloseUserModal}>
        <View style={styles.modalBackground}>
          <FriendModal
            userDetail={userDetail}
            user={user}
            onClose={handleCloseUserModal}
            page="search"
          />
        </View>
      </Modal>

      {/* NoteModal */}
      <Modal
        transparent={true}
        visible={NoteModalVisible}
        onRequestClose={handleCloseNoteModal}>
        <View style={styles.modalBackground}>
          <NoteModal
            onClose={handleCloseNoteModal}
            friend={friend}
            user={user}
            page={page}
          />
        </View>
      </Modal>

      {/* DeletePopup */}
      <Modal
        transparent={true}
        visible={DeletePopupVisible}
        onRequestClose={handleCloseDeletePopup}>
        <View style={styles.modalBackground}>
          <Popup
            onClose={handleCloseDeletePopup}
            Label="친구 삭제"
            friend={friend}
            content="님을 친구 목록에서 삭제하시겠습니까?"
            when="friend"
            onDelete={() => {
              handleCloseDeletePopup();
              handleFriendChange();
            }}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 5,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5,
  },
  profile: {
    display: 'flex',
    width: '80%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 6,
    flexShrink: 0,
    paddingLeft: 15,
  },
  title: {
    color: '#1E1E2D',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    color: '#A2A2A7',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  rotatedImage: {
    transform: [{ rotate: '90deg' }],
  },  
});
