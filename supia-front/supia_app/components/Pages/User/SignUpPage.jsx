import React, { useState } from "react";
import { View, Pressable, TextInput, Text, StyleSheet } from "react-native";
import { Link } from "@react-navigation/native";
import axios from "axios";

export default function SignUpScreen({ navigation }) {
  const [values, setValues] = useState({
    email: "",
    name: "",
    nickname: "",
    password: "",
    passwordConfirm: "",
  });

  // 비밀번호 + 비밀번호 일치 여부 검증
  // 나중에 여유가 되면 이메일 형식 + 비밀번호 형식 추가로 설정하기!
  const handleChange = async (field, value) => {
    setValues({ ...values, [field]: value });
  };

  // 회원가입 로직
  const onSignUpSubmit = async () => {
    const member = new FormData();
    member.append("email", values.email);
    member.append("password", values.password);
    member.append("name", values.name);
    member.append("nickname", values.nickname);

    if (values.password == values.passwordConfirm) {
      try {
        response = await axios.post(
          "http://localhost:8080/members/register",
          member
        );
      } catch (error) {
        console.log(error);
        alert("회원가입에 실패하였습니다.");
        setValues(["", "", "", "", ""]);
        return;
      }
    } else {
      // 비밀번호가 틀리면 그냥 onPress 함수를 리턴
      return;
    }
  };

  return (
    <View style={styles.loginContainer}>
      <Text style={{ padding: 50, fontSize: 22, color: "#321C1C" }}>
        회원가입
      </Text>

      <View style={styles.formBox}>
        <Text style={styles.formText}>이름</Text>
        <TextInput
          id="name"
          label="이름"
          placeholder="이름"
          style={styles.inputField}
          value={values.name}
          onChangeText={(text) => handleChange("name", text)}
        />

        <Text style={styles.formText}>닉네임</Text>
        <TextInput
          label="닉네임"
          placeholder="닉네임"
          style={styles.inputField}
          id="nickname"
          value={values.nickname}
          onChangeText={(text) => handleChange("nickname", text)}
        />

        <Text style={styles.formText}>이메일</Text>
        <TextInput
          label="이메일"
          placeholder="이메일"
          style={styles.inputField}
          id="email"
          value={values.email}
          onChangeText={(text) => handleChange("email", text)}
        />

        <Text style={styles.formText}>비밀번호</Text>
        <TextInput
          label="비밀번호"
          placeholder="비밀번호"
          secureTextEntry
          style={styles.inputField}
          id="password"
          value={values.password}
          onChangeText={(text) => handleChange("password", text)}
        />

        <Text style={styles.formText}>비밀번호 확인</Text>
        <TextInput
          label="비밀번호 확인"
          placeholder="비밀번호 확인"
          secureTextEntry
          style={styles.inputField}
          id="passwordConfirm"
          value={values.passwordConfirm}
          onChangeText={(text) => handleChange("passwordConfirm", text)}
        />

        <Text style={styles.message}>
          {values.password == values.passwordConfirm
            ? ""
            : "비밀번호가 일치하지 않습니다."}
        </Text>

        <View style={{ paddingTop: 10 }}></View>
        <View style={styles.buttonGroup}>
          <Pressable
            mode="contained"
            onPress={() => onSignUpSubmit()}
            style={styles.button}
          >
            <Text>회원가입</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => {
            navigation.navigate("Login");
          }}
          style={{ textDecorationLine: "underline" }}
        >
          <Text
            style={{
              marginHorizontal: "auto",
              marginTop: 20,
              color: "#B5B5B5",
            }}
          >
            돌아가기
          </Text>
        </Pressable>
      </View>

      <View style={styles.SNSSignUp}>
        <Pressable
          mode="contained"
          onPress={() => {}}
          style={[
            styles.button,
            {
              width: 70,
              height: 70,
              borderRadius: 35,
              marginTop: 30,
              backgroundColor: "#fff",
            },
          ]}
        >
          <Text>G</Text>
        </Pressable>

        <Pressable
          mode="contained"
          onPress={() => {}}
          style={[
            styles.button,
            {
              width: 70,
              marginTop: 30,
              height: 70,
              borderRadius: 35,
              backgroundColor: "#FFEB02",
            },
          ]}
        >
          <Text>K</Text>
        </Pressable>

        <Pressable
          mode="contained"
          onPress={() => {}}
          style={[
            styles.button,
            {
              width: 70,
              marginTop: 30,
              height: 70,
              borderRadius: 35,
              backgroundColor: "#27D34A",
            },
          ]}
        >
          <Text>N</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    alignItems: "center",
    backgroundColor: "#ECEADE",
    height: "100%",
  },
  formBox: {
    borderRadius: 8,
    padding: 16,
    backgroundColor: "white",
    height: "contain",
    width: "80%",
  },
  formText: {
    padding: 6,
  },
  inputField: {
    padding: 6,
    marginBottom: 4,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D9D9D9",
  },
  SNSSignUp: {
    //????
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    alignitems: "center",
    gap: 25,
  },
  buttonGroup: {
    alignItems: "center",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#A2AA7B",
    borderRadius: 8,
    display: "flex",
    justifyContent: "center",
    padding: 10,
    width: "100%",
    position: "relative",
  },
  textLink: {
    marginTop: 16,
    textAlign: "center",
    color: "black",
  },
  message: {
    color: "red",
    fontSize: 8,
  },
});
