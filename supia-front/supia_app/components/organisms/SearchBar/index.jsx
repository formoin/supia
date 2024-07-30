import { View, StyleSheet, Pressable, TextInput, Text } from "react-native";
import { useState } from "react";
import { AntDesign } from "@expo/vector-icons";

export default function Searchbar({active, searchName}) {
  const [value, setValue] = useState("");

  // X 버튼 클릭 시 초기화
  const onReset = () => {
    setValue("");
  };

  // TextInput 내 text 변경 시 value 변경
  const onChangeT = (text) => {
    setValue(text);
  };

  // 엔터 키를 눌렀을 때 동작 추가
  const onSubmitEditing = () => {
    // 엔터 키를 눌렀을 때 실행할 코드
    console.log("Submit pressed");
  };

  return (
    <View style={styles.container}>
      {active ? (
        <>
          <AntDesign name="search1" size={20} color="#A2AA7B" />
          <TextInput
            value={value}
            onChangeText={onChangeT}
            onSubmitEditing={onSubmitEditing} // 엔터 키 처리
            style={styles.input}
            placeholder="Search..."
          />
          <Pressable onPress={onReset}>
            <AntDesign name="close" size={20} color="#A2AA7B" />
          </Pressable>
        </>
      ) : (
        <Text style={styles.input}>{searchName}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "95%",
    height: 44,
    backgroundColor: "#F4F4F4",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15,
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    fontSize: 14,
    marginLeft: 10,
  },
});