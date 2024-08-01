import { useEffect } from "react";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStatusBarHeight } from "react-native-status-bar-height";
import BottomNavBar from "./components/organisms/BottomNavBar";
import LoginScreen from "./components/Pages/User/LoginPage";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import SignUpScreen from "./components/Pages/User/SignUpPage";
import StoreScreen from "./components/Pages/WalkRecordPage";
import CallScreen from "./components/Pages/CallPage";
import Walking from "./components/Pages/WalkPage";
const statusBarHeight = getStatusBarHeight();
import MyPageScreen from "./components/Pages/User/MyPage";
import EditProfileScreen from "./components/Pages/User/EditMyPage";

const Stack = createStackNavigator();

export default function App() {
  // 로그인이 되어있다면 앱 실행 시 바로 Home으로 들어갈 수 있게 처리
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("key");
      if (token) {
        navigationRef.current?.navigate("Main");
      }
    };
    checkLoginStatus();
    // useEffect 매개변수를 안넣어서 처음 마운트 될때만 기능
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={BottomNavBar} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Regist" component={SignUpScreen} />
        {/* <Stack.Screen name="WalkRecord" component={StoreScreen} /> */}
        {/* <Stack.Screen name="Walking" component={Walking} /> */}
        <Stack.Screen name="Call" component={CallScreen} />
        <Stack.Screen name="MyPage" component={MyPageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Home 대신 BottomNavBar로 이동
// BottomNavbar는 Home을 보여준다
