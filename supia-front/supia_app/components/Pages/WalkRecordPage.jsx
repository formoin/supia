import { View, Text, StyleSheet } from "react-native";
import Header from '../atoms/Header';
import Line from '../atoms/Line';

export default function StoreScreen() {
  return (
    <View style={styles.container}>
      <Header label="산책 기록 확인" />
      <View style={styles.middleContainer}>
        <Line />
        <View style={styles.textContainer}>
          <Text style={styles.text}>Start   00:00</Text>
          <Text style={styles.text}>End   00:00</Text>
        </View>
        <Text>코스 지도</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  middleContainer: {
    flex: 1,
    marginTop: 40,
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
    marginBottom: 40
  },
  text: {
    fontSize: 20,
  },
});
