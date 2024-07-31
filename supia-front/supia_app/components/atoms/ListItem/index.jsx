import React, { useState } from 'react';
import { Text, View, Pressable, StyleSheet, Modal } from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import FriendModal from '../../FriendModal';
import NoteModal from '../../NoteModal';
import Popup from '../../Popup';

export default function Label({ pic, title, content, name, UserLevel, onOpenPopup, onClose }) {
  const [UsermodalVisible, setUsermodalVisible] = useState(false);
  const [NoteModalVisible, setNoteModalVisible] = useState(false);
  const [DeletePopupVisible, setDeletePopupVisible] = useState(false);

  const handlePicPress = () => {
    if (pic === 'user') {
      setUsermodalVisible(true); // 유저 모달 열기
    }
  };

  const handleCloseModal = () => {
    setUsermodalVisible(false); // 유저 모달 닫기
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
      <AntDesign name={pic} size={24} onPress={handlePicPress} />
      <View style={styles.profile}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.content}>{content}</Text>
      </View>
      <Pressable onPress={onPress}>
        <Feather name={name} size={24} />
      </Pressable>

      {/* 모달 컴포넌트 */}
      <Modal
        transparent={true}
        visible={UsermodalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalBackground}>
            <FriendModal
              UserName={title}
              UserLevel={UserLevel}
              onClose={handleCloseModal} // onClose prop 전달
            />
        </View>
      </Modal>

      {/* NoteModal */}
      <Modal
        transparent={true}
        visible={NoteModalVisible}
        onRequestClose={handleCloseNoteModal}
      >
        <View style={styles.modalBackground}>
          <NoteModal onClose={handleCloseNoteModal} friendName={title}/>
        </View>
      </Modal>
      
      {/* DeletePopup */}
      <Modal
        transparent={true}
        visible={DeletePopupVisible}
        onRequestClose={handleCloseDeletePopup}
      >
        <View style={styles.modalBackground}>
          <Popup onClose={handleCloseDeletePopup} Label='친구 삭제' friendName={title} content='님을 친구 목록에서 삭제하시겠습니까?'/>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "95%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5,
  },
  profile: {
    display: "flex",
    width: "80%",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 6,
    flexShrink: 0,
    paddingLeft: 15,
  },
  title: {
    color: "#1E1E2D",
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    color: "#A2A2A7",
    fontSize: 12,
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

});