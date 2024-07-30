import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Modal, Text } from 'react-native';
import { Ionicons, Entypo, Feather } from '@expo/vector-icons';
import useStore from '../store/useStore';
import Button_Green from '../atoms/Button_Green';
import Button_Red from '../atoms/Button_Red';
import { useNavigation } from '@react-navigation/native';

export default function WalkPage_bottom() {
  const { resetStopwatch, pauseStopwatch } = useStore();
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const onPressCamera = () => {
    alert('camera');
  };

  const onPressPause = () => {
    resetStopwatch(); // 스톱워치 리셋
    pauseStopwatch(); // 스톱워치 일시 정지

    // 팝업 모달을 띄우기
    setModalVisible(true);
  };

  const onPressUser = () => {
    alert('User');
  };

  const handleConfirm = () => {
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
    navigation.navigate('Home');
  };

  return (
    <View style={styles.buttonContainer}>
      <View style={styles.button}>
        <Pressable onPress={onPressCamera}>
          <Ionicons
            name="camera-outline"
            size={30}
            color="#A2AA7B"
            style={styles.whiteIcon}
          />
        </Pressable>
        <View style={styles.iconWithCircle}>
          <View style={styles.bg} />
          <Pressable onPress={onPressPause} style={styles.walkButtonPressable}>
            <Entypo
              name="controller-paus"
              size={30}
              color="#1D1B20"
              style={styles.greenIcon}
            />
          </Pressable>
        </View>
        <Pressable onPress={onPressUser}>
          <Feather
            name="user"
            size={30}
            color="#A2AA7B"
            style={styles.whiteIcon}
          />
        </Pressable>
      </View>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>산책 종료</Text>
            <Text style={styles.modalMessage}>산책 기록을 확인하시겠습니까?</Text>
            <View style={styles.buttonContainerModal}>
              <Button_Green label="네" onPress={handleConfirm} />
              <Button_Red label="아니오" onPress={handleCancel} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 15,
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    opacity: 1,
  },
  whiteIcon: {
    paddingRight: 8,
    borderRadius: 50,
    backgroundColor: '#fff',
    paddingLeft: 9,
    paddingVertical: 9,
  },
  greenIcon: {
    paddingRight: 8,
    borderRadius: 50,
    backgroundColor: '#A2AA7B',
    paddingLeft: 7,
    paddingVertical: 6,
    position: 'relative',
  },
  bg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(162, 170, 123, 0.8)',
    position: 'absolute',
    zIndex: -1,
    opacity: 0.8,
  },
  iconWithCircle: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 50,
  },
  walkButtonPressable: {
    width: 60,
    height: 60,
    borderRadius: 35,
    backgroundColor: '#A2AA7B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainerModal: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
});
