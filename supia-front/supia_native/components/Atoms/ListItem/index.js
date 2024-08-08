import React, {useState} from 'react';
import {Text, View, Pressable, StyleSheet, Modal} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import FriendModal from '../../FriendModal';
import NoteModal from '../../NoteModal';
import Popup from '../../Popup';
import axios from 'axios';

export default function Label({ pic, title, content, name, UserLevel, onOpenPopup,
                                onClose, page, handleFriendChange}) {
  const [FriendModalVisible, setFriendModalVisible] = useState(false);
  const [SearchModalVisible, setSearchModalVisible] = useState(false);
  const [NoteModalVisible, setNoteModalVisible] = useState(false);
  const [DeletePopupVisible, setDeletePopupVisible] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const [friendDetail, setFriendDetail] = useState(null);

  const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwMDAwQG5hdmVyLmNvbSIsIm1lbWJlcklkIjo2LCJpYXQiOjE3MjMwMzYwMzQsImV4cCI6MTc1NDU3MjAzNH0.OTJ1PJyv3x1bFCXqM0N560D1bic1c9JyaJyz8RcqJXU9aICkDLIFtJ3V8_CA1s0PGxqoejj6sNoKpgdLsqPcZQ'
  const memberId = 1;

  const getUserDetail = async () => {
      try {
          const response = await axios.get("https://i11b304.p.ssafy.io/api/search/member",
            {
             headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
              },
            }
          );

           if (response.status === 200) {
                console.log(response.data)
                setUserDetail(response.data);
                console.log("유저 정보 로딩 성공");
           } else {
                console.log("유저 정보 로딩 실패");
           }
       } catch (error) {
           console.error("유저 정보 요청 중 오류 발생:", error);
       }
    };

  const getFriendDetail = async () => {
      try {
          const response = await axios.get("https://i11b304.p.ssafy.io/api/friend/detail",
            {
             headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
              },
            }
          );

           if (response.status === 200) {
                console.log(response.data)
                setFriendDetail(response.data);
                console.log("친구 정보 로딩 성공");
           } else {
                console.log("친구 정보 로딩 실패");
           }
       } catch (error) {
           console.error("친구 정보 요청 중 오류 발생:", error);
       }
    };

  const handleOpenUserModal = () => {
    if (pic === 'user' && page === 'search') {
      getUserDetail();
      setSearchModalVisible(true); // 검색 모달 열기
    }
    else if (pic === 'user') {
      getFriendDetail();
      setFriendModalVisible(true); // 친구 모달 열기
    }
  };

  const handleCloseUserModal = () => {
    setFriendModalVisible(false); // 검색 모달 닫기
    setSearchModalVisible(false); // 친구 모달 닫기
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
      <AntDesign name={pic} size={24} onPress={handleOpenUserModal} />
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
            UserName={title}
            UserLevel={UserLevel}
            onClose={handleCloseUserModal} // onClose prop 전달
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
            UserName={title}
            UserLevel={UserLevel}
            onClose={handleCloseUserModal} // onClose prop 전달
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
          <NoteModal onClose={handleCloseNoteModal} friendName={title} />
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
            friendName={title}
            content="님을 친구 목록에서 삭제하시겠습니까?"
            when = 'friend'
            onDeleteSuccess={() => {
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
    paddingLeft: 15,
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
});
