import React from 'react';
import Button from './atoms/Button_Green';
import useStore from './store/useStore';
import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import axios from 'axios';

const Popup_Buy = ({ goBuy }) => {
  const { activeText, setActiveText } = useStore();

  const sendThemeData = async () => {
    const Theme = {
      userId: userId,
      themeId: themeId,
    };

    try {
      const response = await axios.post('http://i11b304.p.ssafy.io/api/own-theme', Theme);

      if (response.status === 200) {
        console.log("테마 구매 정보 저장 성공");
      } else {
        console.log("테마 구매 정보 저장 실패");
      }
    } catch (error) {
      console.error("요청 중 오류 발생:", error);
    }
  };

  const sendMusicData = async () => {
    const Music = {
      userId: userId,
      musicId: musicId
    };

    try {
      const response = await axios.post('http://i11b304.p.ssafy.io/api/own-music', Music);

      if (response.status === 200) {
        console.log("음악 구매 정보 저장 성공");
      } else {
        console.log("음악 구매 정보 저장 실패");
      }
    } catch (error) {
      console.error("요청 중 오류 발생:", error);
    }
  };

  const handleBuyPress = () => {
    if (activeText === 'text1') {
      sendThemeData();
    } else if (activeText === 'text2') {
      sendMusicData();
    }
  };

  return (
    <View style={styles.modalView}>
      <View style={styles.header}>
        <Text style={styles.modalText}>초록 숲</Text>
        <Pressable onPress={goBuy}>
          <Octicons name="x" size={30} style={styles.closeIcon} />
        </Pressable>
      </View>
      <Image
        source={{ uri: '<path-to-image>' }}
        style={styles.image}
      />
      <Text style={styles.text}>필요 Point          200 P</Text>
      <Text style={styles.text}> 내 Point           20 P</Text>
      <Button label="구매하기" onPress={handleBuyPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  modalView: {
    width: 260,
    height: 350,
    borderRadius: 3,
    borderColor: 'rgba(0, 0, 0, 0.10)',
    backgroundColor: 'rgba(225, 219, 203, 0.90)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
    flex: 1,
    marginLeft: 30,
  },
  closeIcon: {
    paddingHorizontal: 10,
    marginRight: 5
  },
  image: {
    width: 200,
    height: 130,
    borderRadius: 20,
    backgroundColor: 'lightgray',
    marginTop: 10,
    marginBottom: 20,
  },
  text: {
    marginBottom: 20,
    fontSize: 16,
  }
});

export default Popup_Buy;
