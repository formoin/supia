import React from 'react';
import {StyleSheet, View} from 'react-native';
import PopupHeader from './Atoms/PopupHeader';
import Searchbar from './Organisms/SearchBar';
import TextFrame from './Atoms/TextFrame';

export default function ReplyModal({onClose, friendName}) {
  return (
    <View style={styles.container}>
      <PopupHeader Label="답장하기" onClose={onClose} />

      <View style={styles.searchbar}>
        <Searchbar active={false} searchName={friendName} />
      </View>

      <View style={styles.frame}>
        <TextFrame />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 339,
    height: 455,
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
    padding: 10,
  },
  searchbar: {
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 20,
  },
  frame: {
    padding: 20,
  },
});
