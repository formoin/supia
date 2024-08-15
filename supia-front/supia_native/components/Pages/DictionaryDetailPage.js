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
import useStore from '../store/useStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DictionaryDetailScreen({route}) {
  const {id, representativeImg, speciesName} = route.params;
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [sendgiftVisible, setSendgiftVisible] = useState(false);
  const [deletetVisible, setDeletetVisible] = useState(false);
  const [speciesDetail, setSpeciesDetail] = useState(null);
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
        console.log('도감 상세 성공:', response.data);
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
    fetchSpeciesDetail(id);
  }, [id]);

  useEffect(() => {
    setSelectedItemId(null);
  }, [route]);

  const selectedItem = speciesDetail?.items?.find(
    item => item.id === selectedItemId,
  );

  return (
    <ScrollView style={styles.container}>
      <Header label="나의 자연 도감" goto="Dictionary" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.infoContainer}>
          <View style={styles.centeredContent}>
            <Text style={styles.NameFont}>{speciesName}</Text>
            <Image
              source={{uri: getS3Url(representativeImg)}}
              style={styles.image}
            />
            <View style={styles.textContainer}>
              <Text style={styles.InfoFont}>
                {speciesDetail?.description}
              </Text>
              <Line />
            </View>
          </View>
          <View style={styles.miniTitle}>
            {speciesDetail && (
              <Text style={{flex: 1, paddingTop: 15, paddingLeft: 10}}>
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
            {speciesDetail?.items?.map(item => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.itemContainer,
                  selectedItemId === item.id && styles.selectedItemContainer,
                ]}
                onPress={() =>
                  setSelectedItemId(
                    selectedItemId === item.id ? null : item.id,
                  )
                }>
                <Image
                  source={{uri: getS3Url(item.imgUrl)}}
                  style={styles.itemImage}
                />
                <Text style={styles.itemDate}>{item.acquireDate}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

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
              fetchSpeciesDetail(id);
              setSelectedItemId(null);
            }}
          />
        </View>
      </Modal>

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
              fetchSpeciesDetail(id);
              setSelectedItemId(null);
            }}
            when="item"
          />
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  infoContainer: {
    width: '90%',
    marginTop: 10,
    marginBottom: 30,
  },
  centeredContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  NameFont: {
    fontSize: 30,
    fontWeight: '400',
  },
  InfoFont: {
    fontSize: 16,
    fontWeight: '400',
    paddingBottom: 20,
  },
  image: {
    width: 330,
    height: 330,
    marginVertical: 20,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center'
  },
  miniTitle: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10
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
  itemImage: {
    width: 60,
    height: 60,
    marginVertical: 4,
  },
  itemDate: {
    fontSize: 12,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});