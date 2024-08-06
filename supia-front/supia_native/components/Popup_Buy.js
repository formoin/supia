import React, { useState } from 'react';
import Button from './Atoms/Button_Green';
import useStore from './store/useStore';
import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import axios from 'axios';

const Popup_Buy = ({ goBuy, memberId, itemId, price, remainingPoints, type }) => {
  const { activeText, setActiveText } = useStore();
  const [PopupVisible, setPopupVisible] = useState(false);

  const sendThemeData = async () => {
    const BGI = {
      memberId: memberId,
      itemId: itemId,
      price: price,
      remainingPoints: remainingPoints,
      type: "bgi"
    };

    try {
      const response = await axios.post('http://i11b304.p.ssafy.io/api/purchase/bgi', BGI);

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
    const BGM = {
      memberId: memberId,
      itemId: itemId,
      price: price,
      remainingPoints: remainingPoints,
      type: "bgm"
    };

    try {
      const response = await axios.post('http://i11b304.p.ssafy.io/api/purchase/bgm', BGM);

      if (response.status === 200) {
        console.log("음악 구매 정보 저장 성공");
      } else {
        console.log("음악 구매 정보 저장 실패");
      }
    } catch (error) {
      console.error("요청 중 오류 발생:", error);
    }
  };

  const handleBuyPress = async () => {
    goBuy();
    if (activeText === 'text1') {
      await sendThemeData();
    } else if (activeText === 'text2') {
      await sendMusicData();
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
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  }
});

export default Popup_Buy;
