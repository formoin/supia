import React, {useState} from 'react';
import Header from '../Atoms/Header';
import useStore from '../store/useStore';
import DicDivide from '../DicDivide';
import Octicons from 'react-native-vector-icons/Octicons';
import { View, StyleSheet, Text, ScrollView, Pressable, Image, Dimensions  } from 'react-native';
import { GestureHandlerRootView, LongPressGestureHandler } from 'react-native-gesture-handler';

export default function DictionarySticker({ setShowSticker, speciesName, representativeImg }) {
  const [isImageUsed, setIsImageUsed] = useState(false);
  const { addDroppedImage } = useStore();

  const onLongPress = () => {
    if (!isImageUsed) {
      setIsImageUsed(true); // 이미지가 사용 중임을 표시
      const position = { x: 10, y: 10 };
      addDroppedImage(representativeImg, position)
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
        <View style={styles.card}>
          <LongPressGestureHandler onActivated={onLongPress}>
            <View style={styles.sticker}>
              <Image source={{ uri: representativeImg }} style={{ width: 110, height: 110, marginVertical: 4 }} />
              {isImageUsed && <Text style={styles.usageLabel}>사용 중</Text>}
            </View>
          </LongPressGestureHandler>
          <Text>2001.04.28</Text>
        </View>
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
