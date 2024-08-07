
import React, {useRef} from 'react';
import {
  View,
  Button,
  PermissionsAndroid,
  Platform,
  Alert,
  Text,
} from 'react-native';
import ViewShot from 'react-native-view-shot';

const TestPage = () => {
  const viewShotRef = useRef(null);

  const requestStoragePermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'This app needs access to your storage to save photos.',

            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        return true;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const captureScreen = async () => {
    const hasPermission = await requestStoragePermission();
    if (hasPermission) {
      viewShotRef.current
        .capture()
        .then(uri => {
          console.log('Capture complete...', uri);
        })
        .catch(error => {
          console.error(error);
          Alert.alert('Error', 'Failed to capture screenshot');
        });
    } else {
      Alert.alert(
        'Permission Denied',
        'Storage permission is required to save screenshots',
      );
    }
  };

  return (
    <View style={{flex: 1}}>
      <ViewShot ref={viewShotRef} style={{flex: 1}}>
        {/* 캡쳐할 화면 내용 */}
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Capture this screen!</Text>
        </View>
      </ViewShot>
      <View
        style={{
          position: 'absolute',
          bottom: 50,
          left: 0,
          right: 0,
          alignItems: 'center',
        }}>
        <Button title="Capture Screen" onPress={captureScreen} />
      </View>

    </View>
  );
};

export default TestPage;
