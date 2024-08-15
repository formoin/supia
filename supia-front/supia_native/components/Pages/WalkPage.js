import React, {useEffect, useCallback, useState, useRef} from 'react';
import {View, Text, StyleSheet, Dimensions, Pressable} from 'react-native';
import MapView, {Polyline} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import WalkPage_bottom from '../Atoms/WalkPage_bottom';
import Popup_White from '../Popup_White';
import useStore from '../store/useStore';
import IsCall from '../Atoms/IsCall';
import haversine from 'haversine';
import {useFocusEffect} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import {KAKAO_API_KEY, Server_IP} from '@env';

export default function WalkingScreen({}) {
  const time = useStore(state => state.time);
  const isActive = useStore(state => state.isActive);
  const isPaused = useStore(state => state.isPaused);
  const incrementTime = useStore(state => state.incrementTime);
  const currentLocation = useStore(state => state.currentLocation);
  const setCurrentLocation = useStore(state => state.setCurrentLocation);
  // 산책 경로 -> zustand로 전역 관리
  const routeWidth = useStore(state => state.routeWidth);
  const setRouteWidth = useStore(state => state.setRouteWidth);
  const finalDistance = useStore(state => state.finalDistance);
  const setFinalDistance = useStore(state => state.setFinalDistance);

  const [popupVisible, setPopupVisible] = useState(false);
  const [callerName, setCallerName] = useState('');
  const [route, setRoute] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const mapRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [code, setCode] = useState();
  const [dong, setDong] = useState();
  const [ri, setRi] = useState();
  const {fetchLocationData} = useStore();

  const getLocation = () => {
    let isMounted = true;

    Geolocation.getCurrentPosition(
      position => {
        if (!isMounted) return;
        const {latitude, longitude} = position.coords;
        const initialLocation = {
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        setCurrentLocation(initialLocation);
        setLocation(initialLocation);
        setMapRegion(initialLocation);
        setRoute([initialLocation]);
        setTotalDistance(0);
        setRouteWidth(0);

        getLocationData(longitude, latitude);
        let currentLocation = initialLocation;

        const intervalId = setInterval(() => {
          if (!isMounted) return;
          const newLocation = {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };
          setLocation(newLocation);
          setRoute(prevRoute => {
            if (prevRoute.length > 0) {
              const lastLocation = prevRoute[prevRoute.length - 1];
              const distance = haversine(lastLocation, newLocation);
              setTotalDistance(prevDistance => prevDistance + distance);
            }
            return [...prevRoute, newLocation];
          });
          currentLocation = newLocation;
        }, 1000);

        return () => {
          isMounted = false;
          clearInterval(intervalId);
        }; // 컴포넌트 언마운트 시 interval 정리
      },
      error => console.log(error),
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  useEffect(() => {
    let interval = null;
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        incrementTime();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused, incrementTime]);

  useFocusEffect(
    useCallback(() => {
      getLocation();
      return () => {}; // Cleanup if needed
    }, [
      setCurrentLocation,
      setLocation,
      setMapRegion,
      setRoute,
      setTotalDistance,
    ]),
  );

  const handleCurrentLocation = () => {
    getLocation();
    if (mapRef.current && location) {
      mapRef.current.animateToRegion(location, 1000);
    }
  };

  const formatTime = totalSeconds => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours < 10 ? `0${hours}` : hours}:${
      minutes < 10 ? `0${minutes}` : minutes
    }:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const handlePopupOpen = name => {
    setCallerName(name);
    setPopupVisible(true);
  };

  const handlePopupClose = () => {
    setPopupVisible(false);
  };

  const handleRegionChange = region => {
    setMapRegion(region);
  };

  const handleMapPress = async event => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    console.log('꾹', latitude, longitude);
    getLocationData(longitude, latitude);
  };

  const getLocationData = async (lon, lat) => {
    const {dong, ri, code} = await fetchLocationData(lon, lat);
    if (code) {
      setDong(dong);
      setRi(ri);
      setCode(code);
    } else {
      console.log('kakao 실패');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={mapRegion}
        showsUserLocation
        onRegionChangeComplete={handleRegionChange}
        showsMyLocationButton={false}
        onLongPress={handleMapPress}>
        <Polyline
          coordinates={route}
          strokeColor="#000"
          strokeWidth={routeWidth}
        />
      </MapView>

      <View style={styles.overlay}>
        <Text style={styles.timerText}>{formatTime(time)}</Text>
        {popupVisible && (
          <IsCall callerName={callerName} onClose={handlePopupClose} />
        )}
        <View style={styles.popupContainer}>
          <Popup_White dong={dong} ri={ri} code={code} />
        </View>
        <View style={styles.bottomContainer}>
          <WalkPage_bottom
            onOpenPopup={handlePopupOpen}
            distance={totalDistance}
            mapRef={mapRef}
          />
        </View>
        <Pressable onPress={handleCurrentLocation} style={styles.locIcon}>
          <MaterialCommunityIcons
            name="map-marker-radius"
            size={30}
            color="white"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 50,
  },
  timerText: {
    position: 'absolute',
    top: 30,
    fontSize: 48,
    marginBottom: 20,
    color: '#141410',
  },
  popupContainer: {
    position: 'absolute',
    top: 120,
    left: 10,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  currentLocationButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  distanceContainer: {
    position: 'absolute',
    bottom: 150,
    left: '50%',
    transform: [{translateX: -100}],
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  locIcon: {
    position: 'absolute',
    top: 38,
    right: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
});
