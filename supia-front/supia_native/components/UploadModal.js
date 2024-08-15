import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import useStore from './store/useStore';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function UploadModal({
  onClose,
  drawingImg,
  probsName,
  category,
  originalUrl,
  code,
}) {
  const [unknownValue, setUnkownValue] = useState();
  const {addItem, items, getS3Url} = useStore();

  const saveItem = () => {
    if (probsName === 'unknown') {
      const newItem = {
        imageUrl: drawingImg,
        originalUrl: originalUrl,
        species: unknownValue,
        category: 4,
        position: code,
      };
      console.log(newItem);
      addItem(newItem);
    } else {
      const newItem = {
        imageUrl: drawingImg,
        originalUrl: originalUrl,
        species: probsName,
        category: category,
        position: code,
      };
      addItem(newItem);
    }

    onClose();
  };

  const onChangeUnknownValue = text => {
    setUnkownValue(text);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={onClose} style={styles.closeButton}>
        <Octicons name="x" size={25} style={styles.closeIcon} />
      </Pressable>
      <Image
        source={{uri: getS3Url(drawingImg)}}
        style={{
          width: 250,
          height: 250,
          marginTop: 30,
        }}
      />
      {probsName !== 'unknown' ? (
        <Text style={styles.contentText}>
          [{category}] "{probsName}"를 발견했다!
        </Text>
      ) : (
        <View style={{flexDirection: 'column'}}>
          <Text style={styles.contentFailText}>
            새로운 자연물을 발견하셨군요!
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              onChangeText={onChangeUnknownValue}
              value={unknownValue}
              placeholder="직접 이름을 설정해보세요."
              style={styles.textInput}
            />
            <AntDesign name="edit" size={14} style={{paddingBottom: 15}} />
          </View>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={saveItem}>
          <Text style={styles.buttonText}>저장하기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>다시찍기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 331,
    height: 460,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0,  0, 0.10)',
    opacity: 1,
    backgroundColor: 'white',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4, // 안드로이드에서는 elevation으로 그림자 설정
    alignItems: 'center',
    padding: 20,
  },
  closeButton: {
    position: 'absolute', // 절대 위치로 설정
    top: 20, // 원하는 위치로 조정
    right: 20, // 원하는 위치로 조정
  },
  button: {
    width: 72,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#EDE1D7',
    paddingBottom: 3,
  },
  contentText: {
    color: '#000',
    fontSize: 22,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 26,
    marginVertical: 30,
    textAlign: 'center',
  },
  contentFailText: {
    color: '#000',
    fontSize: 22,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 26,
    textAlign: 'center',
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    color: 'grey',
    marginLeft: 50,
    marginBottom: 20,
  },
});
