import React, {useRef, useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet, Dimensions} from 'react-native';
import WebView from 'react-native-webview';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Webview = ({isCaller, targetUserId, userId, memberName}) => {
  const webviewRef = useRef(null);
  const [navState, setNavState] = useState(null);

  const injectedJS = `
  (function() {
    setTimeout(() => {
      window.userId = '${userId}';
      window.isCaller = ${isCaller};
      window.targetUserId = '${targetUserId}';
      window.memberName = '${memberName}';
    }, 500); 
  })();
`;

  useEffect(() => {
    if (webviewRef.current) {
      const data = {
        isCaller,
        targetUserId,
        userId,
        memberName,
      };
      webviewRef.current.postMessage(JSON.stringify(data));
    }
  }, [isCaller, targetUserId, userId, memberName]);

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webviewRef}
        style={styles.webview}
        source={{
          uri: 'https://i11b304.p.ssafy.io',
        }}
        onNavigationStateChange={e => setNavState(e)}
        javaScriptEnabled={true} // JavaScript 활성화
        injectedJavaScript={injectedJS}
      />
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
  webview: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
  },
});
