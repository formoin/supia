import React from 'react';
import Searchbar from './Organisms/SearchBar';
import Octicons from 'react-native-vector-icons/Octicons';
import Label from './Atoms/ListItem';
import Feather from 'react-native-vector-icons/Feather';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Popup_Call = ({visible, onClose, friends, memberId, memberName}) => {
  const navigation = useNavigation();

  const goCallPage = async friend => {
    onClose();
    try {
      // 비즈니스 로직 실행 (예: API 호출)
      // await someApiCall(friend);

      // 네비게이션 로직
      navigation.navigate('Call', {
        isCaller: true,
        targetUserId: friend.memberId,
        userId: memberId,
        memberName: memberName,
      });
    } catch (error) {
      console.error('Failed to start call:', error);
    }
  };

  if (!visible) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.modalTitle}>연락처 ({friends.length})</Text>
              <Pressable onPress={onClose}>
                <Octicons name="x" size={30} />
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              {friends.length > 0 ? (
                friends.map(friend => (
                  <View key={friend.memberId} style={styles.friendItem}>
                    <View style={styles.callOptionsRow}>
                      <Label
                        title={friend.nickname}
                        content={friend.name}
                        url={friend.profileImg}
                        name="video"
                        onClose={onClose}
                      />
                      <Pressable
                        onPress={() => goCallPage(friend)}
                        style={styles.callButton}></Pressable>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.noFriendsText}>No friends available</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default Popup_Call;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    height: 400,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContainer: {
    alignItems: 'center',
  },
  callOptionsRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  callButton: {
    paddingLeft: 25,
  },
  noFriendsText: {
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
    textAlign: 'center',
  },
  friendItem: {
    width: '95%',
    alignItems: 'center',
  },
});
