import {StyleSheet, View, Text, Pressable, Modal} from 'react-native';
import Header from '../Atoms/Header';
import Searchbar from '../Organisms/SearchBar';
import ListItem from '../Atoms/ListItem';
import Octicons from 'react-native-vector-icons/Octicons';
import SelectOptions from '../Atoms/SelectOptions';
import React, {useState, useEffect} from 'react';
import axios from 'axios';

export default function FriendScreen() {
  const [edit, setEdit] = useState(false);
  const [friends, setFriends] = useState([])

  const onPressPencil = () => {
    setEdit(!edit);
  };

  const getFriends = async () => {
    const url = 'http://i11b304.p.ssafy.io/api/friends'; // API URI
    const headers = {
        Authorization: `Bearer ${token}`, // Authorization 헤더에 토큰 추가
    };
    try {
      const response = await axios.get(url, {
          headers: headers,
          params: {
            memberId: memberId, //memberId 변경
          },
      });
      setFriends(response.data);
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
