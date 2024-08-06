import React from 'react';
import Header from '../Atoms/Header';
import useStore from '../store/useStore';
import DicDivide from '../DicDivide';
import Card from '../Atoms/Card';
import Octicons from 'react-native-vector-icons/Octicons';
import { View, StyleSheet, Pressable, ScrollView, Button } from 'react-native';
import DictionarySticker from './DictionarySticker'

export default function DictionaryForest({goDictionary, showSticker, setShowSticker}) {
  const {activeDic, resetActiveDic} = useStore();

  const renderCard = () => {
    switch (activeDic) {
      case 'text1':
        return (
          <View style={styles.Cardcontainer}>
            <Card
              representativeImg="https://newsimg-hams.hankookilbo.com/2023/06/16/c80476cb-0647-4485-a536-3a01c842a38f.jpg"
              speciesName="개망초"
              mini={true}
              setShowSticker = {setShowSticker}
            />
            <Card
              imguri="https://newsimg-hams.hankookilbo.com/2023/06/16/c80476cb-0647-4485-a536-3a01c842a38f.jpg"
              name="개망초"
            />
            <Card
              imguri="https://newsimg-hams.hankookilbo.com/2023/06/16/c80476cb-0647-4485-a536-3a01c842a38f.jpg"
              name="개망초"
            />
            <Card
              imguri="https://newsimg-hams.hankookilbo.com/2023/06/16/c80476cb-0647-4485-a536-3a01c842a38f.jpg"
              name="개망초"
            />
          </View>
        );
      case 'text2':
        return (
          <View style={styles.Cardcontainer}>
            <Card
              imguri="data:image/jpeg;base64,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"
              name="다람쥐"
            />
          </View>
        );
      case 'text3':
        return (
          <View style={styles.Cardcontainer}>
            <Card
              imguri="https://png.pngtree.com/png-clipart/20160610/ourmid/pngtree-butterfly-png-image_629260.png"
              name="나비"
            />
          </View>
        );
      case 'text4':
        return (
          <View style={styles.Cardcontainer}>
            <Card imguri="" name="기타" />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
        <View style={styles.headerContainer}>
            <Header label="나의 도감" goto="MyForest"/>
            <Pressable onPress={goDictionary} style={styles.closeButton}>
              <Octicons name="x" size={30} style={styles.closeIcon} />
            </Pressable>
        </View>
          <View style={styles.p_value}>
            <DicDivide
              text1="식물"
              text2="동물"
              text3="곤충"
              text4="기타"
            />
          </View>
        <ScrollView>
          {renderCard()}
        </ScrollView>


        {showSticker && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
          <DictionarySticker 
            setShowSticker={setShowSticker} 
            speciesName={showSticker.speciesName} 
            representativeImg={showSticker.representativeImg}
          />
          </View>
      )}
    </View>
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
  closeButton: {
    padding: 7,
  },
  closeIcon: {
    color: 'black',
  },
  p_value: {
    padding: 20,
    alignItems: 'center',
    paddingTop: 30,
  },
  Cardcontainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // 자식들이 줄을 넘어가도록 설정
    justifyContent: 'flex-start',
    padding: 10,
  },
});
