import {View, Text, StyleSheet, Pressable, Alert} from 'react-native';
import React, {useRef, useState} from 'react';
import ViewShot from 'react-native-view-shot';
import CaptureModal from '../Atoms/CaptureModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CallScreen({route}) {
  const captureRef = useRef();
  const [imageUri, setImageUri] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const captureScreen = async () => {
    try {
      const uri = await captureRef.current.capture();
      console.log(uri);
      setImageUri(uri);
      setModalVisible(true);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to capture screen');
    }
  };

  const saveImage = () => {
    // 여기에 이미지 저장 기능을 구현
    setModalVisible(false);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.friendname}>친구 이름</Text>
        <View style={styles.friendwindow} />
      </View>

      <ViewShot
        ref={captureRef}
        options={{format: 'jpg', quality: 0.9}}
        style={styles.captureContainer}>
        <View style={styles.CaptureView}>
          <Text>사진</Text>
        </View>
      </ViewShot>

      {/* <View style={styles.bottomContainer}>
        <Meeting_bottom captureScreen={captureScreen} />
      </View> */}

      {isModalVisible && (
        <CaptureModal
          isVisible={isModalVisible}
          onSave={saveImage}
          onClose={closeModal}
          imageUri={imageUri}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', // Space out top, middle, and bottom
  },
  top: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  friendname: {
    fontSize: 26,
    color: '#FFFDFD',
  },
  friendwindow: {
    width: 125,
    height: 149,
    backgroundColor: '#fff',
  },
  captureContainer: {
    flex: 1,
    justifyContent: 'center', // Centers CaptureView vertically
    alignItems: 'center', // Centers CaptureView horizontally
    paddingHorizontal: 20,
  },
  CaptureView: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'black',
    opacity: 0.9,
    width: '100%', // Full width within the captureContainer
    height: 352,
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 50, // Adjust padding as needed
  },
});
