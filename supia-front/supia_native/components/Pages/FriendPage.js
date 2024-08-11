import { StyleSheet, View, Text, Pressable } from 'react-native';
import Header from '../Atoms/Header';
import Searchbar from '../Organisms/SearchBar';
import Label from '../Atoms/ListItem';
import Octicons from 'react-native-vector-icons/Octicons';
import SelectOptions from '../Atoms/SelectOptions';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import loginStore from '../store/useLoginStore';

export default function FriendScreen() {
  const [edit, setEdit] = useState(false);
  const [friends, setFriends] = useState([]);
  const { token } = loginStore.getState();

  const onPressPencil = () => {
    setEdit(!edit);
  };

  const getFriends = async () => {
    try {
      const response = await axios.get(
        "https://i11b304.p.ssafy.io/api/friends",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
          },
        },
      );
      setFriends(response.data);
      console.log(response.data);
      console.log('친구 리스트 불러오기 성공');
    } catch (error) {
      console.error('친구 목록을 가져오는 데 실패했습니다:', error);
    }
  };

  useEffect(() => {
    getFriends(); // 페이지가 렌더링될 때마다 실행
  }, []);

  const handleFriendChange = () => {
    getFriends(); // 친구 추가/삭제 후 목록 갱신
  };

  return (
    <View style={styles.screen}>
      <Header label="친구 목록" />

      <View style={styles.container}>
        <View style={styles.searchbar}>
          <Searchbar active={true} />
        </View>

        <View style={styles.friendContainer}>
          <View style={styles.leftContainer}>
            <Text style={styles.text}>친구 목록 ( {friends.length} )</Text>
            <Pressable onPress={onPressPencil}>
              <Octicons name="pencil" size={16} style={styles.icon} />
            </Pressable>
          </View>
        </View>
        {friends.map(friend => (
          <Label
            key={friend.friendId}
            url={friend.profileImg}
            title={friend.nickname}
            content={friend.name}
            name={edit ? 'x' : 'message-square'}
            handleFriendChange={handleFriendChange}
            friend={friend}
            page="friend"
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  container: {
    alignItems: 'center',
    paddingTop: 30,
  },
  friendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  icon: {
    paddingTop: 5,
    margin: 5,
  },
  searchbar: {
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 15,
  },
});
