import React, {useState} from 'react';
import {View, Pressable, TextInput, Text, StyleSheet} from 'react-native';
import useLoginStore from '../../store/useLoginStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Server_IP} from '@env';
import {createNotSupportedComponent} from 'react-native-maps/lib/decorateMapComponent';
import CustomAlert from '../../Atoms/CustomAlert';

const LoginScreen = ({navigation}) => {
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');

  const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const [emailError, setEmailError] = useState('');

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (field, value) => {
    setValues({...values, [field]: value});

    if (field === 'email') {
      if (!validateEmail(value)) {
        setEmailError('이메일 형식이 아닙니다.');
      } else {
        setEmailError('');
      }
    }
  };

  const onLoginSubmit = async () => {
    if (!validateEmail(values.email)) {
      setEmailError('유효한 이메일을 입력하세요');
      return;
    }

    const loginInfo = {
      email: values.email,
      password: values.password,
    };
    console.log(loginInfo);
    console.log(Server_IP);
    try {
      const response = await axios.post(
        `${Server_IP}/members/login`,
        loginInfo,
        {
          headers: {
            Accept: 'application/json',
          },
        },
      );

      if (response.status === 200) {
        const token = response.data.token;
        await AsyncStorage.setItem('key', token);
        // 로그인 처리 및 Home으로 이동
        useLoginStore.setState({isLoggedIn: true});
        navigation.navigate('Main');
      }
    } catch (error) {
      console.log('Error during login:', error.message);
      console.log('Error details:', error.response?.data);

      setAlertTitle('로그인 실패');
      // 자세한 오류 정보 출력

      if (error.response) {
        console.log('Response data:', error.response.data);
        console.log('Response status:', error.response.status);
        console.log('Response headers:', error.response.headers);
        setAlertMessage(
          `${error.response.data.message || '알 수 없는 오류입니다.'}`,
        );
        // alert(
        //   `로그인에 실패하였습니다: ${
        //     error.response.data.message || '알 수 없는 오류입니다.'
        //   }`,
        // );
      } else if (error.request) {
        console.log('Request data:', error.request);
        // alert('서버로부터 응답을 받지 못했습니다.');
        setAlertMessage('서버로부터 응답을 받지 못했습니다');
      } else {
        console.log('Error message:', error.message);
        // alert(`로그인 요청 중 오류가 발생했습니다: ${error.message}`);
        setAlertMessage('로그인 요청 중 오류가 발생했습니다.');
      }
      setIsAlertVisible(true);
      // 입력 필드 초기화
      setValues({email: '', password: ''});
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.loginContainer}
      extraScrollHeight={20}
      enableOnAndroid={true}
      keyboardOpeningTime={250}>
      <Text style={{padding: 50, fontSize: 22, color: '#321C1C'}}>로그인</Text>
      <View style={styles.formBox}>
        <Text style={styles.formText}>이메일</Text>
        <TextInput
          id="email"
          placeholder="이메일"
          style={styles.inputField}
          value={values.email}
          onChangeText={text => handleChange('email', text)}
          placeholderTextColor="#A9A9A9"
          color="black"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <Text style={styles.formText}>비밀번호</Text>
        <TextInput
          id="password"
          placeholder="비밀번호"
          secureTextEntry
          style={styles.inputField}
          value={values.password}
          onChangeText={text => handleChange('password', text)}
          placeholderTextColor="#A9A9A9"
          color="black"
        />

        <View style={{paddingTop: 10}}></View>
        <View style={styles.buttonGroup}>
          <Pressable onPress={onLoginSubmit} style={styles.button}>
            <Text>로그인</Text>
          </Pressable>
        </View>
      </View>

      <Pressable
        onPress={() => {
          navigation.navigate('Regist');
        }}
        style={{
          marginTop: 30,
        }}>
        <Text style={{color: '#B5B5B5'}}>아직 회원이 아니라면? 회원가입</Text>
      </Pressable>

      <CustomAlert
        visible={isAlertVisible}
        onClose={() => setIsAlertVisible(false)}
        title={alertTitle}
        message={alertMessage}
      />
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    alignItems: 'center',
    backgroundColor: '#ECEADE',
    flexGrow: 1,
    justifyContent: 'center',
  },
  formBox: {
    borderRadius: 8,
    padding: 16,
    backgroundColor: 'white',
    width: '80%',
  },
  formText: {
    padding: 6,
    color: 'grey'
  },
  inputField: {
    padding: 6,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
  buttonGroup: {
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#A2AA7B',
    borderRadius: 8,
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
