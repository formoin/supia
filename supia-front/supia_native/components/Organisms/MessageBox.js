import { View, Text, StyleSheet, Pressable } from 'react-native';
import Label from '../Atoms/ListItem';
import React, { useState } from 'react';
import ReadMessageModal from './ReadMessageModal';

export default function MessageBox() {
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    console.log('버튼이 눌렸습니다!');
    setModalVisible(true);
  };

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.messageHeader}>
          <Text style={styles.messageText}>쪽지</Text>
          <Text style={styles.timeText}>Today 10:30PM</Text>
        </View>
        <View style={styles.messageContent}>
          <Label pic="smileo" title="formoin" content="뭐하니?" />
          <Pressable style={styles.button} onPress={handlePress}>
            <Text style={styles.buttonText}>읽기</Text>
          </Pressable>
        </View>
      </View>

      <ReadMessageModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        friendName="formoin"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: '100%',
    height: 100,
    backgroundColor: '#ECEADE',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  messageContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageText: {
    fontSize: 16,
  },
  timeText: {
    fontSize: 16,
    color: 'gray',
  },
  button: {
    width: 45,
    height: 35,
    backgroundColor: '#A2AA7B',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
});
