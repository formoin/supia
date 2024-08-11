import React from 'react';
import {StyleSheet, View, Text, Pressable, Dimensions} from 'react-native';
// import { Entypo } from '@expo/vector-icons';
import Entypo from 'react-native-vector-icons/Entypo';
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';

const {width: windowWidth} = Dimensions.get('window');

export default function Header({label, goto, noback}) {
  const navigation = useNavigation();

  const onPressBackIcon = () => {
    if (goto) {
      navigation.navigate(goto);
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.HeaderContainer}>
      <View style={{left: 10}}>
        {!noback && (
          <Pressable onPress={onPressBackIcon}>
            <Entypo
              name="chevron-small-left"
              size={25}
              style={styles.BackIcon}
            />
          </Pressable>
        )}
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  HeaderContainer: {
    flexDirection: 'row',
    width: windowWidth,
    paddingHorizontal: 18,
    alignItems: 'center',
    paddingTop: 20,
  },
  BackIcon: {
    // margin: 5, // 아이콘 오른쪽 여백 추가
  },
  label: {
    flex: 1, // 나머지 공간을 차지하도록 설정
    fontSize: 20,
    color: '#000',
    textAlign: 'center', // 텍스트 중앙 정렬

    marginRight: 20,
  },
});
