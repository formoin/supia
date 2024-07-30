import { useEffect } from "react";
import { StyleSheet, Text, View, Pressable, Platform, AsyncStora } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStatusBarHeight } from "react-native-status-bar-height";
import BottomNavBar from "./components/organisms/BottomNavBar";
import HomeScreen from "./components/Pages/HomePage";
import LoginScreen from "./components/Pages/User/LoginPage";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import SignUpScreen from "./components/Pages/User/SignUpPage";

const statusBarHeight = getStatusBarHeight();
const Stack = createStackNavigator();

export default function App() {
  // 로그인이 되어있다면 앱 실행 시 바로 Home으로 들어갈 수 있게 처리
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("key");
      if (token) {
        navigationRef.current?.navigate("Home");
      }
    };
    checkLoginStatus();
    // useEffect 매개변수를 안넣어서 처음 마운트 될때만 기능
  }, []);

  // return (
  //   <View style={styles.container}>
  //     <NavigationContainer>
  //       <Stack.Navigator
  //         initialRouteName="Home"
  //         screenOptions={{ headerShown: false }}
  //       >
  //         <Stack.Screen name="Login" component={LoginScreen} />
  //         <Stack.Screen name="Home" component={HomeScreen} />
  //         <Stack.Screen name="Regist" component={SignUpScreen} />
  //       </Stack.Navigator>
  //     </NavigationContainer>
  //   </View>
  // );

  return <BottomNavBar />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    //alignItems: "center",
    //justifyContent: "center",
    paddingTop: Platform.OS === "ios" ? 0 : statusBarHeight,
  },
});