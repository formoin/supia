import { useState } from "react";
import { View, Pressable, TextInput, Text, StyleSheet } from "react-native";
import { Link } from "@react-navigation/native";
import useLoginStore from "../../store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const EditProfileScreen = ({ navigation }) => {
  // 로그인 정보
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  // 여기 둘 건 아닌데 나중에 로그아웃할 때 사용!!
  // const handleLogoutUser = () => {
  //   useLoginStore.setState({
  //  isLoggedIn: false,
  //  });
  //   AsyncStorage.removeItem("key");
  //   alert("로그아웃 되었습니다.");
  // };

  // input값 변경
  const handleChange = async (field, value) => {
    setValues({ ...values, [field]: value });
  };

  // login logic
  const onLoginSubmit = async () => {
    const loginMember = new FormData();
    loginMember.append("email", values.email);
    loginMember.append("password", values.password);

    let response;

    try {
      // 로그인 post 요청
      response = await axios.post(
        "http://localhost:8080/members/login",
        loginMember
      );
      if (response.status == 200) {
        let token = response.headers["authorization"].split(" ")[1];
        await AsyncStorage.setItem("key", token);
        const getToken = await AsyncStorage.getItem("key");
        alert("로그인 되었습니다.");
        // 로그인 처리 및 Home으로 이동
        useLoginStore.setState({ isLoggedIn: true });
        navigation.navigate("HomeScreen");
      }
    } catch (error) {
      console.log(error);
      alert("로그인에 실패하였습니다.");
      setValues(["", ""]);
      return;
    }

    // await를 try구문 안에서도 써도 되나...

    // let token = response.headers["authorization"].split(" ")[1];

    // try {
    //   await AsyncStorage.setItem("key", token);
    //   const getToken = await AsyncStorage.getItem("key");
    //   alert("로그인 되었습니다.");
    //   useLoginStore.setState({
    //     isLoggedIn: true,
    //   });
    //   navigation.navigate("HomeScreen");
    // } catch (error) {
    //   console.error("Error storing the token", error); // 토큰 저장 시 오류 발생 시 콘솔에 오류 출력
    // }
  };

  // 소셜 로그인 logic -> 확인 필요!!

  return (
    <View style={styles.loginContainer}>
      <Text style={{ padding: 50, fontSize: 22, color: "#321C1C" }}>
        로그인
      </Text>
      <View style={styles.formBox}>
        <Text style={styles.formText}>이메일</Text>
        <TextInput
          id="email"
          placeholder="이메일"
          style={styles.inputField}
          value={values.email}
          onChangeText={(text) => handleChange("email", text)}
        />

        <Text style={styles.formText}>비밀번호</Text>
        <TextInput
          id="password"
          placeholder="비밀번호"
          secureTextEntry
          style={styles.inputField}
          value={values.password}
          onChangeText={(text) => handleChange("password", text)}
        />
        <View style={{ paddingTop: 10 }}></View>
        <View style={styles.buttonGroup}>
          <Pressable
            mode="contained"
            onPress={() => {
              //console.log(values.email + " " + values.password);
              onLoginSubmit();
            }}
            style={styles.button}
          >
            <Text>로그인</Text>
          </Pressable>
        </View>
        <Pressable
          onPress={() => alert("나중에 구현할게!")}
          style={styles.textLink}
        >
          <Text style={{ textDecorationLine: "underline" }}>
            비밀번호를 잊으셨나요?
          </Text>
        </Pressable>
      </View>
      <Pressable
        mode="contained"
        onPress={() => {
          {
            onSocialLoginSubmit(google);
          }
        }}
        style={[
          styles.button,
          { width: "80%", marginTop: 30, backgroundColor: "#fff" },
        ]}
      >
        <Text>Google로 로그인하기</Text>
      </Pressable>

      <Pressable
        mode="contained"
        onPress={() => {
          onSocialLoginSubmit(kakao);
        }}
        style={[
          styles.button,
          { width: "80%", marginTop: 30, backgroundColor: "#FFEB02" },
        ]}
      >
        <Text>카카오로 로그인하기</Text>
      </Pressable>

      <Pressable
        mode="contained"
        onPress={() => {
          onSocialLoginSubmit(naver);
        }}
        style={[
          styles.button,
          { width: "80%", marginTop: 30, backgroundColor: "#27D34A" },
        ]}
      >
        <Text>네이버로 로그인하기</Text>
      </Pressable>

      <Pressable
        onPress={() => {
          navigation.navigate("Regist");
        }}
        style={{
          marginTop: 30,
        }}
      >
        <Text
          style={{
            color: "#B5B5B5",
          }}
        >
          아직 회원이 아니라면? 회원가입
        </Text>
      </Pressable>
    </View>
  );
};

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
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D9D9D9",
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
  },
});

export default EditProfileScreen;
