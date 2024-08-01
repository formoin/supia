import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Line from "../components/atoms/Line";
import useStore from './store/useStore';

const DicDivide = ({ text1, text2, text3, text4 }) => {
  const { activeText, setActiveText } = useStore();

  const toggleTextColor = (text) => {
    if (activeText !== text) {
      setActiveText(text);
    }
  };

  return (
    <View>
      <View style={styles.textContainer}>
        <TouchableOpacity
          onPress={() => toggleTextColor('text1')}
          style={[
            styles.button,
            {
              backgroundColor: activeText === 'text1' ? '#A2AA7B' : 'transparent',
              borderColor: activeText === 'text1' ? '#A2AA7B' : 'transparent',
            },
          ]}
        >
          <Text style={[styles.text, { color: activeText === 'text1' ? '#FFF' : 'lightgray' }]}>
            {text1}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => toggleTextColor('text2')}
          style={[
            styles.button,
            {
              backgroundColor: activeText === 'text2' ? '#A2AA7B' : 'transparent',
              borderColor: activeText === 'text2' ? '#A2AA7B' : 'transparent',
            },
          ]}
        >
          <Text style={[styles.text, { color: activeText === 'text2' ? '#FFF' : 'lightgray' }]}>
            {text2}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => toggleTextColor('text3')}
          style={[
            styles.button,
            {
              backgroundColor: activeText === 'text3' ? '#A2AA7B' : 'transparent',
              borderColor: activeText === 'text3' ? '#A2AA7B' : 'transparent',
            },
          ]}
        >
          <Text style={[styles.text, { color: activeText === 'text3' ? '#FFF' : 'lightgray' }]}>
            {text3}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => toggleTextColor('text4')}
          style={[
            styles.button,
            {
              backgroundColor: activeText === 'text4' ? '#A2AA7B' : 'transparent',
              borderColor: activeText === 'text4' ? '#A2AA7B' : 'transparent',
            },
          ]}
        >
          <Text style={[styles.text, { color: activeText === 'text4' ? '#FFF' : 'lightgray' }]}>
            {text4}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.line}>
        <Line />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // 여러 줄로 텍스트가 나눠지도록 허용
    justifyContent: 'flex-start', // 텍스트를 왼쪽으로 정렬
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 22,
    opacity: 1,
    padding: 8,
  },
  button: {
    borderWidth: 1,
    borderRadius: 5,
  },
  line: {
    marginTop: -2
  }
});

export default DicDivide;
