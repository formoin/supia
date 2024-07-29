import React from 'react';
import { StyleSheet, View } from 'react-native';
import ModalHeader from './atoms/ModalHeader'; // 실제 경로로 수정하세요
import ModalImage from './atoms/ModalImage'; // 실제 경로로 수정하세요
import ModalLevel from './atoms/ModalLevel'; // 실제 경로로 수정하세요

export default function FriendModal({ UserName, UserLevel, onClose }) {
  return (
    <View style={styles.container}>
      <ModalHeader UserName={UserName} onClose={onClose} />
      <View style={styles.line} />
      <ModalImage />
      <View style={styles.modalLevelContainer}>
        <ModalLevel UserLevel={UserLevel} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 260,
    height: 283,
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
    alignSelf: 'flex-start',
  },
});