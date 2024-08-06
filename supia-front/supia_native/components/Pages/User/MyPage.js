import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import {Avatar} from '@rneui/themed';
import Line from '../../Atoms/Line';
import Octicons from 'react-native-vector-icons/Octicons';
import ActivityChart from '../../Organisms/BarChart/profileChart';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

const MyPageScreen = ({navigation}) => {
  const today = new Date();
  const formattedDate = `${today.getMonth() + 1}월 ${today.getDate()}일`;
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(null);
  const [loginuser, setLoginuser] = useState({
    name: '',
    nickname: '',
    profile_img: '',
    level: '',
    exp: '',
    point: '',
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('key');
        if (token) {
          // 토큰에서 유저 ID 추출
          const decodedToken = jwt_decode(token);
          console.log(decodedToken);
          const memberId = decodedToken.memberId;

          const response = await axios.get(
            `http://10.0.2.2:8080/api/members/my-info/${memberId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
              },
            },
          );

          setLoginuser(response.data.member); // 서버 응답에 맞게 수정
        } else {
          setError('No token found');
        }
      } catch (err) {
        setError('Failed to fetch user info');
        console.error(err);
      }
    };
    fetchUserInfo();
  }, []);

  const minExp = 300;
  const maxExp = 500;
  const nowExp = ((loginuser.exp - minExp) / (maxExp - minExp)) * 120;

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.dateText}>{formattedDate}</Text>
        <View style={styles.profileContainer}>
          <View>
            <Avatar
              size={64}
              rounded
              source={{
                uri: `https://picsum.photos/100/100`,
              }}>
              <Avatar.Accessory
                onPress={() => {
                  navigation.navigate('EditProfile');
                }}
                underlayColor="#ECEADE"
                size={24}
              />
            </Avatar>
          </View>
          <Text style={styles.username}>{loginuser.nickname}</Text>
          <Text style={styles.points}>내 포인트 {loginuser.point}</Text>
        </View>
        <View style={{marginTop: 10, marginBottom: 30}}>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Line />
          </View>
        </View>
        <View style={styles.levelContainer}>
          <Avatar
            size={64}
            rounded
            source={{
              uri: `${loginuser.profile_img}`,
            }}
            title="Bj"
            containerStyle={{backgroundColor: 'grey'}}></Avatar>
          <View style={{marginLeft: 30}}>
            <Text style={styles.levelText}>Lv. {loginuser.level}</Text>
            <View style={styles.levelTextContainer}>
              <Text style={styles.titleText}>새싹</Text>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Octicons name="question" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progress, {width: `${nowExp}%`}]} />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>{minExp}</Text>
            <Text style={styles.progressLabel}>{maxExp}</Text>
          </View>
        </View>
        <View style={styles.infoSection}>
          <View style={{padding: 15, justifyContent: 'center'}}>
            <ActivityChart />
          </View>
        </View>
      </ScrollView>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>설명창</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Line />
            <Text style={styles.modalTitle}>포인트로 상점 이용하기</Text>
            <Text style={styles.modalTitle2}>거리 100m당 10포인트!</Text>
            <Text style={styles.modalText}>
              걸으면 걸을수록 포인트가 쌓여요. 운동도 하고 포인트도 얻고!
            </Text>
            <Text style={styles.modalTitle}>
              아이템 등록 시 1개당 100포인트!
            </Text>
            <Text style={styles.modalTitle2}>포인트로 상점 이용하기</Text>
            <Text style={styles.modalText}>
              소중한 아이템을 등록하고 보상을 받아가세요!
            </Text>
            <Text style={styles.modalTitle2}>
              천연기념물 발견 시 1000포인트!
            </Text>
            <Text style={styles.modalText}>
              자연의 경이로움을 발견하면 보상이 팡팡!
            </Text>
            <Line />
            <Text style={styles.modalTitle}>경험치와 레벨 업!</Text>
            <Text style={styles.modalTitle2}>매일 방문 시 5경험치 !</Text>
            <Text style={styles.modalText}>
              하루에 한 번씩 방문하면 5경험치가 쌓여요.
            </Text>
            <Text style={styles.modalTitle2}>
              친구에게 아이템 선물 시 5 경험치!
            </Text>
            <Text style={styles.modalText}>
              친구에게 아이템을 선물하고 5경험치를 받아보세요!
            </Text>
            <Text style={styles.modalTitle2}>아이템 등록 시 10경험치!</Text>
            <Text style={styles.modalText}>
              아이템을 등록할 때마다 10경험치를 획득해요!
            </Text>
            <Line />
            <Text style={styles.modalTitle}>레벨업 시스템</Text>
            <Text style={styles.modalText}>exp 100 : 씨앗</Text>
            <Text style={styles.modalText}>exp 300 : 새싹</Text>
            <Text style={styles.modalText}>exp 500 : 잎새</Text>
            <Text style={styles.modalText}>exp 1000 : 꽃</Text>
            <Text style={styles.modalText}>exp 1500 : 열매</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEADE',
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  dateText: {
    fontSize: 16,
    color: '#666',
    paddingLeft: 20,
    paddingTop: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    paddingLeft: 25,
    paddingRight: 25,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 15,
    padding: 20,
  },
  points: {
    fontSize: 14,
    color: '#666',
    marginTop: 20,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 25,
  },
  levelTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  levelText: {
    fontSize: 16,
    color: '#666',
    marginRight: 10,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 5,
  },
  questionButton: {
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionMark: {
    fontSize: 18,
    color: '#666',
  },
  progressContainer: {
    padding: 20,
  },
  progressBar: {
    height: 15,
    backgroundColor: '#e0dbd0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#4caf50',
    borderRadius: 10,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    color: '#666',
    fontSize: 14,
  },
  progressValue: {
    color: '#4caf50',
    fontSize: 14,
    fontWeight: 'bold',
  },

  infoSection: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    width: '100%',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center', // 중앙 정렬
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left', // 왼쪽 정렬
    alignSelf: 'flex-start', // 좌측 정렬
  },
  modalTitle2: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'left', // 왼쪽 정렬
    alignSelf: 'flex-start', // 좌측 정렬
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'left', // 왼쪽 정렬
    alignSelf: 'flex-start', // 좌측 정렬
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#000',
  },
});

export default MyPageScreen;
