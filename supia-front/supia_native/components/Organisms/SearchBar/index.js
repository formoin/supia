import {View, StyleSheet, Pressable, TextInput, Text} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Server_IP} from '@env';
import loginStore from '../../store/useLoginStore';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Searchbar({
  active,
  searchName,
  type,
  value,
  onChangeText,
  onSearch,
}) {
  // const { token } = loginStore.getState();

  const getUserSearch = async () => {
    const token = await AsyncStorage.getItem('key');

    console.log('가즈아 ' + value);
    try {
      const response = await axios.get(`${Server_IP}/search`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
        params: {
          type: 0, // 0: 유저 검색, 1: 아이템 검색
          keyword: value,
        },
      });

      console.log('axios' + response);
      if (response.status === 200) {
        console.log(response.data);
        onSearch(response.data);
        console.log('user 검색 성공');
      } else {
        console.log('user 검색 실패');
      }
    } catch (error) {
      console.error('user 요청 중 오류 발생:', error);
    }
  };

  const getItemSearch = async () => {
    const token = await AsyncStorage.getItem('key');

    try {
      const response = await axios.get(`${Server_IP}/search`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
        params: {
          type: 1,
          keyword: value,
        },
      });

      if (response.status === 200) {
        console.log(response.data);
        onSearch(response.data);
        console.log('item 검색 성공');
      } else {
        console.log('item 검색 실패');
      }
    } catch (error) {
      console.error('item 요청 중 오류 발생:', error);
    }
  };

  const onReset = () => {
    onChangeText(''); // 상위 컴포넌트의 상태를 초기화
  };

  const onSubmitEditing = () => {
    console.log('Submit pressed');
    if (type === 'text1') {
      console.log('유저 찾기');
      getUserSearch();
    } else {
      console.log('아이템 찾기');
      getItemSearch();
    }
  };

  return (
    <View style={styles.container}>
      {active ? (
        <>
          <AntDesign name="search1" size={20} color="#A2AA7B" />
          <TextInput
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitEditing}
            style={styles.input}
            placeholder="Search..."
          />
          <Pressable onPress={onReset}>
            <AntDesign name="close" size={20} color="#A2AA7B" />
          </Pressable>
        </>
      ) : (
        <Text style={styles.input}>{searchName}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '95%',
    height: 44,
    backgroundColor: '#F4F4F4',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    fontSize: 14,
    marginLeft: 10,
  },
});
