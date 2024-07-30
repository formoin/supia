import { StyleSheet, Text, View, Pressable, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../../Pages/HomePage";
import SearchScreen from "../../Pages/SearchPage";
import StoreScreen from "../../Pages/StorePage";
import FriendScreen from "../../Pages/FriendPage";
import WalkingScreen from "../../Pages/WalkPage";

import { Feather } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { useNavigation } from '@react-navigation/native';
import useStore from '../../store/useStore';

const statusBarHeight = getStatusBarHeight();
const BottomTab = createBottomTabNavigator();

function WalkButton({ onPress }) {
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
  const startStopwatch = useStore((state) => state.startStopwatch);

  const handleWalkButtonPress = () => {
    startStopwatch(); // 스톱워치 시작
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
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: () => <Text style={styles.tabBarLabel}>홈</Text>,
          tabBarIcon: ({ size }) => (
            <Feather name="home" size={size} color="#8C8677" />
          ),
        }}
      />
      <BottomTab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: () => <Text style={styles.tabBarLabel}>검색</Text>,
          tabBarIcon: ({ size }) => (
            <Feather name="search" size={size} color="#8C8677" />
          ),
        }}
      />
      <BottomTab.Screen
        name="Walk"
        component={WalkingScreen}
        options={{
          tabBarButton: (props) => <WalkButton {...props} onPress={handleWalkButtonPress} />,
          tabBarLabel: () => {},
        }}
      />
      <BottomTab.Screen
        name="Friend"
        component={FriendScreen}
        options={{
          tabBarLabel: () => <Text style={styles.tabBarLabel}>친구</Text>,
          tabBarIcon: ({ size }) => (
            <Octicons name="person" size={size} color="#8C8677" />
          ),
        }}
      />
      <BottomTab.Screen
        name="Store"
        component={StoreScreen}
        options={{
          tabBarLabel: () => <Text style={styles.tabBarLabel}>상점</Text>,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="shopping-bag" size={size} color={"#8C8677"} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

export default function BottomNavBar() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <BottomNav />
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "ios" ? 0 : statusBarHeight,
  },
  walkButtonContainer: {
    top: -40,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(162, 170, 123, 0.8)",
  },
  walkButton: {
    width: 60,
    height: 60,
    borderRadius: 35,
    backgroundColor: "#A2AA7B",
    justifyContent: "center",
    alignItems: "center",
  },
  tabBarLabel: {
    color: "#8C8677",
    fontSize: 12,
    marginTop: -3,
  },
});
