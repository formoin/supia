import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {StyleSheet, View, Text, Image} from 'react-native';

export default function MyInfo({level, point, distance}) {
  const getLevelInfo = level => {
    switch (level) {
      case 0:
        return {text: '씨앗', image: require('../../../assets/level/씨앗.png')};
      case 1:
        return {text: '새싹', image: require('../../../assets/level/새싹.png')};
      case 2:
        return {text: '잎새', image: require('../../../assets/level/잎새.png')};
      case 3:
        return {text: '꽃', image: require('../../../assets/level/꽃.png')};
      case 4:
        return {text: '열매', image: require('../../../assets/level/열매.png')};
    }
  };
  const {text, image} = getLevelInfo(level);

  return (
    <View style={styles.container}>
      <View style={styles.itemcontainer}>
        <View style={styles.iconTextContainer}>
          <View style={styles.iconText}>
            <MaterialCommunityIcons
              name="crown-outline"
              size={30}
              color="#321C1C"
            />
            <Text style={styles.textstyle}>레벨</Text>
          </View>
          <View style={styles.iconText}>
            <Image source={image} style={{marginBottom: 5}} />
            <Text>{text}</Text>
          </View>
        </View>
      </View>

      <View style={styles.itemcontainer}>
        <View style={styles.iconTextContainer}>
          <View style={styles.iconText}>
            <Fontisto name="dollar" size={30} color="#8C8677" />
            <Text style={styles.textstyle}>포인트</Text>
          </View>
          <View style={styles.centeredText}>
            <Text>{point} P</Text>
          </View>
        </View>
      </View>

      <View style={styles.itemcontainer}>
        <View style={styles.iconTextContainer}>
          <View style={styles.iconText}>
            <Ionicons name="footsteps-outline" size={30} color="#8C8677" />
            <Text style={styles.textstyle}>거리</Text>
          </View>
          <View style={styles.centeredText}>
            <Text>{distance * 0.001} KM</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '45%',
    height: '85%',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    opacity: 0.8,
    backgroundColor: '#FBFBFB',
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemcontainer: {
    width: '100%',
    height: '31%',
    // borderRadius: 20,
    // borderWidth: 2,
    // borderColor: '#E5E5E5',
    opacity: 0.8,
    backgroundColor: '#FBFBFB',
    padding: 15,
    justifyContent: 'center',
  },
  iconTextContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Added to vertically center content
  },
  iconText: {
    alignItems: 'center',
  },
  image: {
    width: 30,
    height: 30,
    backgroundColor: 'grey',
    borderRadius: 15, // Optional: Adjust border radius for rounded image
  },
  textstyle: {
    fontSize: 12,
    fontWeight: '400',
  },
  centeredText: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
