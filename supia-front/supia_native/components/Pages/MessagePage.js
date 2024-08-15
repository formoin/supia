import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Pressable, ActivityIndicator,ScrollView} from 'react-native';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import Header from '../Atoms/Header';
import SentMessage from '../Organisms/Message/SentMessageBox';
import SendMessage from '../Organisms/Message/SendMessageBox';
import Octicons from 'react-native-vector-icons/Octicons';
import useStore from '../store/useStore';
import loginStore from '../store/useLoginStore';
import Divide from '../Divide';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Server_IP} from '@env';

export default function MessageScreen() {
  const isFocused = useIsFocused();
  const [toMessage, setToMessage] = useState(null);
  const [fromMessage, setFromMessage] = useState(null);
  const [edit, setEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const {activeText, setActiveText, resetActiveText} = useStore();
  // const { token } = loginStore.getState();

  const onPressPencil = () => {
    setEdit(prevEdit => !prevEdit);
  };

  useFocusEffect(
    React.useCallback(() => {
      resetActiveText();
    }, [resetActiveText])
  );

    useEffect(() => {
      setEdit(false);
      if (activeText === 'text1') {
        getFromMessage();
      } else if (activeText === 'text2') {
        getToMessage();
      }
    }, [activeText]);

  const getFromMessage = async () => {
    const token = await AsyncStorage.getItem('key');

    try {
      setIsLoading(true);
      const response = await axios.get(`${Server_IP}/messages/from`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
      if (response.status === 200) {
        const filteredMessages = response.data.filter(
          message => message.category === 1,
        );
        setFromMessage(filteredMessages);
      } else {
        console.log('보낸 메세지함 리스트 로딩 실패');
      }
    } catch (error) {
      console.error('보낸 메세지함 요청 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getToMessage = async () => {
    const token = await AsyncStorage.getItem('key');

    try {
      setIsLoading(true);
      const response = await axios.get(`${Server_IP}/messages/to`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
      if (response.status === 200) {
        const filteredMessages = response.data.filter(
          message => message.category === 1,
        );
        setToMessage(filteredMessages);
      } else {
        console.log('받은 메세지함 리스트 로딩 실패');
      }
    } catch (error) {
      console.error('받은 메세지함 요청 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      <Header label="메세지" />
      <View style={styles.divideContainer}>
        <Divide text1="보낸 메세지" text2="받은 메세지" />
        <Pressable onPress={onPressPencil} style={styles.pencilIcon}>
          <Octicons name="pencil" size={16} />
        </Pressable>
      </View>
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.boxContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#A2AA7B" />
        ) : activeText === 'text1' ? (
          <SendMessage
            edit={edit}
            fromMessage={fromMessage}
            onDelete={getFromMessage}
          />
        ) : (
          <SentMessage
            edit={edit}
            toMessage={toMessage}
            getToMessage={getToMessage}
          />
        )}
      </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  divideContainer: {
    width: '95%',
    marginLeft:'2.5%',
    marginTop: 25,
  },
  pencilIcon: {
    position: 'absolute',
    right: 10,
    bottom:7,
    alignItems: 'center',
  },
  boxContainer: {
    alignItems: 'center',
  },
  scrollViewContainer: {
    flexGrow: 1,
    paddingBottom: 250
  },
});