import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Label from '../../Atoms/ListItem';
import GiftModal from './GiftModal';
import moment from 'moment'

export default function GiftBox({ gifts }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGift, setSelectedGift] = useState(null); // 선택된 선물

  const onPress = (item) => {
    setSelectedGift(item);
    setModalVisible(true);
  };

  const handleAccept = () => {
    // 선물 수락 시 처리할 로직
   gifts.filter(g => g.messageId !== selectedGift.messageId); // 선물 목록에서 해당 선물 제거
  };

  const handleRefuse = () => {
    // 선물 거절 시 처리할 로직
gifts.filter(g => g.messageId !== selectedGift.messageId); // 선물 목록에서 해당 선물 제거
  };

  const formatTime = (dateString) => {
    return dateString ? moment(dateString).format('YYYY/MM/DD HH:mm') : '시간 정보 없음';
  };

  return (
    <View>
      {gifts.map((item, index) => (
        <View key={index} style={styles.container}>
          <View style={styles.messageHeader}>
            <Text style={styles.messageText}>시스템</Text>
            <Text style={styles.timeText}>{formatTime(item.sentTime)}</Text>
          </View>
          <View style={styles.messageContent}>
            <Label
              title="선물 도착"
              url={item.fromMemberImg}
              content={`${item.fromMemberNickname}님이 ${item.species}를 보내셨습니다.`}
            />
            <Pressable style={styles.button} onPress={() => onPress(item)}>
              <Text style={styles.buttonText}>확인</Text>
            </Pressable>
          </View>
        </View>
      ))}

      {/* 선택된 선물의 정보를 모달에 전달 */}
      {selectedGift && (
        <GiftModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          imageUrl={selectedGift.content} // 선물 이미지 URL
          content={`${selectedGift.fromMemberNickname}님이 ${selectedGift.species}를 보내셨습니다.`}
          messageId={selectedGift.messageId}
          onAccept={handleAccept} // 수락 시 호출할 콜백 함수
          onRefuse={handleRefuse} // 거절 시 호출할 콜백 함수
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: '95%',
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
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  messageText: {
    fontSize: 16,
  },
  button: {
    width: 60,
    height: 35,
    backgroundColor: '#A2AA7B',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
});
