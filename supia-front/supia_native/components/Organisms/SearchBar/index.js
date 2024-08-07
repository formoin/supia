import {View, StyleSheet, Pressable, TextInput, Text} from 'react-native';
import React, {useState} from 'react';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function Searchbar({active, searchName}) {
  const [value, setValue] = useState('');
  const [searchData, setSearchData] = useState(null);
  const [friendData, setFriendData] = useState(null);

  const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMEBzc2FmeS5jb20iLCJtZW1iZXJJZCI6MSwiaWF0IjoxNzIzMDAxNzU2LCJleHAiOjE3NTQ1Mzc3NTZ9.yQ_IgYEQzmf5O2_csfB095x3RcWrxdJynXGy6XqJT3Zc5-tQ-sSs4ycdMCxwKiWgj1_m8L83O3kKibIi7x0JJA';
  const memberId = 1;

  const getUserSearch = async () => {
    try {
        const response = await axios.get('https://i11b304.p.ssafy.io/api/search', {
         headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
          },
          params: {
            type: 0, // 0: 유저 검색, 1: 아이템 검색
            keyword: '싸피'
          }
        });

         if (response.status === 200) {
              console.log(response.data)
              setSearchData(response.data);
              console.log("user 검색 성공");
         } else {
              console.log("user 검색 실패");
         }
     } catch (error) {
         console.error("user 요청 중 오류 발생:", error);
     }
  };

  const getItemSearch = async () => {
    try {
        const response = await axios.get('https://i11b304.p.ssafy.io/api/search', {
         headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
          },
          params: {
            type: 2,
            search: 'item'
          }
        });

         if (response.status === 200) {
              console.log(response.data)
              setSearchData(response.data);
              console.log("item 검색 성공");
         } else {
              console.log("item 검색 실패");
         }
     } catch (error) {
         console.error("item 요청 중 오류 발생:", error);
     }
  };

  // X 버튼 클릭 시 초기화
  const onReset = () => {
    setValue('');
  };

  // TextInput 내 text 변경 시 value 변경
  const onChangeT = text => {
    setValue(text);
  };

  // 엔터 키를 눌렀을 때 동작 추가
  const onSubmitEditing = () => {
    // 엔터 키를 눌렀을 때 실행할 코드
    console.log('Submit pressed');
    getUserSearch();
  };

  return (
    <View style={styles.container}>
      {active ? (
        <>
          <AntDesign name="search1" size={20} color="#A2AA7B" />
          <TextInput
            value={value}
            onChangeText={onChangeT}
            onSubmitEditing={onSubmitEditing} // 엔터 키 처리
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
