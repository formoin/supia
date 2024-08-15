import React, {useRef, useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Button,
  View,
  Image,
  Animated,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import WebView from 'react-native-webview';
import useStore from '../store/useStore';
import MeetingPage_bottom from '../Atoms/Meeting_bottom';
import ViewShot from 'react-native-view-shot';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UploadModal from '../UploadModal';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Webview = ({route}) => {
  const {fetchLocationData} = useStore();
  const navigation = useNavigation();
  const {isCaller, targetUserId, userId, memberName} = route.params;
  const webviewRef = useRef(null);
  const ref = useRef(null);
  const [navState, setNavState] = useState(null);
  const [showWebView, setShowWebView] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [drawingImg, setDrawingImg] = useState(null);
  const [probsName, setProbsName] = useState(null);
  const [capturedPhotoUri, setCapturedPhotoUri] = useState(null);
  const [category, setCategory] = useState(null);
  const [orgUrl, setOrgUrl] = useState(null);
  const [code, setCode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const scanAnimation = useRef(new Animated.Value(0)).current;

  const scanLineTransform = scanAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-150, 150],
  });

  // useFocusEffect를 활용해 화면이 포커스될 때마다 WebView를 다시 보여줌
  useFocusEffect(
    React.useCallback(() => {
      setShowWebView(true); // 돌아왔을 때 WebView 다시 보여주기
      return () => setShowWebView(false); // 떠날 때 WebView 숨기기
    }, []),
  );

  const handleWebViewMessage = async event => {
    const {data} = event.nativeEvent; // 웹뷰에서 가져온 사진 정보

    if (data === 'leaveSession') {
      handleLeave();
    } else {
      const imageUrl = data;
      setIsLoading(true);
      // const imageBlob = dataURLToBlob(imageUrl);
      console.log('----------');
      setCapturedPhotoUri(data);
      const cleanedBase64Data = data.replace('data:image/png;base64,', '');
      const token = await AsyncStorage.getItem('key');

      startScanAnimation();

      const now = new Date();
      const year = now.getFullYear().toString().slice(-2);
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const hour = now.getHours().toString().padStart(2, '0');
      const minute = now.getMinutes().toString().padStart(2, '0');
      const date = `${year}${month}${day}`;
      const time = `${hour}${minute}`;

      const formData = new FormData();
      formData.append('file', cleanedBase64Data);
      formData.append('date', date);
      formData.append('time', time);
      formData.append('member_id', userId);

      try {
        const response = await axios.post(
          'https://stirring-dodo-bursting.ngrok-free.app/ai/process-image/webrtc',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
              Accept: 'application/json',
            },
          },
        );
        console.log('사진 보내기 성공!!!');
        setDrawingImg(response.data.hand_drawing_img_url);
        setProbsName(response.data.probs_name);
        setCategory(response.data.category);
        setModalVisible(true);
        getLocation();
      } catch (error) {
        console.error('Upload error', error);
        if (error.response) {
          console.log('Error details:', error.response.data);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const startScanAnimation = () => {
    scanAnimation.setValue(0);
    Animated.loop(
      Animated.timing(scanAnimation, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ).start();
  };

  const handleLeave = () => {
    // WebView를 제거하여 초기화
    navigation.navigate('Walk'); // replace로 이동
  };

  const handleCloseModal = () => {
    setModalVisible(false); // 모달 닫기
  };

  const getLocation = async () => {
    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        console.log('위도경도: ' + latitude + ' ' + longitude);
        const {code} = await fetchLocationData(longitude, latitude);
        console.log('코드: ' + code);
        if (code) {
          setCode(code);
        } else {
          console.log('사진 위치 호출 실패');
        }
      },
      error => console.log('위치 정보 가져오기 실패:', error),
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const enterSession = isCaller ? userId : targetUserId;
  //Caller가 true일 경우 sessionId(UserId)가 userId가 되고, 요청을 보내는 사람이 TargetuserId
  // Caller가 false일 경우 sessionId(UserId)가 fromUserId가 되고

  const injectedJS = `
  (function() {
    setTimeout(() => {
      window.enterSession = '${enterSession}';
      window.userId = '${userId}';
      window.targetUserId = '${targetUserId}';
      window.memberName = '${memberName}';
    }, 500);
  })();
`;

  useEffect(() => {
    const enterSession = isCaller ? userId : targetUserId;
    console.log(enterSession + ' ' + userId + ' ' + targetUserId + memberName);
    if (webviewRef.current) {
      const data = {
        enterSession,
        targetUserId,
        userId,
        memberName,
      };
      webviewRef.current.postMessage(JSON.stringify(data));
    }
  }, [enterSession, targetUserId, userId, memberName]);

  return (
    <SafeAreaView style={styles.container}>
      {showWebView && (
        <WebView
          ref={webviewRef}
          style={styles.webview}
          source={{
            uri: 'https://i11b304.p.ssafy.io',
          }}
          onNavigationStateChange={e => setNavState(e)}
          javaScriptEnabled={true} // JavaScript 활성화
          injectedJavaScript={injectedJS}
          onMessage={handleWebViewMessage}
          mediaPlaybackRequiresUserAction={false}
        />
      )}

      {capturedPhotoUri && isLoading ? (
        <View style={styles.capturedPhotoContainer}>
          <Image
            source={{uri: capturedPhotoUri}}
            style={styles.capturedPhoto}
            resizeMode="cover"
          />
          <Animated.View
            style={[
              styles.scanLine,
              {transform: [{translateX: scanLineTransform}]},
            ]}
          />
        </View>
      ) : null}

      {isModalVisible ? (
        <View style={styles.modalBackground}>
          <UploadModal
            onClose={handleCloseModal}
            drawingImg={drawingImg}
            probsName={probsName}
            category={category}
            originalUrl={orgUrl}
            code={code}
          />
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default Webview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 50,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  webview: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
  },
  modalBackground: {
    position: 'absolute', // WebView 위에 위치하도록 설정
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  capturedPhotoContainer: {
    position: 'absolute',
    top: '25%', // 화면 상단에서 25% 아래로 위치시킴
    left: '15%',
    alignItems: 'center',
  },
  capturedPhoto: {
    width: 300,
    height: 310,
    borderRadius: 10,
  },
  scanLine: {
    position: 'absolute',
    height: 310,
    width: 20, // 선의 두께를 조정
    backgroundColor: 'rgba(162, 170, 123, 0.6)',
  },
});
