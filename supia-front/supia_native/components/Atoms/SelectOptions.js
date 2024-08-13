import React, {useEffect} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {StyleSheet} from 'react-native';
import {useState} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Server_IP} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function SelectOptions({onFriendSelect}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [friends, setFriends] = useState([]);
  const [items, setItems] = useState(
    friends.map(friend => ({
      label: `${friend.name} (${friend.nickname})`, // 친구 이름과 닉네임 표시
      value: friend.memberId, // 선택된 친구의 friendId를 value로 설정
    }))
  );

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
      console.log(response.data);
      console.log('친구 리스트 불러오기 성공');
    } catch (error) {
      console.error('친구 목록을 가져오는 데 실패했습니다:', error);
    }
  };

  useEffect(() => {
    getFriends(); // 페이지가 렌더링될 때마다 실행
  }, []);

  useEffect(() => {
    // friends가 업데이트될 때마다 items 업데이트
    setItems(
      friends.map(friend => ({
        label: `${friend.name} (${friend.nickname})`, // 친구 이름과 닉네임 표시
        value: friend.memberId, // 선택된 친구의 friendId를 value로 설정
      }))
    );
  }, [friends])

  return (
    <DropDownPicker
      open={open} // 드롭다운의 열림/닫힘 상태를 제어합니다.
      value={value} // 현재 선택된 값을 설정합니다.
      items={items} // 드롭다운에 표시될 항목들을 설정합니다.
      setOpen={setOpen} // 드롭다운의 열림/닫힘 상태를 변경하는 함수를 설정합니다.
      setValue={setValue} // 선택된 값을 변경하는 함수를 설정합니다.
      setItems={setItems} // 드롭다운 항목들을 변경하는 함수를 설정합니다.
      placeholder="선물 보낼 친구를 골라주세요"
      textStyle={{fontSize: 12}}
      style={styles.dropdown}
      TickIconComponent={() => (
        <FontAwesome name="check" size={12} color="black" />
      )}
      ArrowDownIconComponent={() => (
        <FontAwesome name="angle-down" size={14} color="black" />
      )}
      ArrowUpIconComponent={() => (
        <FontAwesome name="angle-up" size={14} color="black" />
      )}
      onChangeValue={(value) => {
        setValue(value);
        onFriendSelect(value); // 선택된 friendId를 부모 컴포넌트에 전달
      }}
    />
  );
}

const styles = StyleSheet.create({
  dropdown: {
    width: '100%',
    height: '85%',
    borderRadius: 10,
    minHeight: 30,
  },
});
