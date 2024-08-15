import React, {useState} from 'react';
import {
  View,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Text,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import {Server_IP} from '@env';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default function SignUpScreen({navigation}) {
  const [values, setValues] = useState({
    email: '',
    name: '',
    nickname: '',
    password: '',
    passwordConfirm: '',
  });
  const [emailError, setEmailError] = useState('');

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = async (field, value) => {
    setValues({...values, [field]: value});

    if (field === 'email') {
      if (!validateEmail(value)) {
        setEmailError('이메일 형식이 아닙니다.');
      } else {
        setEmailError('');
      }
    }
  };

  // 회원가입 로직
  const onSignUpSubmit = async () => {
    if (!validateEmail(values.email)) {
      setEmailError('유효한 이메일을 입력하세요');
      return;
    }

    const member = {
      email: values.email,
      password: values.password,
      name: values.name,
      nickname: values.nickname,
    };

    if (values.password === values.passwordConfirm) {
      try {
        const response = await axios.post(
          `${Server_IP}/members/register`,
          member,
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json; charset=utf-8',
            },
          },
        );
        console.log(response.data);
        navigation.navigate('Login');
      } catch (error) {
        console.log('Error during registration:', error.message);
        console.log('Error details:', error.response?.data);
        alert('회원가입에 실패하였습니다.');
      }
    } else {
      alert('비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.loginContainer}
      extraScrollHeight={20}
      enableOnAndroid={true}
      keyboardOpeningTime={250}>
      <Text style={{padding: 50, fontSize: 22, color: '#321C1C'}}>
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
          onChangeText={text => handleChange('name', text)}
          placeholderTextColor="#A9A9A9"
          color="black"
        />

        <Text style={styles.formText}>닉네임</Text>
        <TextInput
          label="닉네임"
          placeholder="닉네임"
          style={styles.inputField}
          id="nickname"
          value={values.nickname}
          onChangeText={text => handleChange('nickname', text)}
          placeholderTextColor="#A9A9A9"
          color="black"
        />

        <Text style={styles.formText}>이메일</Text>
        <TextInput
          label="이메일"
          placeholder="이메일"
          style={styles.inputField}
          id="email"
          value={values.email}
          onChangeText={text => handleChange('email', text)}
          placeholderTextColor="#A9A9A9"
          color="black"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <Text style={styles.formText}>비밀번호</Text>
        <TextInput
          label="비밀번호"
          placeholder="비밀번호"
          secureTextEntry
          style={styles.inputField}
          id="password"
          value={values.password}
          onChangeText={text => handleChange('password', text)}
          placeholderTextColor="#A9A9A9"
          color="black"
        />

        <Text style={styles.formText}>비밀번호 확인</Text>
        <TextInput
          label="비밀번호 확인"
          placeholder="비밀번호 확인"
          secureTextEntry
          style={styles.inputField}
          id="passwordConfirm"
          value={values.passwordConfirm}
          onChangeText={text => handleChange('passwordConfirm', text)}
          placeholderTextColor="#A9A9A9"
          color="black"
        />

        <Text style={styles.message}>
          {values.password === values.passwordConfirm
            ? ''
            : '비밀번호가 일치하지 않습니다.'}
        </Text>

        <View style={{paddingTop: 10}}></View>
        <View style={styles.buttonGroup}>
          <Pressable
            mode="contained"
            onPress={() => onSignUpSubmit()}
            style={styles.button}>
            <Text>회원가입</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => {
            navigation.navigate('Login');
          }}
          style={{textDecorationLine: 'underline'}}>
          <Text
            style={{
              marginHorizontal: 'auto',
              marginTop: 20,
              color: '#B5B5B5',
            }}>
            돌아가기
          </Text>
        </Pressable>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECEADE',
    flex: 1,
    flexGrow: 1,
  },
  formBox: {
    borderRadius: 8,
    padding: 16,
    backgroundColor: 'white',
    width: '80%',
  },
  formText: {
    padding: 6,
    color: 'grey',
  },
  inputField: {
    padding: 6,
    marginBottom: 4,
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
    textAlign: 'center',
    color: 'black',
  },
  message: {
    color: 'red',
    fontSize: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
});
