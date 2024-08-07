import React, {useState} from 'react';
import {View, Pressable, TextInput, Text, StyleSheet} from 'react-native';
import useLoginStore from '../../store/useLoginStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_Server_IP;
console.log(API_BASE_URL);

const LoginScreen = ({navigation}) => {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  // input값 변경
  const handleChange = (field, value) => {
    setValues({...values, [field]: value});
  };

  // login logic
  const onLoginSubmit = async () => {
    const loginMember = {
      email: values.email,
      password: values.password,
    };

    try {
      // 로그인 post 요청
      const response = await axios.post(
        `${API_BASE_URL}/member/login`,
        loginMember,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
          },
        },
      );

      if (response.status === 200) {
        const token = response.data.token; // 응답 본문에서 토큰 추출
        await AsyncStorage.setItem('key', token);
        alert('로그인 되었습니다.');
        // 로그인 처리 및 Home으로 이동
        useLoginStore.setState({isLoggedIn: true});
        navigation.navigate('Call', {userId: 1, targetUserId: 2});
      }
    } catch (error) {
      console.log('Error during login:', error.message);
      console.log('Error details:', error.response?.data);

      // 자세한 오류 정보 출력
      if (error.response) {
        console.log('Response data:', error.response.data);
        console.log('Response status:', error.response.status);
        console.log('Response headers:', error.response.headers);
        alert(
          `로그인에 실패하였습니다: ${
            error.response.data.message || '알 수 없는 오류입니다.'
          }`,
        );
      } else if (error.request) {
        console.log('Request data:', error.request);
        alert('서버로부터 응답을 받지 못했습니다.');
      } else {
        console.log('Error message:', error.message);
        alert(`로그인 요청 중 오류가 발생했습니다: ${error.message}`);
      }

      // 입력 필드 초기화
      setValues({email: '', password: ''});
    }
  };

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
          <Pressable onPress={onLoginSubmit} style={styles.button}>
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
          // onSocialLoginSubmit(google);
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
        <Text style={{color: '#B5B5B5'}}>아직 회원이 아니라면? 회원가입</Text>
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
