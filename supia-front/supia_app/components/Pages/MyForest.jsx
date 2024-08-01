import { View, Text, Pressable, Image, StyleSheet } from "react-native";

export default function StoreScreen() {
  return (
    <View style={styles.container}>
      <Pressable style={styles.pressable}>
        <Image
          source={require('../assets/basic/forest.jpg')} // 이미지 경로
          style={styles.image}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressable: {
    // 스타일을 추가하거나 수정할 수 있습니다.
  },
  image: {
    width: 200,  // 이미지의 너비를 설정
    height: 200, // 이미지의 높이를 설정
  },
});
