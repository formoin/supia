import React from 'react';
import {Modal, View, Image, StyleSheet, Text, Alert} from 'react-native';
import PopupHeader from '../../Atoms/PopupHeader';
import Green from '../../Atoms/Button_Green';
import Red from '../../Atoms/Button_Red';
import axios from 'axios';
import loginStore from '../../store/useLoginStore';
import {Server_IP} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GiftModal = ({
  visible,
  onClose,
  imageUrl,
  content,
  messageId,
  onAccept,
  onRefuse,
}) => {
  // const { token } = loginStore.getState()

  // 선물 수락하기
  const acceptGift = async () => {
    const token = await AsyncStorage.getItem('key');

    try {
      const response = await axios.get(`${Server_IP}/messages/gift`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
        params: {
          messageId: messageId,
        },
      });
      if (response.status === 200) {
        Alert.alert('선물 수락', '선물을 수락했습니다.');
        onAccept();
        onClose();
      } else {
        console.log('선물 수락 실패');
      }
    } catch (error) {
      console.error('선물 수락 중 오류 발생:', error);
    }
  };

  // 선물 거절하기
  const refuseGift = async () => {
    const token = await AsyncStorage.getItem('key');
    try {
      const response = await axios.delete(`${Server_IP}/messages/gift`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
        params: {
          messageId: messageId,
        },
      });
      if (response.status === 200) {
        Alert.alert('선물 거절', '선물을 거절했습니다.');
        onRefuse();
        onClose();
      } else {
        console.log('선물 거절 실패');
      }
    } catch (error) {
      console.error('선물 거절 중 오류 발생:', error);
    }
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <PopupHeader Label="선물" onClose={onClose} />
          <Image source={{uri: imageUrl}} style={styles.giftImage} />
          <Text style={styles.text}>{content || '내용이 없습니다.'}</Text>
          <View style={styles.buttonContainer}>
            <Green label="수락" onPress={acceptGift} />
            <Red label="거절" onPress={refuseGift} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  giftImage: {
    width: 200,
    height: 200,
    transform: [{rotate: '90deg'}],
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  text: {
    marginBottom: 30,
  },
});

export default GiftModal;
