import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import Header from '../Atoms/Header';
import Searchbar from '../Organisms/SearchBar';
import Label from '../Atoms/ListItem';
import Octicons from 'react-native-vector-icons/Octicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Server_IP } from '@env';
import Line from '../Atoms/Line';

export default function FriendScreen() {
  const [edit, setEdit] = useState(false);
  const [friends, setFriends] = useState([]);

  const onPressPencil = () => {
    setEdit(!edit);
  };

  const getFriends = async () => {
    const token = await AsyncStorage.getItem('key');
    try {
      const response = await axios.get(`${Server_IP}/friends`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
      setFriends(response.data);
    } catch (error) {
      console.error('친구 목록을 가져오는 데 실패했습니다:', error);
    }
  };

  useEffect(() => {
    getFriends();
  }, []);

  const handleFriendChange = () => {
    getFriends();
  };

  return (
    <View style={styles.screen}>
      <Header label="친구 목록" />
      <View style={styles.container}>
        {/* <View style={styles.searchbar}> */}
          {/* <Searchbar active={true} /> */}
        {/* </View> */}
        <View style={styles.friendContainer}>
          <View style={styles.leftContainer}>
            <Text style={styles.text}>친구 목록 ( {friends.length} )</Text>
            <Pressable onPress={onPressPencil}>
              <Octicons name="pencil" size={16} style={styles.icon} />
            </Pressable>
          </View>
        </View>
        <View style={styles.line}>
          <Line />
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
    marginBottom: 11,
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
  callButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  line: {
    width:'95%',
    marginBottom:11,
  },
});
