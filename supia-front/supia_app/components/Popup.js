import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PopupHeader from './atoms/PopupHeader'
import Button_Green from './atoms/Button_Green'
import Button_Red from './atoms/Button_Red'

export default function Popup({onClose, Label, content, friendName}) {
  return (
    <View style={styles.container}>
      <PopupHeader Label={Label} onClose={onClose}/>

      <Text style={styles.contentText}>{friendName}{content}</Text>

      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button_Green label="네"/>
        </View>
        <View style={styles.button}>
          <Button_Red label="아니오"/>
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
 