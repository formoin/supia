import { StyleSheet, Text, View, Pressable, Platform } from "react-native";
import BottomNavBar from "./components/organisms/BottomNavBar";


export default function App() {
  return <BottomNavBar />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});