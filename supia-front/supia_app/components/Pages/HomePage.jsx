import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { FontAwesome6, Octicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import WeatherInfo from "../atoms/HomeInfo/WeatherInfo";
import MyInfo from "../atoms/HomeInfo/MyInfo";
import SlidePanel from '../organisms/SlidePanel'; // 슬라이드 패널 컴포넌트 추가
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function HomeScreen() {
  const navigation = useNavigation();

  const goDictionary = () => {
    navigation.navigate("Dictionary");
  }

  const goMyForest = () => {
    navigation.navigate("MyForest")
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.Headcontainer}>
          <View style={styles.textContainer}>
            <Text style={styles.hello}>Hello Varun</Text>
            <Text style={styles.bagga}>반갑습니다 00님</Text>
          </View>
          <View style={styles.topRight}>
            <Pressable style={{ marginRight: 20 }}>
              <Octicons name="mail" size={30} color="#8C8677" />
            </Pressable>
            <Pressable onPress={() => navigation.navigate("MyPage")}>
              <FontAwesome6 name="user" size={30} color="#8C8677" />
            </Pressable>
          </View>
        </View>

        <View>
            <Pressable onPress={goMyForest}>
              <Image
                source={require('../../assets/basic/forest_1.png')} // 이미지 경로
                style={styles.thumbnail}
              />
            </Pressable>
        </View>

        <View style={styles.foryou}>
          <Text style={styles.bagga}>For you</Text>
        </View>

        <View style={styles.info}>
          <WeatherInfo />
          <MyInfo />
        </View>

        {/* 슬라이드 패널 추가 */}
        {/* <SlidePanel /> */}
        <Pressable style={styles.slideHandleContainer} onPress={goDictionary}>
          <View style={styles.slideHandle} />
        </Pressable>

      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  Headcontainer: {
    width: '100%',
    height: '12%',
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10, // Added padding to ensure text doesn't get cut off
  },
  textContainer: {
    flex: 1, // Allow text container to take up available space
  },
  topRight: {
    flexDirection: 'row', // Arrange icons horizontally
    justifyContent: 'center', // Center icons vertically
    alignItems: 'center', // Center icons horizontally
  },
  hello: {
    color: '#414141',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  bagga: {
    color: '#321C1C',
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 30, // Adjust line height to ensure proper spacing
    marginTop: 10,
  },
  foryou:{
    width: '100%',
    height: '5%',
    marginBottom: 5
  },
  thumbnail:{
    width: '90%',
    height: 220,
    marginLeft: 20,
    marginBottom: 20,
    borderRadius: 15,
  },
  info: {
    width: '90%',
    height: '50%',
    margin: 20,
    flexDirection: 'row',
    justifyContent: "space-between",
  },
  slideHandleContainer: {
    position: 'absolute',
    top: '40%',
    bottom: 0,
    right: 0,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height:'10%',
  },
  slideHandle: {
    width: 10,
    height: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 5,
  },
});
