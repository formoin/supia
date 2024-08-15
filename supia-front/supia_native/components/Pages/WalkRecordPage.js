import React from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import {useRoute} from '@react-navigation/native'; // import useRoute
import Header from '../Atoms/Header';
import Line from '../Atoms/Line';
import useStore from '../store/useStore';

export default function WalkRecordScreen() {
  const route = useRoute();
  const {distance} = route.params || {}; // get distance from route params
  const capturedImageUri = useStore((state) => state.capturedImageUri);

  const walkStartTime = useStore(state => state.walkStartTime);
  const walkEndTime = useStore(state => state.walkEndTime);
  const distance_km = distance / 1000
  const {items, getS3Url} = useStore();

  const formatTime = isoString => {
    if (!isoString) return '00:00';
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const calculatePoints = () => {
    const pointsFromDistance = Math.floor(distance / 100) * 10;  // 100m당 10포인트
    const pointsFromItems = items.length * 100; // 아이템 등록당 100 포인트
    return pointsFromDistance + pointsFromItems; // 총 포인트 계산
  };
  return (
    <View style={styles.container}>
      <Header label="산책 기록 확인" />
      <ScrollView contentContainerStyle={{flexGrow: 1}} >
        <View style={styles.middleContainer}>
          <Line style={styles.lineTopSpacing} />
          <View style={styles.textContainer}>
            <Text style={styles.text}>Start {formatTime(walkStartTime)}</Text>
            <Text style={styles.text}>End {formatTime(walkEndTime)}</Text>
          </View>
          <Text style={styles.mapText}>코스 지도</Text>
          <Image source={{ uri: capturedImageUri }} style={styles.rectangle} />
          <View style={styles.rectangleContainer}>
            {distance !== undefined && (
              <Text>{distance_km.toFixed(2)}km</Text>
            )}
          </View>
          <View style={styles.lineSpacing}>
            <Line />
          </View>
          <Text style={styles.itemHeader}>획득한 아이템</Text>
          <View style={styles.itemContainer}>
            {items.length === 0 ? (
                <Text>획득한 아이템이 없습니다</Text>
            ) : (
              <ScrollView horizontal style={{ maxHeight: 100 }}>
                {items.map((item, index) => (
                  <View key={index} style={styles.item}>
                    <Image source={{ uri: getS3Url(item.imageUrl) }} style={styles.image} />
                    <Text>{item.species}</Text>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>

          <View style={styles.lineSpacing}>
            <Line />
          </View>
          <Text style={styles.points}>적립된 Point {calculatePoints()}P</Text>
        </View>
      </ScrollView>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  middleContainer: {
    flex: 1,
    marginTop: 40,
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
  },
  mapText: {
    alignSelf: 'flex-start',
    marginLeft: 50,
    fontSize: 15,
    marginBottom: 10,
  },
  rectangleContainer: {
    width: '100%',
    alignItems: 'center',
  },
  rectangle: {
    width: 330,
    height: 200,
    backgroundColor: '#d3d3d3',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#a9a9a9',
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineTopSpacing: {
    marginBottom: 30,
  },
  lineSpacing: {
    width:'100%',
    // marginTop: 10,
  },
  itemHeader: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'flex-start',
    marginLeft: 47,
  },
  itemContainer: {
    alignSelf: 'flex-start',
    marginLeft: 50,
    marginBottom: 10,
  },
  image: {
    width: 50,
    height: 50,
    marginBottom:10,
  },
  itemText: {
    fontSize: 15,
  },
  points: {
    fontSize: 18,
    marginTop: 20,
    marginBottom:50
  },
  item: { // 새로운 스타일 추가
    marginRight: 20, // 아이템 간격 조정
    alignItems: 'center',
  },
});
