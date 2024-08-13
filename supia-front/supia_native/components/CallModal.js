import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';
import Label from './Atoms/ListItem'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CallModal = ({ modalVisible, setModalVisible }) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modal}>
            <Label
              url={friend.profileImg}
              title={friend.nickname}
              content={friend.name}
            />
          <Pressable>
              <MaterialIcons name="call" size={30} color="#A2AA7B" style={styles.whiteIcon} />
          </Pressable>
          <Pressable>
              <MaterialIcons name="call-end" size={30} color="#A2AA7B" style={styles.whiteIcon} />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    height: 130,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  whiteIcon: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#fff',
  },
});

export default CallModal;
