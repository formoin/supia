import React from 'react';
import { Ionicons, Fontisto, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View, Text, Image } from 'react-native';

export default function MyInfo() {
  return (
    <View style={styles.container}>
      <View style={styles.itemcontainer}>
        <View style={styles.iconTextContainer}>
          <View style={styles.iconText}>
            <MaterialCommunityIcons name="crown-outline" size={30} color="#321C1C" />
            <Text style={styles.textstyle}>레벨</Text>
          </View>
          <View style={styles.iconText}>
            <Image style={styles.image} />
            <Text>새싹</Text>
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
            <Text>200 P</Text>
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
            <Text>15.6 KM</Text>
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
  }
});
