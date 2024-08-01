import { StyleSheet, View, Pressable, Text } from 'react-native';
import { MaterialIcons, Feather, Entypo } from '@expo/vector-icons';
import { useState } from 'react';
import { useNavigation } from "@react-navigation/native";

export default function WalkPage_bottom({captureScreen}) {
  const [refresh, setRefresh] = useState(false);
  const navigation = useNavigation();

  const onPressEnd = () => {
    navigation.navigate('Walk');
    // navigation.goback();
  }
  const onTakePicture = () => {
    captureScreen()
  };
  const onPressRefresh = () => {
    setRefresh(true);
    alert('refresh')
  }
  return (
    <View style={[styles.buttonContainer]}>
      <View style={[styles.button]}>
        <Pressable onPress={onPressEnd}>
          <MaterialIcons
            name="call-end"
            size={30}
            color="red"
            style={styles.whiteIcon}
          />
        </Pressable>
        <View style={styles.iconWithCircle}>
          <View style={styles.bg} />
          <Pressable onPress={onTakePicture} style={styles.pictureIcon} />
        </View>
        <Pressable onPress={onPressRefresh}>
          <Feather
            name="refresh-cw"
            size={30}
            color="#A2AA7B"
            style={styles.whiteIcon}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 15,
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    opacity:1,
  },
  whiteIcon: {
    paddingRight: 8,
    borderRadius:50,
    backgroundColor: '#fff',
    paddingLeft: 9,
    paddingVertical:9,
  },
  pictureIcon: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: 'white',
    position: 'absolute',
  },
  bg: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: 'rgba(162, 170, 123, 0.8)',
    position: 'absolute',
    zIndex: -1,
    opacity: 0.8
  },
  iconWithCircle: {
    position: 'relative', // 컨테이너가 relative
    alignItems: 'center', // 수직 정렬을 위해 추가
    justifyContent: 'center',
    marginHorizontal: 80,
  },
});
