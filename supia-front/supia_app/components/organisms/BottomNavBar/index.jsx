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

const statusBarHeight = getStatusBarHeight();
const BottomTab = createBottomTabNavigator();

// 중앙 산책 버튼을 위한 커스텀 View
// BottomTab.Navigator에서 tabBarButton을 사용하면 tabBarIcon, tabBarLabel이 자동으로 children으로 생성됨
// onPress도 Navigator에서 제공하는 페이지 이동이 그대로 들어가게 됨
function WalkButton({ children, onPress }) {
  return (
    <View style={styles.walkButtonContainer}>
      <View style={styles.walkButton}>
        <Pressable onPress={onPress} style={styles.walkButtonPressable}>
          {children}
        </Pressable>
      </View>
    </View>
  );
}

function BottomNav() {
  return (
    <BottomTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ECEADE', // 베이지색 배경
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
          tabBarButton: (props) => <WalkButton {...props} />,
          tabBarLabel: () => {},
          tabBarIcon: ({ size }) => (
            <FontAwesome5 name="walking" size={size} color="#fff" />
          ),
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
    backgroundColor: "rgba(162, 170, 123, 0.8)", // Background circle color
  },
  walkButton: {
    width: 60,
    height: 60,
    borderRadius: 35,
    backgroundColor: "#A2AA7B", // Main button color
    justifyContent: "center",
    alignItems: "center",
  },
  tabBarLabel: {
    color: "#8C8677",
    fontSize: 12,
    marginTop: -3,
  },
});
