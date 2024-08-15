import React, {useEffect} from 'react';
import {Modal, View, Pressable, StyleSheet} from 'react-native';
import Label from './Atoms/ListItem';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useStore from './store/useStore';


const CallModal = ({
  modalVisible,
  setModalVisible,
  friend,
  friendId,
  friendName,
  friendNickName,
  friendProfileImg,
}) => {
  console.log('프렌즈: ' + friend);
  console.log('프렌즈id' + friendId);

  const navigation = useNavigation();

  const {memberId} = useStore();
  const {memberName} = useStore();

  const handleAcceptCall = () => {
    navigation.navigate('Call', {
      isCaller: false,
      targetUserId: friend.memberId,
      userId: memberId,
      memberName: memberName,
    });
  };

  // 특정 시간 후 모달 자동 닫힘
  useEffect(() => {
    if (modalVisible) {
      const timer = setTimeout(() => {
        setModalVisible(false);
      }, 10000); // 10초 후에 모달 닫힘

      return () => clearTimeout(timer);
    }
  }, [modalVisible]);

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalContainer}>
        <View style={styles.modal}>
          <View style={styles.contentContainer}>
            {/* 프렌드가 있을 때만 팝업이 들어오게 설정 */}
            <Label
              url={friend.profileImg}
              title={friend.nickname}
              content={friend.name}
            />
            <View style={styles.buttonRow}>
              <Pressable onPress={handleAcceptCall} style={styles.button}>
                <MaterialIcons name="call" size={30} color="#A2AA7B" />
              </Pressable>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={styles.button}>
                <MaterialIcons name="call-end" size={30} color="#C28C7E" />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingLeft: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    paddingRight: 15,
  },
  button: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 5,
    alignItems: 'center',
  },
});

export default CallModal;
