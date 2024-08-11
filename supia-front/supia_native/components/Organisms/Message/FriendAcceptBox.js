import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import Label from '../../Atoms/ListItem';
import React, { useState } from 'react';
import axios from 'axios';

export default function FriendAcceptBox({friend}) {

  if (!friend || friend.length === 0) {
    return null; // 또는 빈 View를 반환하여 아무것도 렌더링하지 않음
  }

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.messageHeader}>
          <Text style={styles.messageText}>시스템</Text>
          <Text style={styles.timeText}>{friend[0].sentTime}</Text>
        </View>
        <View style={styles.messageContent}>
          <Label pic="infocirlceo" title="친구 신청" content={friend[0].content} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: '100%',
    height: 100,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  messageContent: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  messageText: {
    fontSize: 16,
  },
  timeText: {
    fontSize: 16,
    color: 'gray',
  },
});
