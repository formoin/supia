import React, { useEffect, useState } from 'react';
import { SimpleLineIcons } from "@expo/vector-icons";
import { StyleSheet, View, Text, ActivityIndicator, Image } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

const API_KEY = 'f02486b7ba56ed464a8ab7aba33d36c3'; // OpenWeatherMap API 키를 여기에 입력하세요.

export default function WeatherInfo() {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchWeatherAndLocation = async () => {
      try {
        // 현재 위치를 가져옵니다.
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location.coords);
        console.log(location.coords.latitude, location.coords.longitude)
        // OpenWeatherMap API를 통해 날씨 정보를 가져옵니다.
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather`,
          {
            params: {
              lat: location.coords.latitude,
              lon: location.coords.longitude,
              appid: API_KEY,
              units: 'metric', // 'metric'으로 설정하면 온도가 섭씨로 표시됩니다.
              lang: 'kr' // 날씨 정보를 한국어로 표시합니다.
            }
          }
        );

        // 날씨 정보를 상태에 저장합니다.
        const weatherData = response.data;
        setWeather(weatherData);

      } catch (error) {
        setErrorMsg('위치 또는 날씨 정보를 가져오는 데 실패했습니다.');
      }
      setLoading(false);
    };

    fetchWeatherAndLocation();

    // 날짜 포맷 설정
    const today = new Date();
    const formattedDate = `${today.getMonth() + 1}월 ${today.getDate()}일`;
    setDate(formattedDate);
  }, []);

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
  const weatherDescription = weather?.weather[0].description || '날씨 정보 없음';
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
          <Image source={{ uri: weatherIconUrl }} style={styles.weatherIcon} />
          <View style={styles.weatherDetails}>
            <Text>날씨: {weatherDescription}</Text>
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
