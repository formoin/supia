import React from 'react';
import Searchbar from './organisms/SearchBar';
import { Octicons } from '@expo/vector-icons';
import Label from './atoms/ListItem';
import { Feather } from "@expo/vector-icons";
import { StyleSheet, View, Text, Modal, Pressable } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { TouchableWithoutFeedback } from 'react-native';

const Popup_Call = ({ visible, onClose, onOpenPopup }) => {
  const navigation = useNavigation();

  const goCallPage = () => {
    navigation.navigate('Call', { name: "Mill" });
  };

  if (!visible) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBackground}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View style={styles.titleRow}>
                <Text style={styles.modalTitle}>연락처</Text>
                <Pressable onPress={onClose}>
                  <Octicons name="x" size={30} />
                </Pressable>
              </View>
              <Searchbar active={true} style={styles.search} />
              <View style={styles.line} />
              <View style={styles.callOptionsRow}>
                <Label pic="user" title="mill" content="김미량" name="phone-call" onClose={onClose} onOpenPopup={onOpenPopup} />
                <Pressable onPress={goCallPage}>
                  <Feather name="video" size={24} />
                </Pressable>
              </View>
              <View style={styles.line} />
            </View>
          </TouchableWithoutFeedback>
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
    marginBottom: 20
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  line: {
    width: 290,
    height: 1,
    borderWidth: 1,
    borderColor: '#A2AA7B',
    opacity: 1,
    marginVertical: 10,
  },
  callOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 30,
    width: '100%',
  },
});
