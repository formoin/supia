import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import useStore from '../../store/useStore';
import {launchImageLibrary} from 'react-native-image-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import Line from '../../Atoms/Line';
import Button_Green from '../../Atoms/Button_Green';
import Button_Red from '../../Atoms/Button_Red';
import Header from '../../Atoms/Header';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {Server_IP} from '@env';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useLoginStore from '../../store/useLoginStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
const {height: windowHeight} = Dimensions.get('window');

const EditPageScreen = ({navigation}) => {
  const [isPWModalVisible, setIsPWModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  // const {token} = useLoginStore.getState();
  const [isImgModalVisible, setImgModalVisible] = useState(false);
  const [memberInfo, setMemberInfo] = useState(null);
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const {getS3Url} = useStore();
  const [loginuser, setLoginuser] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('key');
        if (token) {
          const response = await axios.get(`${Server_IP}/members/my-info`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json; charset=utf-8',
            },
          });
          if (response.status === 200) {
            console.log(response.data.member);
            setMemberInfo(response.data.member);
          } else {
            console.log('홈페이지 로딩 실패');
          }
        }
      } catch (err) {
        console.error('Failed to fetch user info', err);
      }
    };
    fetchUserInfo();
  }, []);

  // 로그아웃
  const logoutUser = async () => {
    try {
      // AsyncStorage에서 저장된 로그인 정보 삭제
      await AsyncStorage.removeItem('key');
      alert('로그아웃 되었습니다.');
      navigation.navigate('Login');
    } catch (error) {
      console.error('로그아웃 중 에러 발생: ', error);
    }
  };

  const selectImage = () => {
    launchImageLibrary({mediaType: 'photo', quality: 1}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.error('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const selectedImageUri = response.assets[0].uri;
        setMemberInfo({...memberInfo, profileImg: selectedImageUri});
      }
    });
  };

  const verifyCurrentPassword = async () => {
    const token = await AsyncStorage.getItem('key');
    try {
      const formData = new FormData();
      formData.append('password', currentPasswordInput); // 비밀번호 추가

      const response = await axios.post(
        `${Server_IP}/members/verify-password`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data', // 수동 설정 유지
          },
        },
      );

      console.log(response.data); // 응답 데이터 확인

      if (response.status === 200) {
        setIsPasswordVerified(true);
        Alert.alert('확인 완료', '현재 비밀번호가 확인되었습니다.');
      } else {
        Alert.alert('오류', '현재 비밀번호가 맞지 않습니다.');
      }
    } catch (error) {
      if (error.response) {
        console.error('Error Response:', error.response.data);
        Alert.alert('오류', `서버 응답 오류: ${error.response.status}`);
      } else if (error.request) {
        console.error('Error Request:', error.request);
        Alert.alert('오류', '서버로부터 응답이 없습니다.');
      } else {
        console.error('Error:', error.message);
        Alert.alert('오류', '비밀번호 확인 중 알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  if (!memberInfo) {
    return (
      <View style={styles.container}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  const getImageUri = thumbnail => {
    console.log(memberInfo.profileImg);
    if (thumbnail.startsWith('file://')) {
      return {uri: thumbnail}; // file 경로일 때
    } else {
      return {uri: getS3Url(thumbnail)}; // S3 경로일 때
    }
  };
  const resetImage = () => {
    setMemberInfo({
      ...memberInfo,
      profileImg: 's3://supia/profile/default.png',
    });
  };
  const openImgModal = () => {
    setImgModalVisible(true);
  };
  const closeImgModal = () => {
    setImgModalVisible(false);
  };

  const ChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      return Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
    }

    const token = await AsyncStorage.getItem('key');
    if (!token) {
      return Alert.alert('오류', '인증 토큰이 없습니다. 다시 로그인하세요.');
    }

    try {
      // FormData 객체 생성 및 필드 추가
      const formData = new FormData();
      formData.append('newPassword', newPassword); // 서버에서 기대하는 필드 이름 사용

      const response = await axios.put(
        `${Server_IP}/members/change-password`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data', // FormData 전송을 위한 Content-Type
          },
        },
      );

      if (response.status === 200) {
        Alert.alert('성공', '비밀번호가 업데이트되었습니다.');
        await AsyncStorage.removeItem('key');
        navigation.navigate('Login');
      } else if (response.status === 403) {
        Alert.alert('오류', '이 작업을 수행할 권한이 없습니다.');
      } else {
        Alert.alert('오류', '비밀번호 업데이트에 실패했습니다.');
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        Alert.alert('오류', '이 작업을 수행할 권한이 없습니다.');
      } else {
        Alert.alert('오류', '비밀번호 업데이트 중 오류가 발생했습니다.');
        console.error('Error:', error);
      }
    }
  };

  const deleteUser = async () => {
    console.log(Server_IP);
    try {
      const token = await AsyncStorage.getItem('key');
      if (token) {
        const response = await axios.post(
          `${Server_IP}/members/delete`,
          {}, // 이 부분이 요청의 본문입니다. 삭제 요청이므로 빈 객체로 설정해두었습니다.
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          },
        );
        if (response.status === 200) {
          Alert.alert('회원 탈퇴가 완료되었습니다.');
          await AsyncStorage.removeItem('key');
          navigation.navigate('Login');
        } else {
          console.log('홈페이지 로딩 실패');
        }
      }
    } catch (err) {
      console.error('Failed to fetch user info', err);
    }
  };

  const updateUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('key');
      if (!token) {
        Alert.alert('오류', '인증 토큰이 없습니다. 다시 로그인하세요.');
        return;
      }
      // console.log('Token: ', token);

      const formData = new FormData();
      formData.append('name', name || memberInfo.name);
      formData.append('nickname', nickname || memberInfo.nickname);
      if (memberInfo.profileImg) {
        formData.append('profileImg', {
          uri: loginuser?.profileImg
            ? loginuser.profileImg
            : memberInfo.profileImg,
          type: 'image/jpeg',
          name: 'profile.jpg',
        });
      }

      const response = await axios.put(
        `${Server_IP}/members/my-info`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data', // FormData 전송을 위한 Content-Type 설정
          },
        },
      );

      if (response.status === 200) {
        Alert.alert('성공', '사용자 정보가 업데이트되었습니다.');
        await AsyncStorage.removeItem('key');
        navigation.navigate('Login');
      } else {
        console.log('Response: ', response);
        Alert.alert('오류', '사용자 정보 업데이트에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error: ', error.response || error.message);
      if (error.response && error.response.status === 403) {
        Alert.alert('오류', '권한이 없습니다. 다시 로그인해주세요.');
      } else if (error.response && error.response.status === 401) {
        Alert.alert('오류', '인증에 실패했습니다. 다시 로그인하세요.');
      } else {
        console.log(error);
        Alert.alert('오류', '사용자 정보 업데이트에 실패했습니다.');
      }
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      extraScrollHeight={20}
      enableOnAndroid={true}
      keyboardOpeningTime={250}>
      <Header label="정보 수정" goto={'MyPage'} />
      <Pressable onPress={openImgModal} style={{padding: 30}}>
        <Image
          source={getImageUri(
            loginuser?.profileImg
              ? loginuser.profileImg
              : memberInfo.profileImg,
          )}
          style={styles.profileImage}
          onError={() => console.log('이미지 로드 실패')}
        />
      </Pressable>
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <FontAwesome6 name="user" size={30} color="#8C8677" />
          <TextInput
            style={styles.textInput}
            placeholder={memberInfo.name}
            value={name}
            onChangeText={text => setName(text)}
          />
        </View>
        <Line />
        <View style={styles.infoRow}>
          <MaterialIcons name="tag-faces" size={32} color="#8C8677" />
          <TextInput
            style={styles.textInput}
            placeholder={memberInfo.nickname}
            value={nickname}
            onChangeText={text => setNickname(text)}
          />
        </View>
        <Line />
        <View style={styles.pwRow}>
          <MaterialIcons name="lock" size={32} color="#8C8677" />
          <Button_Green
            label="확인"
            onPress={() => setIsPWModalVisible(true)}
          />
        </View>
        <View style={styles.Buttons}>
          <Button_Green label="정보 수정" onPress={updateUserInfo} />
          <TouchableOpacity style={styles.logoutButton} onPress={logoutUser}>
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>
          <Button_Red
            label="계정 탈퇴"
            onPress={() => setDeleteModalVisible(true)}
          />
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{fontSize: 20, padding: 10}}>
              정말 삭제하시겠어요?
            </Text>
            <Text>삭제 후에는 되돌릴 수 없습니다!</Text>
            <View style={styles.Buttons}>
              <Button_Red label="확인" onPress={() => deleteUser()} />
              <Button_Green
                label="취소"
                onPress={() => setDeleteModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isPWModalVisible}
        transparent={true}
        animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {!isPasswordVerified ? (
              <TextInput
                placeholder="현재 비밀번호"
                value={currentPasswordInput}
                secureTextEntry={true}
                onChangeText={text => setCurrentPasswordInput(text)}
              />
            ) : (
              <View>
                <TextInput
                  placeholder="새 비밀번호"
                  value={newPassword}
                  secureTextEntry={true}
                  onChangeText={text => setNewPassword(text)}
                />
                <TextInput
                  placeholder="비밀번호 확인"
                  value={confirmPassword}
                  onChangeText={text => setConfirmPassword(text)}
                  secureTextEntry={true}
                />
              </View>
            )}
            <View style={styles.Buttons}>
              {!isPasswordVerified ? (
                <Button_Green
                  label="입력"
                  onPress={verifyCurrentPassword}
                  disabled={newPassword !== confirmPassword}
                />
              ) : (
                <Button_Green label="입력" onPress={ChangePassword} />
              )}
              <Button_Red
                label="취소"
                onPress={() => setIsPWModalVisible(false)}
                color="red"
              />
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isImgModalVisible}
        onRequestClose={closeImgModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => {
                selectImage();
                closeImgModal();
              }}>
              <Text style={styles.modalText}>앨범에서 찾기</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity
              onPress={() => {
                resetImage();
                closeImgModal();
              }}>
              <Text style={styles.modalText}>기본 이미지</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity onPress={closeImgModal}>
              <Text style={styles.modalText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAwareScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#ECEADE',
  },
  profileImage: {
    width: windowHeight * 0.3,
    height: windowHeight * 0.3,
    borderRadius: (windowHeight * 0.3) / 2,
  },
  infoSection: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    width: '100%',
    padding: 15,
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
    paddingLeft: 50,
    height: '25%',
  },
  textInput: {
    flex: 1,
    marginRight: 50,
    textAlign: 'right',
  },
  Buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 20,
    width: '100%',
  },
  pwRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
    paddingLeft: 50,
    height: '25%',
    paddingRight: 25,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginVertical: 10,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: 'gray',
    marginVertical: 10,
  },
  logoutButton: {
    width: 72,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 5,
    backgroundColor: 'lightgray',
    paddingBottom: 3,
  },
  logoutText: {
    color: 'white',
  },
});
export default EditPageScreen;
