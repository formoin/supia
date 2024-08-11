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

const {height: windowHeight} = Dimensions.get('window');

const EditPageScreen = ({navigation}) => {
  const scrollRef = useRef(null);
  const [isPWModalVisible, setIsPWModalVisible] = useState(false);
  const [isImgModalVisible, setImgModalVisible] = useState(false);
  const [loginuser, setLoginuser] = useState({
    member_id: '',
    name: '확인용이에용',
    nickname: '저두 확인용이에용',
    profile_img: 'https://picsum.photos/200/300',
    level: '',
    exp: '',
    point: '',
  });

  const [name, setName] = useState(loginuser.name);
  const [nickname, setNickname] = useState(loginuser.nickname);
  const [newPassword, setNewPassword] = useState('');
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('key');
        if (token) {
          const response = await axios.get(`${Server_IP}/members/my-info/`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json; charset=utf-8',
            },
          });
          const {id, name, nickname, profileImg, level, exp, point} =
            response.data;
          setLoginuser({
            id,
            name,
            nickname,
            profileImg,
            level,
            exp,
            point,
          });
          setName(name);
          setNickname(nickname);
        }
      } catch (err) {
        console.error('Failed to fetch user info', err);
      }
    };

    fetchUserInfo();
  }, []);

  const selectImage = () => {
    launchImageLibrary({mediaType: 'photo', quality: 1}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.error('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const selectedImageUri = response.assets[0].uri;
        setLoginuser({...loginuser, profile_img: selectedImageUri});
      }
    });
  };

  const verifyCurrentPassword = () => {
    axios
      .post(`${Server_IP}/members/password`, {
        currentPassword: currentPasswordInput,
      })
      .then(response => {
        if (response.data.success) {
          setIsPasswordVerified(true);
          Alert.alert('확인 완료', '현재 비밀번호가 확인되었습니다.');
        } else {
          Alert.alert('오류', '현재 비밀번호가 맞지 않습니다.');
        }
      })
      .catch(error => {
        Alert.alert('오류', '비밀번호 확인에 실패했습니다.');
        console.error(error);
      });
  };

  const resetImage = () => {
    setLoginuser({...loginuser, profile_img: null});
  };

  const openImgModal = () => {
    setImgModalVisible(true);
  };

  const closeImgModal = () => {
    setImgModalVisible(false);
  };

  const ChangePassword = () => {
    axios
      .put(`${Server_IP}/members/change-password`, newPassword, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
      })
      .then(response => {
        Alert.alert('성공', '비밀번호가 업데이트되었습니다.');
      })
      .catch(error => {
        Alert.alert('오류', '비밀번호 업데이트에 실패했습니다.');
        console.error(error);
      });
  };

  const deleteUser = () => {
    axios
      .put(`${Server_IP}/members/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
      })
      .then(response => {
        Alert.alert('성공', '회원 탈퇴가 이루어졌습니다.');
        navigation.navigate('Login');
      })
      .catch(error => {
        Alert.alert('오류', '회원 탈퇴에 실패했습니다.');
        console.error(error);
      });
  };

  const updateUserInfo = () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('nickname', nickname);
    if (loginuser.profile_img) {
      formData.append('profileImg', {
        uri: loginuser.profile_img,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });
    }

    axios
      .put(`${Server_IP}/members/my-info`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        Alert.alert('성공', '사용자 정보가 업데이트되었습니다.');
      })
      .catch(error => {
        Alert.alert('오류', '사용자 정보 업데이트에 실패했습니다.');
        console.error(error);
      });
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
          source={{uri: loginuser.profile_img}}
          style={styles.profileImage}
          onError={() => console.log('이미지 로드 실패')}
        />
      </Pressable>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <FontAwesome6 name="user" size={30} color="#8C8677" />
          <TextInput
            style={styles.textInput}
            placeholder={loginuser.name}
            value={name}
            onChangeText={text => setName(text)}
          />
        </View>
        <Line />
        <View style={styles.infoRow}>
          <MaterialIcons name="tag-faces" size={32} color="#8C8677" />
          <TextInput
            style={styles.textInput}
            placeholder={loginuser.nickname}
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
          <Button_Red label="계정 탈퇴" onPress={deleteUser} />
        </View>
      </View>

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
});

export default EditPageScreen;
