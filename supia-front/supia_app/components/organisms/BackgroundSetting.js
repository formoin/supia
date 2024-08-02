import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import Header from '../atoms/Header';
import Divide from '../Divide';
import Line from '../atoms/Line';
import useStore from '../store/useStore';
import Octicons from 'react-native-vector-icons/Octicons';

export default function BackgroundSetting({ goSetting }) {
  const { activeText, setActiveText, resetActiveText } = useStore();
  const isFocused = useIsFocused();

  useFocusEffect(
    React.useCallback(() => {
      resetActiveText();
    }, [resetActiveText])
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header label="배경" />
        <Pressable onPress={goSetting} style={styles.closeButton}>
          <Octicons name="x" size={30} style={styles.closeIcon} />
        </Pressable>
      </View>
      <View style={styles.divideContainer}>
        <Divide text1="배경사진" text2="배경음악" />
      </View>
      {activeText === 'text1' && (
        <View style={styles.imageContainer}>
            <Image
              source={{ uri: '<path-to-image>' }}
              style={styles.image}
            />
          <Text style={styles.text}>희망의 숲</Text>
        </View>
      )}
      {activeText === 'text2' && (
        <View style={styles.imageContainer}>
          <Text style={styles.text}>모닥불 타는 소리</Text>
        </View>
      )}
      <Line />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 362,
    height: 375,
    borderRadius: 32,
    backgroundColor: '#FCFCFC',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingRight: 20
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
