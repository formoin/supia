import { View, Text, StyleSheet, Pressable, Modal, TextInput } from 'react-native';
import PopupHeader from '../Atoms/PopupHeader';
import React from 'react';
import Searchbar from '../Organisms/SearchBar'
import Green from '../Atoms/Button_Green'

export default function ReadMessageModal({ visible, onClose, friendName }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <PopupHeader Label="메세지 확인" onClose={onClose} />
          <Text style={styles.timeText}>보낸 시간: 2024/08/05 17:15</Text>
          <Searchbar active={false} searchName={friendName} />
          <View style={styles.rectangle} />
          <Green label="답장하기" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: 290,
    height: 389,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    padding: 20,
  },
  timeText: {
    fontSize: 12,
    marginTop: 15,
    marginLeft: 8,
    marginBottom: 10,
    alignSelf: 'flex-start'
  },
  rectangle: {
    width: 235,
    height: 166,
    marginTop: 20,
    marginBottom: 10,
    flexShrink: 0,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A2AA7B',
    opacity: 1,
  },
});
