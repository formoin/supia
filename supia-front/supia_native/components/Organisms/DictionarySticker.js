import React from 'react';
import Header from '../Atoms/Header';
import useStore from '../store/useStore';
import DicDivide from '../DicDivide';
import Octicons from 'react-native-vector-icons/Octicons';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';

export default function DictionarySticker({  }) {


  return (
    <View style={styles.container}>
        <View style={styles.headerContainer}>
            <Header label="나의 도감" />
        </View>
      
          
        <ScrollView>

        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 362,
    height: 408,
    borderRadius: 32,
    backgroundColor: '#FCFCFC',
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    paddingRight: 20
  },
  closeButton: {
    padding: 7,
  },
  closeIcon: {
    color: 'black',
  },
  p_value: {
    padding: 20,
    alignItems: 'center',
    paddingTop: 30,
  },
  Cardcontainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // 자식들이 줄을 넘어가도록 설정
    justifyContent: 'flex-start',
    padding: 10,
  },
});
