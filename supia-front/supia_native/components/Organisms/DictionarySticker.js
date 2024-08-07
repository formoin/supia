import React, {useState} from 'react';
import Header from '../Atoms/Header';
import useStore from '../store/useStore';
import DicDivide from '../DicDivide';
import Octicons from 'react-native-vector-icons/Octicons';
import { View, StyleSheet, Text, ScrollView, Pressable, Image, Dimensions  } from 'react-native';
import { GestureHandlerRootView, LongPressGestureHandler } from 'react-native-gesture-handler';

const responseData = {
  id: 1,
  forestId: 52,
  music: null,
  theme: null,
  items: [
    {
      itemId: 205,
      x: 12.45,
      y: 25.67,
      imgUrl: "https://newsimg-hams.hankookilbo.com/2023/06/16/c80476cb-0647-4485-a536-3a01c842a38f.jpg",
      sound: "https://example.com/sound1.mp3"
    },
    {
      itemId: 206,
      x: 30.12,
      y: 40.78,
      imgUrl: "https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=9046601&filePath=L2Rpc2sxL25ld2RhdGEvMjAxNC8yMS9DTFM2L2FzYWRhbFBob3RvXzI0MTRfMjAxNDA0MTY=&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10004",
      sound: "https://example.com/sound2.mp3"
    },
    {
      itemId: 207,
      x: 50.34,
      y: 60.89,
      imgUrl: "https://example.com/image3.jpg",
      sound: "https://example.com/sound3.mp3"
    }
  ]
};


export default function DictionarySticker({ setShowSticker, speciesName, representativeImg }) {
  const { droppedImages, addDroppedImage, removeDroppedImage } = useStore();
  const position = { x: 10, y: 10 };

  const isImageUsed = (itemId) => {
    return droppedImages.some(img => img.itemId === itemId);
  };

  const onLongPress = (itemId) => () => {
    const item = responseData.items.find(item => item.itemId === itemId);
    const imgUrl = item.imgUrl
    if (!isImageUsed(itemId)) {
      addDroppedImage(itemId, imgUrl, position);
    } else {
      removeDroppedImage(itemId);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.headerContainer}>
        <Header label="나의 도감" goto='MyForest' />
        <Pressable onPress={() => setShowSticker(false)} style={{ padding: 7 }}>
          <Octicons name="x" size={30} style={styles.closeIcon} />
        </Pressable>
      </View>
      <Text style={styles.speciesName}>{speciesName}</Text>

      <ScrollView contentContainerStyle={styles.Cardcontainer}>
        {responseData.items.map(item => {
          // 각 아이템의 isImageUsed를 계산합니다.
          const used = isImageUsed(item.itemId);

          return (
            <View key={item.itemId} style={styles.card}>
              <LongPressGestureHandler onActivated={onLongPress(item.itemId)}>
                <View style={styles.sticker}>
                  <Image source={{ uri: item.imgUrl }} style={{ width: 110, height: 110, marginVertical: 4 }} />
                  {used && <Text style={styles.usageLabel}>사용 중</Text>}
                </View>
              </LongPressGestureHandler>
              <Text>2001.04.28</Text>
            </View>
          );
        })}
      </ScrollView>
    </GestureHandlerRootView>
  );
}



const styles = StyleSheet.create({
  container: {
    width: 362,
    height: 408,
    borderRadius: 32,
    backgroundColor: '#FCFCFC',
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    paddingRight: 20
  },
  Cardcontainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // 자식들이 줄을 넘어가도록 설정
    justifyContent: 'flex-start',
  },
  card:{
    width: '30%',
    height: 150,
    borderRadius: 10, // border-radius: 10px;
    borderWidth: 1, 
    margin: 5,
    alignItems: 'center',
  },
  speciesName:{
    fontSize: 25, // Adjust the size as needed
    textAlign: 'center',
    marginVertical: 10
  }
});
