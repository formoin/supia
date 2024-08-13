import React, {useEffect} from 'react';
import Immersive from 'react-native-immersive';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavBar from './components/Organisms/BottomNavBar';
import LoginScreen from './components/Pages/User/LoginPage';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import SignUpScreen from './components/Pages/User/SignUpPage';
import CallScreen from './components/Pages/CallPage';
import MyPageScreen from './components/Pages/User/MyPage';

const Stack = createStackNavigator();

export default function App() {
  //로그인이 되어있다면 앱 실행 시 바로 Home으로 들어갈 수 있게 처리
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('key');
      if (token) {
        navigationRef.current?.navigate('Main');
      }
    };
    checkLoginStatus();
    // useEffect 매개변수를 안넣어서 처음 마운트 될때만 기능
    // 전체 화면 모드로 전환
    Immersive.setImmersive(true);

    return () => {
      // 앱이 언마운트될 때 원래 상태로 복원
      Immersive.setImmersive(false);
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={BottomNavBar} />
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
