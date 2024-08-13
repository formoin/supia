import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Header from '../Atoms/Header';
import Searchbar from '../Organisms/SearchBar';
import Divide from '../Divide';
import ListItem from '../Atoms/ListItem';
import useStore from '../store/useStore';
import loginStore from '../store/useLoginStore';

import axios from 'axios';

export default function SearchScreen() {
  const {activeText, setActiveText, resetActiveText} = useStore();
  const [userData, setUserData] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [searchValue, setSearchValue] = useState(''); // Searchbar의 값 상태

  useEffect(() => {
    setActiveText('text1');
  }, [setActiveText]);

  // 화면이 포커스될 때마다 데이터와 검색어를 초기화
  useFocusEffect(
    React.useCallback(() => {
      setUserData([]);
      setItemData([]);
      setSearchValue(''); // 검색어 초기화
      resetActiveText();
    }, [resetActiveText]),
  );

  // activeText가 변경될 때마다 데이터와 검색어를 초기화
  useEffect(() => {
    setUserData([]);
    setItemData([]);
    setSearchValue(''); // 검색어 초기화
  }, [activeText]);

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
        <Searchbar
          active={true}
          type={activeText}
          value={searchValue}
          onChangeText={setSearchValue}
          onSearch={handleSearch}
        />
      </View>
      <View style={styles.p_value}>
        {activeText === 'text1'
          ? userData.map(user => (
              <ListItem
                key={user.id}
                toId={user.memberId}
                url={user.imgUrl}
                title={user.nickname}
                content={user.name}
                name={'message-square'}
                page="search"
                user={user}
              />
            ))
          : itemData.map(item => (
              <ListItem
                key={item.id}
                url={item.itemImg}
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
    // alignItems: 'center',
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
