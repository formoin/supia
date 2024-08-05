import React from 'react';
import { Modal, View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';

const CaptureModal = ({ isVisible, onClose, imageUri, onSave }) => {
  return (
    <Modal
      transparent={true}
      // animationType="slide"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <Text>캡쳐된 이미지 없음</Text>
          )}
          <Text style={styles.textStyle}>발견했다!</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onSave} style={styles.button}>
              <Text style={styles.buttonText}>저장하기</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.button}>
              <Text style={styles.buttonText}>다시찍기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  button: {
    width: 72,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 5,
    backgroundColor: '#A2AA7B',
    paddingBottom: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    marginTop: 15
  },
  textStyle:{
    fontSize:22,
  }
});

export default CaptureModal;
