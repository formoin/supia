import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

const NaverMapView = () => {
  const naverMapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=zfmmure4tp"></script>
        <style>
          html, body { height: 100%; margin: 0; padding: 0; }
          #map { width: 100%; height: 100%; }
        </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var mapOptions = {
          center: new naver.maps.LatLng(36.5665, 126.9780), // 서울
          zoom: 10
        };
        var map = new naver.maps.Map('map', mapOptions);
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: naverMapHtml }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onError={(error) => console.log('WebView Error:', error)}
        onLoadEnd={() => console.log('WebView Loaded')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default NaverMapView;
