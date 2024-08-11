import React, {useState} from 'react';
import useStore from '../store/useStore';
import {
  StyleSheet,
  View,
  Pressable,
  Image,
  Modal,
  Dimensions,
} from 'react-native';

export default function ModalImage({UserName, uri}) {
  const [fullView, setFullView] = useState(false);
  const { getS3Url } = useStore()

  const goToForestView = () => {
    setFullView(!fullView);
  };

  // 핸드폰 width랑 height 바꾸게 dimension으로 가져옴
  const {width, height} = Dimensions.get('window');

  const getImageUri = (thumbnail) => {
    if (thumbnail.startsWith('file://')) {
      return { uri: thumbnail }; // file 경로일 때
    } else {
      return { uri: getS3Url(thumbnail) }; // S3 경로일 때
    }
  };

  return (
    <View>
      <Pressable onPress={goToForestView}>
        <Image
          style={styles.img}
          source={
            getImageUri(uri)
          }
        />
      </Pressable>
      {fullView && (
        <Modal statusBarTranslucent={true}>
          <Pressable onPress={goToForestView} style={{flex: 1}}>
            {/*회전 시 width와 height를 바꿔줘서 화면을 90도 회전시 맞게 설정
              그리고 left와 top을 설정해주는데, 90도 돌아간 상태에서 커져서 여백 공간이 드러나게 되기 때문
              가로 세로 화면의 크기만큼 위치를 다시 설정해준다.
              */}
            <Image
              style={[
                styles.fullViewImg,
                {
                  width: height,
                  height: width,
                  position: 'absolute',
                  left: (width - height) / 2,
                  top: (height - width) / 2,
                },
              ]}
              resizeMode="cover"
              source={
               getImageUri(uri)
              }
            />
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  img: {
    width: 200,
    height: 127,
    borderRadius: 20,
    elevation: 4,
    margin: 5,
    backgroundColor: 'lightgray',
  },

  fullViewImg: {
    transform: [{rotate: '90deg'}],
  },
});
