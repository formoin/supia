import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import PopupHeader from './Atoms/PopupHeader'
import Button_Green from './Atoms/Button_Green'
import Searchbar from './Organisms/SearchBar';
import Frame from './Atoms/Frame';

export default function SendGiftModal({onClose, selectedIndex, speciesName, representativeImg, date}) {
  return (
    <View style={styles.container}>
      <PopupHeader Label="선물하기" onClose={onClose}/>
      <View style={{marginVertical:10}}>
        <Searchbar active={true}/>
      </View>
      <Frame>
        <Text style={{ fontSize: 20 }}>{speciesName}</Text>
        <Image source={{ uri: representativeImg }} style={{ width: 130, height: 130, marginVertical: 4 }} />
        <Text style={{ fontSize: 16 }}>{date}</Text>
        <Text style={{ fontSize: 8 }}>{selectedIndex}</Text>
      </Frame>
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button_Green label="보내기"/>
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