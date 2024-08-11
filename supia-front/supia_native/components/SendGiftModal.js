import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import PopupHeader from './Atoms/PopupHeader'
import Button_Green from './Atoms/Button_Green'
import Searchbar from './Organisms/SearchBar';
import Frame from './Atoms/Frame';
import useStore from './store/useStore';
import axios from 'axios';
import loginStore from './store/useLoginStore';

export default function SendGiftModal({onClose, selectedIndex, speciesName, representativeImg, date, itemId, onGiftSuccess}) {
  const {getS3Url} = useStore();
  const { token } = loginStore.getState()

  const goGift = async () => {
    const Message = {
      fromMemberId: 8, //수정
      toMemberId: 10, //수정
      itemId
    };
    try {
      const response = await axios.post(
        'https://i11b304.p.ssafy.io/api/messages/gift',
        Message,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
          },
        },
      );
  
      if (response.status === 200) {
        console.log('선물 보내기 성공');
        onGiftSuccess()
      } else {
        console.log('선물 보내기 실패', response);
      }
    } catch (error) {
      console.error('선물 요청 중 오류 발생:', error);
    }
  };

  const handleButtonClick = () => {
    goGift()
  }
  
  return (
    <View style={styles.container}>
      <PopupHeader Label="선물하기" onClose={onClose}/>
      <View style={{marginVertical:10}}>
        <Searchbar active={true}/>
      </View>
      <Frame>
        <Text style={{ fontSize: 20 }}>{speciesName}</Text>
        <Image source={{ uri: getS3Url(representativeImg) }} style={{ width: 130, height: 130, marginVertical: 4, transform: [{ rotate: '90deg' }] }} />
        <Text style={{ fontSize: 16 }}>{date}</Text>
        <Text style={{ fontSize: 8 }}>{selectedIndex}</Text>
      </Frame>
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button_Green label="보내기" onPress={handleButtonClick}/>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 260,
    height: 404,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0,  0, 0.10)',
    opacity: 1, 
    backgroundColor: 'rgba(225, 219, 203, 1)',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4, // 안드로이드에서는 elevation으로 그림자 설정
    alignItems: 'center',
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row', // 가로로 배치
    justifyContent: 'center', // 중앙 정렬
    alignItems: 'center',
  },
  button: {
    margin: 10
  },
  contentText: {
    color: '#000',
    fontSize: 22,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 26,
    marginVertical: 30
  },
});