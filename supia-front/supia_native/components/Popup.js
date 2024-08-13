import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import PopupHeader from './Atoms/PopupHeader';
import Button_Green from './Atoms/Button_Green';
import Button_Red from './Atoms/Button_Red';
import Frame from './Atoms/Frame';
import {Server_IP, WS_IP, TURN_URL, TURN_ID, TURN_CREDENTIAL} from '@env';
import axios from 'axios';
import useStore from './store/useStore';
import loginStore from './store/useLoginStore';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Popup({
  onClose,
  Label,
  content,
  friendName,
  friend,
  imguri,
  getS3Url,
  date,
  itemid,
  onDeleteSuccess,
  when,
  onDelete,
}) {
  // const {token} = loginStore.getState();

  const navigation = useNavigation();
  const handleDelete = async () => {
    // 아이템 삭제
    const token = await AsyncStorage.getItem('key');

    try {
      const response = await axios.delete(`${Server_IP}/items`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
        params: {itemId: itemid}, // DELETE 요청의 URL 쿼리 스트링으로 itemId 전달
      });
      console.log('삭제 성공');
      onDeleteSuccess();
    } catch (error) {
      console.error('삭제 실패', error);
    }
  };

  // 친구 삭제
  const handleFriendDelete = async () => {
    const token = await AsyncStorage.getItem('key');

    try {
      const response = await axios.delete(`${Server_IP}/friends`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
        params: {friendId: friend.friendId}, // DELETE 요청의 URL 쿼리 스트링으로 friendId 전달
      });
      console.log('삭제 성공');
      onDelete();
    } catch (error) {
      console.error('삭제 실패', error);
    }
  };

  const setWhen = () => {
    if (when === 'friend') {
      handleFriendDelete();
      onDelete();
    } else if (when === 'save') {
      // 지금 forest에서 onDeleteSuccess를 child로 가져옴
      // 그리고 '네'은 setWhen 함수가 호출되고
      // 그래서 우선 onDeleteSuccess를 실행하고
      // 다음에 아이템의 위치를 저장하는 handleSave 함수 수행
      onDeleteSuccess(); // 여기서는 아이콘 지우고 사진 찍음
      //console.log('메인으로 이동하즈아');
      // handleSave(); // save에 대한 처리 함수 호출
    } else {
      handleDelete(); // 나머지 경우에 대한 처리
    }
  };

  return (
    <View style={imguri ? styles.containerWithImage : styles.container}>
      {Label ? (
        <PopupHeader Label={Label} onClose={onClose} />
      ) : (
        <View style={{paddingVertical: 8}}></View>
      )}
      {imguri ? (
        <Frame>
          <Text style={{fontSize: 20}}>{friendName}</Text>
          <Image
            //source={{uri: imguri}} // getS3Url 사용이 아닌 imguri 그대로 사용
            source={{uri: getS3Url(imguri)}}
            style={{width: 130, height: 130, marginVertical: 4}}
          />
          <Text style={{fontSize: 16}}>{date}</Text>
        </Frame>
      ) : null}

      <Text style={styles.contentText}>
        {friendName}
        {content}
      </Text>

      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button_Green label="네" onPress={setWhen} />
        </View>
        <View style={styles.button}>
          <Button_Red label="아니오" onPress={onClose} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 340.808,
    height: 235,
    borderRadius: 32,
    borderWidth: 1, // var(--sds-size-stroke-border)의 값을 1로 가정
    borderColor: 'rgba(0, 0, 0, 0.10)',
    opacity: 1, // var(--sds-size-stroke-border)의 값을 1로 가정
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {width: 0, height: 4},
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
    margin: 10,
  },
  contentText: {
    color: '#000',
    fontSize: 22,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 26,
    marginTop: 30,
    marginBottom: 20,
  },
  containerWithImage: {
    width: 260,
    height: 450,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.10)',
    opacity: 1,
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
    alignItems: 'center',
    padding: 20,
  },
});
