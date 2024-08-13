import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../Atoms/Header';
import Line from '../Atoms/Line';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SendGiftModal from '../SendGiftModal';
import Popup from '../Popup';
import {Server_IP} from '@env';
import axios from 'axios';
import loginStore from '../store/useLoginStore';
import useStore from '../store/useStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DictionaryDetailScreen({route}) {
  const {id, representativeImg, speciesName} = route.params;
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [sendgiftVisible, setSendgiftVisible] = useState(false);
  const [deletetVisible, setDeletetVisible] = useState(false);
  const [speciesDetail, setSpeciesDetail] = useState(null);
  // const { token } = loginStore.getState();
  const {getS3Url} = useStore();

  const sendGift = () => {
    setSendgiftVisible(true);
  };

  const handleCloseModal = () => {
    setSendgiftVisible(false);
    setSelectedItemId(null);
  };

  const deleteitem = () => {
    setDeletetVisible(true);
  };

  const handleClosePopup = () => {
    setDeletetVisible(false);
    setSelectedItemId(null);
  };

  // API 호출 함수
  const fetchSpeciesDetail = async speciesId => {
    const token = await AsyncStorage.getItem('key');

    try {
      const response = await axios.get(`${Server_IP}/items/detail`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
        params: {
          speciesId: speciesId,
        },
      });
      if (response.status === 200) {
        console.log('도감 상세 성공:', response.data); // API 응답 데이터 콘솔에 출력
        setSpeciesDetail(response.data);
      }
    } catch (error) {
      if (error.response) {
        console.error('도감 상세 API Error:', error);
        if (error.response.status === 400) {
          console.error('종 세부정보 로딩 실패');
        }
      } else {
        console.error('Network Error:', error.message);
      }
    }
  };

  useEffect(() => {
    fetchSpeciesDetail(id); // speciesName으로 API 호출
  }, [id]);

  useEffect(() => {
    setSelectedItemId(null); // 초기화
  }, [route]);

  const selectedItem = speciesDetail?.items?.find(
    item => item.id === selectedItemId,
  );

  return (
    <View style={styles.container}>
      <Header label="나의 자연 도감" goto="Dictionary" />

      <View style={styles.infoContainer}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Text style={styles.NameFont}>{speciesName}</Text>
          <Image
            source={{uri: getS3Url(representativeImg)}}
            style={styles.image}
          />
          <View style={styles.textContainer}>
            <ScrollView>
              <Text style={styles.InfoFont}>{speciesDetail?.description}</Text>
            </ScrollView>
          </View>
          <View style={{marginVertical: 20}}>
            <Line />
          </View>
        </View>
        <View>
          <View style={styles.miniTitle}>
            {/* speciesDetail이 null이 아닌 경우에만 렌더링 */}
            {speciesDetail && (
              <Text style={{flex: 1}}>
                {speciesName} ({speciesDetail.items.length})
              </Text>
            )}
            {selectedItemId !== null && (
              <TouchableOpacity style={styles.iconContainer}>
                <AntDesign
                  name="delete"
                  size={24}
                  color="#A2AA7B"
                  onPress={deleteitem}
                />
                <Feather
                  name="gift"
                  size={24}
                  color="#A2AA7B"
                  onPress={sendGift}
                  style={{marginHorizontal: 7}}
                />
              </TouchableOpacity>
            )}
          </View>
          <ScrollView horizontal>
            {/* speciesDetail이 null이 아닌 경우에만 아이템 렌더링 */}
            {speciesDetail?.items?.map(item => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.itemContainer,
                  selectedItemId === item.id && styles.selectedItemContainer,
                ]}
                onPress={() =>
                  setSelectedItemId(selectedItemId === item.id ? null : item.id)
                }>
                <Image
                  source={{uri: getS3Url(item.imgUrl)}}
                  style={{
                    width: 60,
                    height: 60,
                    marginVertical: 4,
                    transform: [{rotate: '90deg'}],
                  }}
                />
                <Text style={{fontSize: 12}}>{item.acquireDate}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* 아이템 선물 */}
      <Modal
        transparent={true}
        visible={sendgiftVisible}
        onRequestClose={handleCloseModal}>
        <View style={styles.modalBackground}>
          <SendGiftModal
            onClose={handleCloseModal}
            selectedItemId={selectedItemId}
            speciesName={speciesName}
            representativeImg={selectedItem?.imgUrl}
            date={selectedItem?.acquireDate}
            itemId={selectedItem?.id}
            onGiftSuccess={() => {
              handleCloseModal();
              fetchSpeciesDetail(id); // 업데이트된 데이터 가져오기
              setSelectedItemId(null); // 선택된 아이템 초기화
            }}
          />
        </View>
      </Modal>

      {/* 아이템 삭제 */}
      <Modal
        transparent={true}
        visible={deletetVisible}
        onRequestClose={handleClosePopup}>
        <View style={styles.modalBackground}>
          <Popup
            onClose={handleClosePopup}
            Label="아이템 삭제"
            friendName={speciesName}
            content=" 을(를) 도감에서 삭제하시겠습니까?"
            imguri={selectedItem?.imgUrl}
            date={selectedItem?.acquireDate}
            itemid={selectedItem?.id}
            onDeleteSuccess={() => {
              handleClosePopup();
              fetchSpeciesDetail(id); // 업데이트된 데이터 가져오기
              setSelectedItemId(null); // 선택된 아이템 초기화
            }}
            when="item"
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20, // Header와 겹치지 않도록 padding을 추가
  },
  infoContainer: {
    width: '90%',
    alignItems: 'center',
    marginTop: 10,
  },
  NameFont: {
    fontSize: 30,
    fontWeight: '400',
  },
  InfoFont: {
    fontSize: 16,
    fontWeight: '400',
  },
  image: {
    width: 330,
    height: 330,
    marginVertical: 20,
  },
  textContainer: {
    height: 70, // 3줄이 보이도록 높이를 설정 (약 1줄 : 24px)
    width: '100%',
  },
  miniTitle: {
    width: '100%',
    flexDirection: 'row', // 가로 방향으로 정렬
    // justifyContent: 'space-between', // 양 끝에 배치
    alignItems: 'center', // 세로 방향 중앙 정렬
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: 'row', // 아이콘들을 가로로 정렬
    alignItems: 'center', // 아이콘을 세로 방향 중앙 정렬
  },
  itemContainer: {
    width: 80,
    height: 100,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedItemContainer: {
    borderColor: '#A2AA7B',
    borderWidth: 3,
    borderRadius: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
