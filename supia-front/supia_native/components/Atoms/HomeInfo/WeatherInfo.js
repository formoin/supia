import React, {useEffect, useState} from 'react';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Image,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';
import {WEATHER_API_KEY} from '@env'

export default function WeatherInfo() {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: '위치 접근 권한 요청',
            message: '위치 정보를 사용하기 위해 권한이 필요합니다.',
            buttonNeutral: '나중에',
            buttonNegative: '취소',
            buttonPositive: '확인',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          console.log('위치 접근 권한이 거부되었습니다.');
          setErrorMsg('위치 접근 권한이 거부되었습니다.');
          setLoading(false);
        }
      } else {
        getCurrentLocation();
      }
    };

    const getCurrentLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setLocation({latitude, longitude});
          setErrorMsg(null);
          fetchWeatherAndLocation(latitude, longitude);
        },
        error => {
          console.log(error.code, error.message);
          setErrorMsg('위치 정보를 가져오는 데 실패했습니다.');
          setLoading(false);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    };

    const fetchWeatherAndLocation = async (lat, lon) => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather`,
          {
            params: {
              lat: lat,
              lon: lon,
              appid: WEATHER_API_KEY,
              units: 'metric',
              lang: 'kr',
            },
          },
          {
            headers: {
              'content-type': 'multipart/form-data',
            },
          },
        );
        if (isMounted) { // 마운트 상태가 true일 때만 상태 업데이트
          setWeather(response.data);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMsg('위치 또는 날씨 정보를 가져오는 데 실패했습니다.');
          setLoading(false);
        }
      }
    };

    requestLocationPermission();

    const today = new Date();
    const formattedDate = `${today.getMonth() + 1}월 ${today.getDate()}일`;
    setDate(formattedDate);

    return () => {
      isMounted = false; // 컴포넌트 언마운트 시 false로 설정
    };
  }, []); // 초기 마운트 시 호출

  // 로딩 중인 경우
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // 위치 또는 날씨 정보가 없는 경우
  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  // 위치와 날씨 정보가 있는 경우
  const weatherDescription =
    weather?.weather[0].description || '날씨 정보 없음';
  const iconCode = weather?.weather[0].icon || '0'; // 기본 아이콘 코드
  const weatherIconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

  return (
    <View style={styles.container}>
      <Text style={styles.date}>{date}</Text>
      {weather && (
        <View style={styles.weatherContainer}>
          <View style={styles.header}>
            <SimpleLineIcons name="location-pin" size={30} color="#8C8677" />
            <Text style={styles.cityName}>{weather.name}</Text>
          </View>
          <Image source={{uri: weatherIconUrl}} style={styles.weatherIcon} />
          <View style={styles.weatherDetails}>
            <Text style={{marginBottom: 5}}>{weatherDescription}</Text>
            <Text>온도: {weather.main.temp}°C</Text>
            <Text>습도: {weather.main.humidity}%</Text>
            <Text>풍속: {weather.wind.speed} m/s</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '45%',
    height: '85%',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    opacity: 0.8,
    backgroundColor: '#FBFBFB',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  date: {
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  weatherContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cityName: {
    fontSize: 15,
    marginLeft: 10,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
  weatherDetails: {
    marginTop: 10,
    alignItems: 'center',
    fontSize: 15,
    fontStyle: 'normal',
    fontWeight: '400',
  },
});
