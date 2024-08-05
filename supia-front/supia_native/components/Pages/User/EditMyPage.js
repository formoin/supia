
import React, {useEffect, useState} from 'react';
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
  Button,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import Line from '../../Atoms/Line';
import Button_Green from '../../Atoms/Button_Green';
import Button_Red from '../../Atoms/Button_Red';
import Header from '../../Atoms/Header';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {height: windowHeight} = Dimensions.get('window');

const EditPageScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loginuser, setLoginuser] = useState({
    member_id: '',
    name: '이름',
    nickname: '닉네임',
    profile_img: 'https://picsum.photos/100/100',
    level: '130',
    exp: '410',
    point: 'point',
  });

  const [name, setName] = useState(loginuser.name);
  const [nickname, setNickname] = useState(loginuser.nickname);
  const [newPassword, setNewPassword] = useState('');
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');

  // useEffect(() => {
  //   const fetchUserInfo = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem('key');
  //       if (token) {
  //         // 토큰에서 유저 ID 추출
  //         const decodedToken = jwtDecode(token);
  //         const userId = decodedToken.userId;

  //         const response = await axios.get(
  //           //ContextPath
  //           `http://localhost:8080/members/my-info/${userId}`,
  //           {
  //             headers: {
  //               Authorization: `Bearer ${token}`,
  //             },
  //           },
  //         );
  //         const {member_id, name, nickname, profile_img, level, exp, point} =
  //           response.data;
  //         setLoginuser({
  //           member_id,
  //           name,
  //           nickname,
  //           profile_img,
  //           level,
  //           exp,
  //           point,
  //         });
  //         setName(name);
  //         setNickname(nickname);
  //       } else {
  //         setError('No token found');
  //       }
  //     } catch (err) {
  //       setError('Failed to fetch user info');
  //       console.error(err);
  //     }
  //   };
  //   fetchUserInfo();
  // }, []);

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

  // 현재 비밀번호 검증
  const verifyCurrentPassword = () => {
    axios
      .post('http://localhost:8080/members/password', {
        currentPassword: currentPasswordInput,
      })
      .then(response => {
        if (response.data.success) {
          setIsPasswordVerified(true);
          setIsModalVisible(false);
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

  // 사용자 정보 업데이트
  const updateUserInfo = () => {
    const dataToUpdate = {
      name,
      nickname,
      ...(isPasswordVerified && {password: newPassword}), // 새로운 비밀번호가 입력된 경우에만 포함
    };

    axios
      .put(
        `http://localhost:8080/members/my-info/${loginuser.memberId}`,
        dataToUpdate,
      )
      .then(response => {
        Alert.alert('성공', '사용자 정보가 업데이트되었습니다.');
      })
      .catch(error => {
        Alert.alert('오류', '사용자 정보 업데이트에 실패했습니다.');
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <Header label="정보 수정" goto={'MyPage'} />
      <Pressable onPress={selectImage} style={{padding: 30}}>
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
            placeholder="이름"
            value={name}
            onChangeText={text => setName(text)}
          />
        </View>
        <Line />
        <View style={styles.infoRow}>
          <MaterialIcons name="tag-faces" size={32} color="#8C8677" />
          <TextInput
            style={styles.textInput}
            placeholder="닉네임"
            value={nickname}
            onChangeText={text => setNickname(text)}
          />
        </View>
        <Line />
        <View style={styles.pwRow}>
          <MaterialIcons name="lock" size={32} color="#8C8677" />
          {isPasswordVerified ? (
            <TextInput
              style={styles.textInput}
              placeholder="새 비밀번호"
              value={newPassword}
              onChangeText={text => setNewPassword(text)}
              secureTextEntry
            />
          ) : (
            <Button_Green
              label="확인"
              onPress={() => setIsModalVisible(true)}
            />
          )}
        </View>
        <View style={styles.Buttons}>
          <Button_Green label="정보 수정" onPress={updateUserInfo} />
          <Button_Red label="계정 탈퇴" />
        </View>
      </View>

      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="현재 비밀번호"
              value={currentPasswordInput}
              onChangeText={text => setCurrentPasswordInput(text)}
            />
            <View style={styles.Buttons}>
              <Button_Green label="입력" onPress={verifyCurrentPassword} />
              <Button_Red
                label="취소"
                onPress={() => setIsModalVisible(false)}
                color="red"
              />
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
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
    textAlign: 'right', // 아이콘과 텍스트 입력 필드 사이의 간격 추가
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
});

export default EditPageScreen;

