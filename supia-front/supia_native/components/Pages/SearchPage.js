import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import Header from '../Atoms/Header';
import Searchbar from '../Organisms/SearchBar';
import Divide from '../Divide';
import Label from '../Atoms/ListItem';
import useStore from '../store/useStore';
import loginStore from '../store/useLoginStore'
import axios from 'axios';

export default function SearchScreen() {
  const {activeText, setActiveText} = useStore();
  const [userData, setUserData] = useState([]);
  const [itemData, setItemData] = useState([]);

  useEffect(() => {
    setActiveText('text1');
  }, []);

  const handleSearch = data => {
    if (activeText === 'text1') {
      setUserData(data);
    } else {
      setItemData(data);
    }
  };

  return (
    <View style={styles.container}>
      <Header label="검색하기" />
      <View style={styles.p_value}>
        <Divide text1="User" text2="Item" />
      </View>
      <View style={styles.searchbar}>
        <Searchbar active={true} type={activeText} onSearch={handleSearch} />
      </View>
      <View style={styles.p_value}>

        {activeText === 'text1'
          ? userData.map(user => (
              <ListItem
                key={user.id}
                url={user.profileImg}
                pic="user"
                title={user.nickname}
                content={user.name}
                name={'message-square'}
                page="search"
              />
            ))
          : itemData.map(item => (
              <ListItem
                key={item.id}
                url={item.itemImg}
                pic=""
                title={item.name}
                content={item.location} // 시 + 동
              />
            ))}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  p_value: {
    padding: 20,
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  searchbar: {
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
  },
});
