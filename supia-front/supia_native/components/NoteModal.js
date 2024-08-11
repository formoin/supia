import React from 'react';
import {StyleSheet, View} from 'react-native';
import PopupHeader from './Atoms/PopupHeader';
import Searchbar from './Organisms/SearchBar';
import TextFrame from './Atoms/TextFrame';

export default function NoteModal({onClose, page, user, friend}) {
  return (
    <View style={styles.container}>
      <PopupHeader Label="쪽지 보내기" onClose={onClose} />
      {page === 'search' ? (
        <>
          <View style={styles.searchbar}>
            <Searchbar active={false} searchName={user.nickname} />
          </View>
          <View style={styles.frame}>
            <TextFrame onClose={onClose} user={user} page={page} />
          </View>
        </>
      ) : (
        <>
          <View style={styles.searchbar}>
            <Searchbar active={false} searchName={friend.nickname} />
          </View>
          <View style={styles.frame}>
            <TextFrame onClose={onClose} friend={friend} page={page} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 339,
    height: 455,
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
