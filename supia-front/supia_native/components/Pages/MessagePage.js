import {View, Text, StyleSheet, Pressable} from 'react-native';
import Header from '../Atoms/Header';
import Label from '../Atoms/ListItem';
import React from 'react';
import MessageBox from '../Organisms/MessageBox';

export default function MessageScreen() {

  return (
    <View>
      <Header label="메세지" />
      <MessageBox />
    </View>
  );
}

const styles = StyleSheet.create({

});
