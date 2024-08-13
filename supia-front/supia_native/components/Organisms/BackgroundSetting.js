import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Pressable, Image, ScrollView, Dimensions} from 'react-native';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import Header from '../Atoms/Header';
import Divide from '../Divide';
import Line from '../Atoms/Line';
import useStore from '../store/useStore';
import Octicons from 'react-native-vector-icons/Octicons';
const {width, height} = Dimensions.get('window');

export default function BackgroundSetting({goSetting, bgiData, bgmData}) {
  const {activeText, setActiveText, resetActiveText, BGI, setBGI, BGM, setBGM} = useStore();

  const handleBGIChange = (item) => {
    setBGI(item.path); // 클릭한 항목의 경로로 상태 업데이트
  }

  const handleBGMChange = (item) => {
    if (BGM === item.path) {
      setBGM(null); // 현재 선택된 항목을 다시 클릭하면 취소 (상태를 null로 설정)
    } else {
      setBGM(item.path); // 새로운 항목 선택
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      resetActiveText();
    }, [resetActiveText]),
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header label="배경" noback='noback'/>
        <Pressable onPress={goSetting} style={styles.closeButton}>
          <Octicons name="x" size={30} style={styles.closeIcon} />
        </Pressable>
      </View>
      <View style={styles.divideContainer}>
        <Divide text1="배경사진" text2="배경음악" />
      </View>

    {activeText === 'text1' && bgiData && (
      <ScrollView>
        {bgiData.map((item, index) => (
          <View key={index} >
            <Pressable
              style={[ styles.imageContainer, { backgroundColor: BGI === item.path ? 'gray' : 'white' }]}
              onPress={() => handleBGIChange(item)} >
              <Image source={{ uri: item.path }} style={styles.image} />
              <Text style={styles.text}>{item.name}</Text>
            </Pressable>
            <Line />
          </View>
        ))}
      </ScrollView>
    )}

    {activeText === 'text2' && bgmData && (
      <ScrollView>
        {bgmData.map((item, index) => (
          <View key={index} >
            <Pressable
              style={[ styles.imageContainer, { backgroundColor: BGM === item.path ? 'gray' : 'white' }]}
              onPress={() => handleBGMChange(item)} >
              <Text style={styles.text}>{item.name}</Text>
            </Pressable>
            <Line />
          </View>
        ))}
      </ScrollView>
    )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: height*0.45,
    height: width,
    borderRadius: 32,
    backgroundColor: '#FCFCFC',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingRight: 20,
  },
  closeButton: {
    padding: 7,
  },
  closeIcon: {
    color: 'black',
  },
  divideContainer: {
    marginTop: 30,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    marginLeft: 10,
  },
  image: {
    width: 81,
    height: 74,
    borderRadius: 20,
    backgroundColor: 'lightgray',
  },
  text: {
    marginLeft: 20,
    fontSize: 16,
    lineHeight: 74,
    textAlignVertical: 'center',
  },
});
