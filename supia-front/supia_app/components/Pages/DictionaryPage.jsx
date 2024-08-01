import { View, Text, StyleSheet, Image } from "react-native";
import Header from "../atoms/Header";
import DicDivide from '../DicDivide'
import Card from '../atoms/Card'

export default function DictionaryScreen() {
  return (
    <View style={styles.container}>
      <Header label="나의 도감" />
      <View style={styles.p_value}>
        <DicDivide text1="식물" text2="동물" text3="곤충" text4="기타" style={styles.searchbar}/>
      </View>

      <View style={styles.Cardcontainer}>
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  p_value: {
    padding: 20,
    alignItems: 'center',
    paddingTop: 30
  },
  Cardcontainer:{
    flexDirection: 'row',         // 기본 방향을 수평으로 설정
    flexWrap: 'wrap',             // 자식들이 줄을 넘어가도록 설정
    justifyContent: 'flex-start', // 카드들 사이에 동일한 간격 유지
    padding: 10,
  }
})