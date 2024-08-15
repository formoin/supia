import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Image,
  Dimensions,
} from 'react-native';

const {width, height} = Dimensions.get('window');
const LoadingScreen = () => {
  const [progress, setProgress] = useState(new Animated.Value(0));

  useEffect(() => {
    // 애니메이션 실행
    Animated.timing(progress, {
      toValue: 1,
      duration: 3000, // 3초 동안 진행
      useNativeDriver: false,
    }).start();
  }, []);

  const widthInterpolated = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '95%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {/* <Image source={require('../../assets/Logo.png')} 
            style={{width : 150, 
                    height : 150, 
                    marginRight : 8}} /> */}
      </View>
      <Animated.View style={[styles.progressBar, {width: widthInterpolated}]} />
      <Text style={styles.loadingText}>Loading ...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECEADE', // 배경색
    paddingVertical: '10%',
  },
  logoContainer: {
    marginBottom: 50, // 로고와 상태바 사이의 간격
    alignItems: 'center',
    marginRight: 8,
  },

  progressBar: {
    height: 10, // 상태바 높이
    backgroundColor: '#A2AA7B', // 상태바 색상
    borderRadius: 5,
    width: '40%',
  },
  loadingText: {
    marginTop: 20, // 상태바와 로딩 텍스트 사이의 간격
    fontSize: 18,
    color: '#A2AA7B', // 로딩 텍스트 색상
  },
});

export default LoadingScreen;
