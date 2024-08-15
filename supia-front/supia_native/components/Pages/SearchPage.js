import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Header from '../Atoms/Header';
import Searchbar from '../Organisms/SearchBar';
import Divide from '../Divide';
import ListItem from '../Atoms/ListItem';
import useStore from '../store/useStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Server_IP} from '@env';
import axios from 'axios';

export default function SearchScreen() {
  const {activeText, setActiveText, resetActiveText} = useStore();
  const [userData, setUserData] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [searchValue, setSearchValue] = useState(''); // Searchbar의 값 상태
  const [Myfriends, setMyfrineds] = useState([]);

  useEffect(() => {
    setActiveText('text1');
  }, [setActiveText]);

  // 화면이 포커스될 때마다 데이터와 검색어를 초기화
  useFocusEffect(
    React.useCallback(() => {
      setUserData([]);
      setItemData([]);
      getMyFriends();
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
  
  // 친구 불러와서 비교
  const getMyFriends = async () => { // 친구 프로필
    const token = await AsyncStorage.getItem('key');
    try {
      const response = await axios.get(`${Server_IP}/friends`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
      });

      if (response.status === 200) {
        console.log(response.data);
        setMyfrineds(response.data);
        console.log('내 친구 로딩 성공');
      } else {
        console.log('내 친구 로딩 실패');
      }
    } catch (error) {
      console.error('내 친구 요청 중 오류 발생:', error);
    }
  };

  const filteredUserData = userData.filter(user => 
    !Myfriends.some(friend => friend.memberId === user.memberId)
  );

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
      <ScrollView>
        <View style={styles.value}>
          {activeText === 'text1'
            ? filteredUserData.map(user => (
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
                  url={item.imgUrl}
                  title={item.speciesName}
                  content={item.address} // 시 + 동
                />
              ))}
        </View>      
      </ScrollView>
    </View>

  );
}

const styles = StyleSheet.create({
  p_value: {
    padding: 20,
    // alignItems: 'center',
  },
  value: {
    paddingBottom: 50,
    paddingLeft: 15
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  searchbar: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    alignItems: 'center',
  },
  pad: {
    paddingBottom: 250
  }
});