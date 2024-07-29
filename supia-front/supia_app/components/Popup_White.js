import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import Line from './atoms/Line'

const Popup_White = ({dong}) => {
  return (
    <View style={styles.rectangle}>
        <Text style={styles.text}>{dong}에서 발견된 자연물</Text>
        <Line />
        <View style={styles.container}>
            <Image
              source={{ url: '' }}
              style={styles.image}
            />
            <Text style={styles.p_text}>들꽃</Text>
        </View>
        <Line />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10
  },
  rectangle: {
     display: 'flex',
     width: 240,
     height: 278,
     borderRadius: 6,
     backgroundColor: '#fff',
     opacity: 0.7,
   },
   image: {
      width: 40,
      height: 40,
      borderRadius: 50,
      backgroundColor: '#fff',
   },
   text: {
      padding: 20
   },
   p_text: {
      paddingTop: 10,
      paddingLeft: 20
   }
});

export default Popup_White;
