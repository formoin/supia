import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useIsFocused, useFocusEffect} from '@react-navigation/native'; // 네비게이션 훅 임포트
import Header from '../Atoms/Header';
import Searchbar from '../Organisms/SearchBar';
import Divide from '../Divide';
import ListItem from '../Atoms/ListItem';
import useStore from '../store/useStore';
import axios from 'axios';

export default function SearchScreen({ memberId }) {
  const {activeText, setActiveText, resetActiveText} = useStore();
  const [searchData, setsearchData] = useState(null);
  const [friendData, setFriendData] = useState(null);
  const isFocused = useIsFocused();

  useFocusEffect(
    React.useCallback(() => {
      resetActiveText();
    }, [resetActiveText]),
  );

  const getFriend = async () => {
    try {
        const response = await axios.get('http://i11b304.p.ssafy.io/api/friends');

         if (response.status === 200) {
              console.log(response.data)
              setFriendData(response.data);
              console.log("친구 리스트 로딩 성공");
         } else {
              console.log("친구 리스트 로딩 실패");
         }
     } catch (error) {
         console.error("요청 중 오류 발생:", error);
     }
  };

  const getUserSearch = async () => {
    try {
        const response = await axios.get('http://i11b304.p.ssafy.io/api/search');

         if (response.status === 200) {
              console.log(response.data)
              setsearchData(response.data);
              console.log("user 검색 성공");
         } else {
              console.log("user 검색 실패");
         }
     } catch (error) {
         console.error("요청 중 오류 발생:", error);
     }
  };

  const getItemSearch = async () => {
    try {
        const response = await axios.get('http://i11b304.p.ssafy.io/api/search');

         if (response.status === 200) {
              console.log(response.data)
              setsearchData(response.data);
              console.log("item 검색 성공");
         } else {
              console.log("item 검색 실패");
         }
     } catch (error) {
         console.error("요청 중 오류 발생:", error);
     }
  };

  const handleSearch = () => {
    if (activeText === 'text1') {
      getFriend();
      getUserSearch();
    } else if (activeText === 'text2') {
      getItemSearch();
    }
  };

  return (
    <View style={styles.container}>
      <Header label="검색하기" />
      <View style={styles.p_value}>
        <Divide text1="User" text2="Item" />
      </View>
      <View style={styles.searchbar}>
        <Searchbar onSearch={handleSearch} active={true} />
      </View>
      <View style={styles.p_value}>
        {activeText === 'text1' ? (
          <ListItem
            pic="user"
            title="yewone1"
            content="김예원"
            name="message-square"
            UserLevel="새싹"
            page="search"
          />
        ) : (
          <ListItem
            pic=""
            title="개망초"
            content="충청북도 청주시 서원구 분평동"
          />
        )}
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
