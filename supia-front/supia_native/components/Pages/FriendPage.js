import {StyleSheet, View, Text, Pressable, Modal} from 'react-native';
import Header from '../Atoms/Header';
import Searchbar from '../Organisms/SearchBar';
import ListItem from '../Atoms/ListItem';
import Octicons from 'react-native-vector-icons/Octicons';
import SelectOptions from '../Atoms/SelectOptions';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Server_IP, WS_IP, TURN_URL, TURN_ID, TURN_CREDENTIAL} from '@env';

const token =
'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMTFAbmF2ZXIuY29tIiwibWVtYmVySWQiOjcsImlhdCI6MTcyMzAxODY0NywiZXhwIjoxNzU0NTU0NjQ3fQ.pfSY7fLlBdcflPTvIG47Rs_c1ZWnuYXWdAc2bwkMYfDkyB4laNZ6I7qh4oBZ07-SraxYniZeuO8BeMWVH_dMCA'


export default function FriendScreen() {
  const [edit, setEdit] = useState(false);
  const [friends, setFriends] = useState([])

  const onPressPencil = () => {
    setEdit(!edit);
  };

  const getFriends = async () => {
    try {
      const response = await axios.get(`${Server_IP}/friends`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
        },
          params: {
            memberId: 1, //memberId 변경
          },
      });
      setFriends(response.data);
      console.log('성공')
    } catch (error) {             
      console.error('친구 목록을 가져오는 데 실패했습니다:', error);
    }
  };

  useEffect(() => {
    getFriends();
  }, []); // 컴포넌트가 마운트될 때 한 번만 실행

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
          <View>
            <SelectOptions />
          </View>
        </View>

        {friends.map((friend) => (
          <ListItem
            key={friend.friendId}
            pic={friend.profileImg || "user"} 
            title={friend.nickname}
            content={friend.name}
            name={edit ? 'x' : 'message-square'}
            // UserLevel="새싹"
            handleFriendChange={handleFriendChange}
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
