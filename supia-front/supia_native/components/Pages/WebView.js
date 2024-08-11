import React, {useRef, useState} from 'react';
import {SafeAreaView, StyleSheet, Dimensions} from 'react-native';
import WebView from 'react-native-webview';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Webview = () => {
  const webviewRef = useRef(null);
  const [navState, setNavState] = useState(null);

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webviewRef}
        style={styles.webview}

        source={{uri: 'https://i11b304.p.ssafy.io:8443/#/saba-japan-jade-trout'}}
        onNavigationStateChange={e => setNavState(e)}
//         mediaPlaybackRequiresUserAction={false} // 자동으로 미디어를 재생할 수 있게 함
//         javaScriptEnabled={true} // JavaScript가 실행될 수 있게 함
//         domStorageEnabled={true} // 웹페이지의 로컬 스토리지를 사용할 수 있게 함

      />
    </SafeAreaView>
  );
};

export default Webview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  webview: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
  },
});
