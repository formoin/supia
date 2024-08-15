import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import Label from '../../Atoms/ListItem';
import GiftModal from './GiftModal';
import moment from 'moment';

const { width, height } = Dimensions.get('window');

export default function GiftBox({ gifts, getGift }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGift, setSelectedGift] = useState(null); // 선택된 선물

  const onPress = (item) => {
    setSelectedGift(item);
    setModalVisible(true);
  };

  const handleAccept = () => {
    // 선물 수락 시 처리할 로직
    gifts.filter(g => g.messageId !== selectedGift.messageId); // 선물 목록에서 해당 선물 제거
    getGift();
  };

  const handleRefuse = () => {
    // 선물 거절 시 처리할 로직
    gifts.filter(g => g.messageId !== selectedGift.messageId); // 선물 목록에서 해당 선물 제거
    getGift();
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
              url={item.content}
              content={`${item.fromMemberNickname}님이 ${item.species}를 보내셨습니다.`}
              type="gift"
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
    marginTop: height * 0.02, // 2% of screen height
    width: '95%',
    height: height * 0.12, // 12% of screen height
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.04, // 4% of screen width
    paddingVertical: height * 0.01, // 1% of screen height
  },
  messageContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: width * 0.025, // 2.5% of screen width
    paddingVertical: height * 0.01, // 1% of screen height
  },
  messageText: {
    fontSize: width * 0.04, // 4% of screen width
  },
  button: {
    width: width * 0.12, // 12% of screen width
    height: height * 0.045, // 4.5% of screen height
    backgroundColor: '#A2AA7B',
    padding: height * 0.01, // 1% of screen height
    borderRadius: 5,
    alignItems: 'center',
    marginTop: height * 0.01, // 1% of screen height
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: width * 0.03, // 3% of screen width
  },
});
