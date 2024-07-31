import { View, Text, Pressable, StyleSheet } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View>
      <View style={styles.container}>
        <Text>로그인 시 : Home 으로 이동</Text>
        <Pressable onPress={() => navigation.navigate("MyPage")}>
          <FontAwesome6 name="user" size={30} color="#8C8677"></FontAwesome6>
        </Pressable>
      </View>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 10,
    marginTop: 10,
  },
});
