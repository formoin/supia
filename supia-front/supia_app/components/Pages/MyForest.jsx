import React, { useState, useEffect } from 'react'
import { View, Image, StyleSheet, Pressable, Modal, Text, Button } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from "@react-navigation/native";
import BackgroundSetting from '../organisms/BackgroundSetting'
import axios from 'axios';

export default function MyForestScreen({userId}) {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [backgroundData, setBackgroundData] = useState(null);

  const getOwnBackground = async () => {
    try {
        const response = await axios.get(`http://i11b304.p.ssafy.io/api/own/${userId}`);

         if (response.status === 200) {
              console.log(response.data)
              console.log("테마 리스트 로딩 성공");
         } else {
              console.log("테마 리스트 로딩 실패");
         }
     } catch (error) {
         console.error("요청 중 오류 발생:", error);
     }
  };
  //컴포넌트가 마운트 될 때, userId가 변경될 때마다 get 요청
    useEffect(() => {
      getOwnBackground();
    }, [userId]);

  const goSetting = () => {
      setIsModalVisible(!isModalVisible);
  };

  const goHome = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/basic/forest_2.png')}
        style={styles.image}
      />
      <Pressable style={styles.iconContainer} onPress={goSetting}>
        <Ionicons name="settings-outline" style={styles.settingicon} />
      </Pressable>
      <Pressable style={styles.iconContainer} onPress={goHome}>
        <Feather name="home" style={styles.homeicon} />
      </Pressable>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={goSetting}
        >
          <View style={styles.modalBackground}>
              <BackgroundSetting goSetting={goSetting} />
          </View>
        </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    position: 'absolute',
  },
  homeicon: {
    position: 'absolute',
    top: 20,
    left: 365,
    fontSize: 30,
    color: 'white',
    transform: [{ rotate: '90deg' }],
  },
  settingicon: {
    position: 'absolute',
    top: 20,
    left: 20,
    fontSize: 34,
    color: 'white',
    transform: [{ rotate: '90deg' }],
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    transform: [{ rotate: '90deg' }],
  },
  modalContainer: {
    width: 362,
    height: 375,
    borderRadius: 32,
    backgroundColor: '#FCFCFC',
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
  },
});
