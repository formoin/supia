import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Line from "../components/atoms/Line";
import useStore from './store/useStore';

const Divide = ({ text1, text2 }) => {
  const { activeText, setActiveText } = useStore();

  const toggleText1Color = () => {
    if (activeText !== 'text1') {
      setActiveText('text1');
    }
  };

  const toggleText2Color = () => {
    if (activeText !== 'text2') {
      setActiveText('text2');
    }
  };

  return (
    <View>
      <View style={styles.textContainer}>
        <TouchableOpacity onPress={toggleText1Color}>
          <Text style={[styles.text, { color: activeText === 'text1' ? '#141010' : 'lightgray' }]}>{text1}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleText2Color}>
          <Text style={[styles.text, { color: activeText === 'text2' ? '#141010' : 'lightgray' }]}>{text2}</Text>
        </TouchableOpacity>
      </View>
      <Line />
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    flexDirection: 'row',
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
});

export default Divide;
