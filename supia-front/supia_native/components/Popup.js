import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import PopupHeader from './Atoms/PopupHeader';
import Button_Green from './Atoms/Button_Green';
import Button_Red from './Atoms/Button_Red';
import Frame from './Atoms/Frame';

export default function Popup({onClose, Label, content, friendName, imguri, date, itemId, onDeleteSuccess, when }) {
  const handleDelete = async () => { // 아이템 삭제
    try {
      const response = await axios.delete(`http://i11b304.p.ssafy.io/api/items/${itemId}`,
        {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onDeleteSuccess();
    } catch (error) {
      console.error('삭제 실패', error);
    }
  }

  const handleFriendDelete = async (fromUserId, toUserId) => { // 친구 삭제
    const url = `http://i11b304.p.ssafy.io/api/friends`; // API URI를 적절히 수정
    const headers = {
      Authorization: `Bearer ${token}`, // Authorization 헤더에 토큰 추가
    };
    try {
      const response = await axios.delete(url, {
        headers: headers,
        params: {
          from_user_id:fromUserId,
          to_user_id: toUserId
        }
      });
      onDeleteSuccess();
    } catch (error) {
      console.error('삭제 실패', error);
    }
  }
  
  return (
    <View style={imguri ? styles.containerWithImage : styles.container}>
      <PopupHeader Label={Label} onClose={onClose} />
      {imguri ? ( 
        <Frame>
          <Text style={{ fontSize: 20 }}>{friendName}</Text>
          <Image source={{ uri: imguri }} style={{ width: 130, height: 130, marginVertical: 4 }} />
          <Text style={{ fontSize: 16 }}>{date}</Text>
        </Frame>) : null }

      <Text style={styles.contentText}>
        {friendName}
        {content}
      </Text>

      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button_Green label="네" onPress={when === 'friend' ? handleFriendDelete('내이름넣기', friendName) : handleDelete}/>
        </View>
        <View style={styles.button}>
          <Button_Red label="아니오" onPress={onClose}/>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 340.808,
    height: 235,
    borderRadius: 3,
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
    alignItems: 'center',
    padding: 20,
  },
});
