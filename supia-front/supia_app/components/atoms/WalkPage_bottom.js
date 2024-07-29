import { StyleSheet, View, Pressable, Text } from 'react-native';
import { Ionicons, Feather, Entypo } from '@expo/vector-icons';
import { useState } from 'react';

export default function WalkPage_bottom({}) {
  const [selectedCamera, setSelectedCamera] = useState(false);
  const [selectedPause, setSelectedPause] = useState(false);
  const [selectedUser, setSelectedUser] = useState(false);
  
  const onPressCamera = () => {
    setSelectedCamera(true);
    alert('camera')
  }
  const onPressPause = () => {
    setSelectedPause(true);
    alert('Pause')
  }
  const onPressUser = () => {
    setSelectedUser(true);
    alert('User')
  }
  return (
    <View style={[styles.buttonContainer]}>
      <View style={[styles.button]}>
        <Pressable onPress={onPressCamera}>
          <Ionicons
            name="camera-outline"
            size={24}
            color="#A2AA7B"
            style={styles.whiteIcon}
          />
        </Pressable>
        <View style={styles.iconWithCircle}>
          <View style={styles.bg} />
          <Pressable onPress={onPressPause}>
            <Entypo
              name="controller-paus"
              size={24}
              color="#1D1B20"
              style={styles.greenIcon}
            />
          </Pressable>
        </View>
        <Pressable onPress={onPressUser}>
          <Feather
            name="user"
            size={24}
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
    width: 248,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 15
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
    paddingLeft: 7,
    paddingVertical:6,
  },
  greenIcon: {
    paddingRight: 8,
    borderRadius:50,
    backgroundColor: '#A2AA7B',
    paddingLeft: 7,
    paddingVertical:6,
    position: 'relative',
  },
  bg: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#A2AA7B',
    position: 'absolute',
    zIndex: -1,
    opacity: 0.8
  },
  iconWithCircle: {
    position: 'relative', // 컨테이너가 relative
    alignItems: 'center', // 수직 정렬을 위해 추가
    justifyContent: 'center',
    marginHorizontal: 40,
  },
});
