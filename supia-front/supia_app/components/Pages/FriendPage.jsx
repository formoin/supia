import { StyleSheet, View, Text, Pressable, Modal } from "react-native";
import Header from "../atoms/Header";
import Searchbar from "../organisms/SearchBar";
import ListItem from "../atoms/ListItem";
import { Octicons } from '@expo/vector-icons';
import SelectOptions from '../atoms/SelectOptions'
import { useState } from 'react';
import NoteModal from "../NoteModal";

export default function FriendScreen() {
  const [edit, setEdit] = useState(false);

  const friendNum = 50;
  const onPressPencil = () => {
    setEdit(!edit)
  };

  return (
    <View style={styles.screen}>
      <Header label="친구 목록" />

      <View style={styles.container}>
        <View style={styles.searchbar}>
          <Searchbar active={true} />
        </View>

        <View style={styles.friendContainer}>
          <View style={styles.leftContainer}>
            <Text style={styles.text}>친구 목록 ( {friendNum} )</Text>
            <Pressable onPress={onPressPencil}>
              <Octicons
                name="pencil"
                size={16}
                style={styles.icon}
              />
            </Pressable>
          </View>
          <View>
            <SelectOptions/>
          </View>
        </View>

        <ListItem pic="user" title="yewone1" content="김예원" name={edit ? 'x' : 'message-square'} UserLevel="새싹"/>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  container: {
    alignItems: 'center',
    paddingTop: 30,
  },
  friendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 30,
    marginBottom:20
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  icon: {
    paddingTop: 5,
    margin: 5
  },
  searchbar: {
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom:15,
  },
});