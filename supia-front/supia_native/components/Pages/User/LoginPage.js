import React, {useState} from 'react';
import {View, Pressable, TextInput, Text, StyleSheet} from 'react-native';
import useLoginStore from '../../store/useLoginStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// 환경 변수로 ContextPath 설정
// import ContextPath from '@env'

// const members = [
//   {
//     id: 1,
//     email: 'alice@example.com',
//     name: 'Alice Johnson',
//     nickname: 'alice_j',
//     profile_img: 'http://example.com/images/alice_johnson.jpg',
//     level: 4,
//     exp: 950,
//     point: 420,
//     password: 'hashed_password_alice',
//     token: 'token_alice_123',
//   },
//   {
//     id: 2,
//     email: 'bob@example.com',
//     name: 'Bob Brown',
//     nickname: 'bobb',
//     profile_img: 'http://example.com/images/bob_brown.jpg',
//     level: 2,
//     exp: 320,
//     point: 150,
//     password: 'hashed_password_bob',
//     token: 'token_bob_456',
//   },
//   {
//     id: 3,
//     email: 'carol@example.com',
//     name: 'Carol White',
//     nickname: 'carol_w',
//     profile_img: 'http://example.com/images/carol_white.jpg',
//     level: 6,
//     exp: 1800,
//     point: 600,
//     password: 'hashed_password_carol',
//     token: 'token_carol_789',
//   },
//   {
//     id: 4,
//     email: 'dave@example.com',
//     name: 'Dave Black',
//     nickname: 'daveb',
//     profile_img: 'http://example.com/images/dave_black.jpg',
//     level: 1,
//     exp: 150,
//     point: 50,
//     password: 'hashed_password_dave',
//     token: 'token_dave_321',
//   },
//   {
//     id: 5,
//     email: 'eve@example.com',
//     name: 'Eve Davis',
//     nickname: 'eve_d',
//     profile_img: 'http://example.com/images/eve_davis.jpg',
//     level: 3,
//     exp: 700,
//     point: 300,
//     password: 'hashed_password_eve',
//     token: 'token_eve_654',
//   },
//   // 다른 회원 데이터 추가...
// ];


const LoginScreen = ({navigation}) => {
  // 로그인 정보
  const [values, setValues] = useState({
    email: '',
    password: '',
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
    setValues({...values, [field]: value});
  };


  // // login logic 로그인 테스트
  // const onLoginSubmit = async () => {
  //   const {email, password} = values;

  //   // JSON 데이터로 로그인 시뮬레이션
  //   const member = members.find(
  //     m => m.email === email && m.password === password,
  //   );

  //   if (member) {
  //     const token = member.token;
  //     await AsyncStorage.setItem('key', token);
  //     alert('로그인 되었습니다.');
  //     useLoginStore.setState({isLoggedIn: true});
  //     navigation.navigate('Main');
  //   } else {
  //     alert('로그인에 실패하였습니다.');
  //     setValues({email: '', password: ''});
  //   }
  // };


  // login logic
  const onLoginSubmit = async () => {
    const loginMember = new FormData();
    loginMember.append('email', values.email);
    loginMember.append('password', values.password);

    let response;

    try {
      // 로그인 post 요청
      response = await axios.post(
        'http://localhost:8080/members/login',
        loginMember,
      );
      if (response.status == 200) {
        let token = response.headers['authorization'].split(' ')[1];
        await AsyncStorage.setItem('key', token);
        const getToken = await AsyncStorage.getItem('key');
        alert('로그인 되었습니다.');
        // 로그인 처리 및 Home으로 이동
        useLoginStore.setState({isLoggedIn: true});
        navigation.navigate('HomeScreen');
      }
    } catch (error) {
      console.log(error);
      alert('로그인에 실패하였습니다.');
      setValues(['', '']);
      return;
    }

  };

  // 소셜 로그인 logic -> 확인 필요!!

  return (
    <View style={styles.loginContainer}>
      <Text style={{padding: 50, fontSize: 22, color: '#321C1C'}}>로그인</Text>
      <View style={styles.formBox}>
        <Text style={styles.formText}>이메일</Text>
        <TextInput
          id="email"
          placeholder="이메일"
          style={styles.inputField}
          value={values.email}
          onChangeText={text => handleChange('email', text)}
        />

        <Text style={styles.formText}>비밀번호</Text>
        <TextInput
          id="password"
          placeholder="비밀번호"
          secureTextEntry
          style={styles.inputField}
          value={values.password}
          onChangeText={text => handleChange('password', text)}
        />
        <View style={{paddingTop: 10}}></View>
        <View style={styles.buttonGroup}>
          <Pressable
            mode="contained"
            onPress={() => {
              //console.log(values.email + " " + values.password);
              onLoginSubmit();
            }}
            style={styles.button}>
            <Text>로그인</Text>
          </Pressable>
        </View>
        <Pressable
          onPress={() => alert('나중에 구현할게!')}
          style={styles.textLink}>
          <Text style={{textDecorationLine: 'underline'}}>
            비밀번호를 잊으셨나요?
          </Text>
        </Pressable>
      </View>
      <Pressable
        mode="contained"
        onPress={() => {
          {
            // onSocialLoginSubmit(google);
          }
        }}
        style={[
          styles.button,
          {width: '80%', marginTop: 30, backgroundColor: '#fff'},
        ]}>
        <Text>Google로 로그인하기</Text>
      </Pressable>

      <Pressable
        mode="contained"
        onPress={() => {
          // onSocialLoginSubmit(kakao);

        }}
        style={[
          styles.button,
          {width: '80%', marginTop: 30, backgroundColor: '#FFEB02'},
        ]}>
        <Text>카카오로 로그인하기</Text>
      </Pressable>

      <Pressable
        mode="contained"
        onPress={() => {
          // onSocialLoginSubmit(naver);
        }}
        style={[
          styles.button,
          {width: '80%', marginTop: 30, backgroundColor: '#27D34A'},
        ]}>
        <Text>네이버로 로그인하기</Text>
      </Pressable>

      <Pressable
        onPress={() => {
          navigation.navigate('Regist');
        }}
        style={{
          marginTop: 30,
        }}>
        <Text
          style={{
            color: '#B5B5B5',
          }}>
          아직 회원이 아니라면? 회원가입
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    alignItems: 'center',
    backgroundColor: '#ECEADE',
    height: '100%',
  },
  formBox: {
    borderRadius: 8,
    padding: 16,
    backgroundColor: 'white',
    width: '80%',
  },
  formText: {
    padding: 6,
  },
  inputField: {
    padding: 6,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
  buttonGroup: {
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#A2AA7B',
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'center',
    padding: 10,
    width: '100%',
    position: 'relative',
  },
  textLink: {
    marginTop: 16,
  },
});

export default LoginScreen;
