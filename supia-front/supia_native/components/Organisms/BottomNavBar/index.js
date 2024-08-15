import React, {useState} from 'react';
import {View, StyleSheet, Pressable, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../../Pages/HomePage';
import SearchScreen from '../../Pages/SearchPage';
import StoreScreen from '../../Pages/StorePage';
import FriendScreen from '../../Pages/FriendPage';
import WalkingScreen from '../../Pages/WalkPage';
import WalkRecordScreen from '../../Pages/WalkRecordPage';
import MyPageScreen from '../../Pages/User/MyPage';
import CallScreen from '../../Pages/CallPage';
import DictionaryScreen from '../../Pages/DictionaryPage';
import MyForestScreen from '../../Pages/MyForest';
import DictionaryDetailScreen from '../../Pages/DictionaryDetailPage';
import MessageScreen from '../../Pages/MessagePage';
import AlarmScreen from '../../Pages/AlarmPage';
import CaptureScreen from '../../Pages/CapturePage';
import EditPageScreen from '../../Pages/User/EditMyPage';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import useStore from '../../store/useStore';
import Webview from '../../Pages/WebView';

const BottomTab = createBottomTabNavigator();

function WalkButton({onPress}) {
  return (
    <View style={styles.walkButtonContainer}>
      <View style={styles.walkButton}>
        <Pressable onPress={onPress} style={styles.walkButtonPressable}>
          <FontAwesome5 name="walking" size={24} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

function BottomNav() {
  const navigation = useNavigation();
  const startStopwatch = useStore(state => state.startStopwatch);
  const setWalkStartTime = useStore(state => state.setWalkStartTime);
  const setCurrentLocation = useStore(state => state.setCurrentLocation); // 현재 위치를 상태에 저장하는 함수
  const clearItems = useStore(state => state.clearItems);

  const handleWalkButtonPress = async () => {
    const currentTime = new Date().toISOString(); // 현재 시간
    setWalkStartTime(currentTime); // 상태에 시간 저장
    startStopwatch(); // 스톱워치 시작
    clearItems();
    navigation.navigate('Walk'); // 산책 페이지로 이동
  };

  return (
    <BottomTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ECEADE',
        },
        tabBarLabelStyle: {
          color: '#8C8677',
          fontSize: 12,
          marginTop: -3,
        },
      }}>
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: () => <Text style={styles.tabBarLabel}>홈</Text>,
          tabBarIcon: ({size}) => (
            <Feather name="home" size={size} color="#8C8677" />
          ),
        }}
      />
      <BottomTab.Screen
        name="Store"
        component={StoreScreen}
        options={{
          tabBarLabel: () => <Text style={styles.tabBarLabel}>상점</Text>,
          tabBarIcon: ({color, size}) => (
            <FontAwesome5 name="shopping-bag" size={size} color={'#8C8677'} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Walk"
        component={WalkingScreen}
        options={{
          tabBarButton: props => (
            <WalkButton {...props} onPress={handleWalkButtonPress} />
          ),
          tabBarLabel: () => {},
          tabBarStyle: {
            display: 'none',
          },
        }}
      />
      <BottomTab.Screen
        name="Friend"
        component={FriendScreen}
        options={{
          tabBarLabel: () => <Text style={styles.tabBarLabel}>친구</Text>,
          tabBarIcon: ({size}) => (
            <FontAwesome5 name="user-friends" size={size} color="#8C8677" />
          ),
        }}
      />
      <BottomTab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{
          tabBarLabel: () => <Text style={styles.tabBarLabel}>마이페이지</Text>,
          tabBarIcon: ({size}) => (
            <Feather name="user" size={size} color="#8C8677" />
          ),
        }}
      />
      <BottomTab.Screen
        name="Search"
        component={SearchScreen}
        options={{tabBarButton: () => null}}
      />
      <BottomTab.Screen
        name="WalkRecord"
        component={WalkRecordScreen}
        options={{tabBarButton: () => null}}
      />
      <BottomTab.Screen
        name="Dictionary"
        component={DictionaryScreen}
        options={{tabBarButton: () => null}}
      />
      <BottomTab.Screen
        name="MyForest"
        component={MyForestScreen}
        options={{
          tabBarButton: () => null,
          tabBarLabel: () => {},
          tabBarStyle: {display: 'none'},
        }}
      />
      <BottomTab.Screen
        name="DictionaryDetail"
        component={DictionaryDetailScreen}
        options={{tabBarButton: () => null}}
      />
      <BottomTab.Screen
        name="Call"
        component={Webview}
        options={{
          tabBarButton: () => null,
          tabBarStyle: {
            display: 'none',
          },
        }}
      />
      <BottomTab.Screen
        name="Message"
        component={MessageScreen}
        options={{tabBarButton: () => null}}
      />
      <BottomTab.Screen
        name="Alarm"
        component={AlarmScreen}
        options={{tabBarButton: () => null}}
      />
      <BottomTab.Screen
        name="EditProfile"
        component={EditPageScreen}
        options={{tabBarButton: () => null}}
      />
      <BottomTab.Screen
        name="Capture"
        component={CaptureScreen}
        options={{
          tabBarButton: () => null,
          tabBarStyle: {
            display: 'none',
          },
        }}
      />
    </BottomTab.Navigator>
  );
}

export default function BottomNavBar() {
  return (
    <View style={styles.container}>
      <BottomNav />
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   walkButtonContainer: {
//     top: -40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: 'rgba(162, 170, 123, 0.8)',
//   },
//   walkButton: {
//     width: 60,
//     height: 60,
//     borderRadius: 35,
//     backgroundColor: '#A2AA7B',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   tabBarLabel: {
//     color: '#8C8677',
//     fontSize: 12,
//     marginTop: -3,
//   },
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  walkButtonContainer: {
    top: Math.round((-40 / 844.5714285714286) * 844), // -40
    justifyContent: 'center',
    alignItems: 'center',
    width: Math.round((80 / 411.42857142857144) * 411), // 80
    height: Math.round((80 / 844.5714285714286) * 844), // 80
    borderRadius: Math.round((40 / 411.42857142857144) * 411), // 40
    backgroundColor: 'rgba(162, 170, 123, 0.8)',
  },
  walkButton: {
    width: Math.round((60 / 411.42857142857144) * 411), // 60
    height: Math.round((60 / 844.5714285714286) * 844), // 60
    borderRadius: Math.round((35 / 411.42857142857144) * 411), // 35
    backgroundColor: '#A2AA7B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarLabel: {
    color: '#8C8677',
    fontSize: Math.round((12 / 411.42857142857144) * 411), // 12
    marginTop: Math.round((-3 / 844.5714285714286) * 844), // -3
  },
});
