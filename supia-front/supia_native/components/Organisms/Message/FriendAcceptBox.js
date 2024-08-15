import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Label from '../../Atoms/ListItem';
import moment from 'moment';

const { width, height } = Dimensions.get('window');

const FriendAcceptBox = ({ friends }) => {

  const formatTime = dateString => {
    return dateString
      ? moment(dateString).format('YYYY/MM/DD HH:mm')
      : '시간 정보 없음';
  };

  return (
    <View>
      {friends.map(friendItem => (
        <View key={friendItem.messageId} style={styles.container}>
          <View style={styles.messageHeader}>
            <Text style={styles.messageText}>시스템</Text>
            <Text style={styles.timeText}>{formatTime(friendItem.sentTime)}</Text>
          </View>
          <View style={styles.messageContent}>
            <Label
              title={friendItem.fromMemberNickname || '제목 없음'}
              content={friendItem.content || '내용이 없습니다.'}
              url={friendItem.fromMemberImg || '기본 이미지 URL'}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  noRequestText: {
    textAlign: 'center',
    marginTop: height * 0.02, // 2% of screen height
    fontSize: width * 0.04, // 4% of screen width
    color: 'gray',
  },
  container: {
    marginTop: height * 0.02, // 2% of screen height
    width: '100%',
    paddingHorizontal: width * 0.03, // 3% of screen width
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: height * 0.015, // 1.5% of screen height
  },
  messageContent: {
    flexDirection: 'row',
    paddingVertical: height * 0.02, // 2% of screen height
    paddingHorizontal: width * 0.02, // 2% of screen width
  },
  messageText: {
    fontSize: width * 0.04, // 4% of screen width
  },
  timeText: {
    fontSize: width * 0.04, // 4% of screen width
    color: 'gray',
  },
});

export default FriendAcceptBox;
