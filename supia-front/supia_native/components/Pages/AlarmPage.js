import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../Atoms/Header';
import Divide from '../Divide';
import FriendAccept from '../Organisms/Message/FriendAcceptBox';
import FriendRequest from '../Organisms/Message/FriendRequestBox';
import GiftBox from '../Organisms/Message/GiftBox';
import useStore from '../store/useStore';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';

export default function AlarmScreen() {
  const { activeText, resetActiveText } = useStore();
  const isFocused = useIsFocused();

  useFocusEffect(
    React.useCallback(() => {
      if (isFocused) {
        resetActiveText();
      }
    }, [isFocused, resetActiveText]),
  );

  return (
    <View>
      <Header label="알림" />
      <View style={styles.divide}>
        <Divide text1="친구" text2="선물" />
        <View>
          {activeText === 'text1' ? (
            <>
              <FriendAccept />
              <FriendRequest />
            </>
          ) : (
            <GiftBox />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  divide: {
    marginTop: 20,
    alignItems: 'center',
  },
});
