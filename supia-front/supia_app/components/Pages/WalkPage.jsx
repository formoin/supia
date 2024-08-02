import React, { useEffect, useCallback, useState, useRef } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MapView, { Polyline } from "react-native-maps";
import * as Location from "expo-location";
import WalkPage_bottom from "../atoms/WalkPage_bottom";
import Popup_White from "../Popup_White";
import useStore from "../store/useStore";
import IsCall from "../atoms/IsCall";
import haversine from "haversine";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";

KAKAO_REST_API_KEY = ""

export default function WalkingScreen() {
  const time = useStore((state) => state.time);
  const isActive = useStore((state) => state.isActive);
  const isPaused = useStore((state) => state.isPaused);
  const incrementTime = useStore((state) => state.incrementTime);
  const currentLocation = useStore((state) => state.currentLocation);
  const setCurrentLocation = useStore((state) => state.setCurrentLocation);
  const routeWidth = useStore((state) => state.routeWidth);
  const setRouteWidth = useStore((state) => state.setRouteWidth);
  const finalDistance = useStore((state) => state.finalDistance);
  const setFinalDistance = useStore((state) => state.setFinalDistance);

  const [popupVisible, setPopupVisible] = useState(false);
  const [callerName, setCallerName] = useState("");
  const [route, setRoute] = useState([]);
  const mapRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const [locationData, setLocationData] = useState(null);
  const [dong, setDong] = useState();
  const [si, setSi] = useState();

  const getLocation = async (latitude, longitude) => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("위치 권한이 필요합니다.");
      return;
    }

    const locationData = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );

    setLocationData(locationData);

    // 시, 동 변수에 저장
    if (locationData.length > 0) {
      setDong(locationData[0].street);
      setSi(locationData[0].region);
      console.log("Location Data:", locationData[0]);
      console.log(locationData[0].street);
      console.log(locationData[0].region);
    }
    // 카카오
    // try {
    //   const response = await axios.get(
    //     `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${longitude}&y=${latitude}`,
    //     { headers: { Authorization: `KakaoAK ${KAKAO_REST_API_KEY}` } }
    //   );

    //   if (response.data.documents.length > 0) {
    //     const location = response.data.documents[0].region_3depth_name;
    //     console.log("카카오 API - 법정동 이름:", location);
    //   }
    // } catch (error) {
    //   console.error("Error fetching location from Kakao API:", error);
    // }

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
      let intervalId;

      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("위치 권한이 필요합니다.");
          return;
        }

        let { coords } = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const initialLocation = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };

        setCurrentLocation(initialLocation);
        setLocation(initialLocation);
        setMapRegion(initialLocation);
        setRoute([initialLocation]);
        setTotalDistance(0);
        setRouteWidth(0);

        let currentLocation = initialLocation;
        await getLocation(coords.latitude, coords.longitude);

        intervalId = setInterval(() => {
          const newLatitude = currentLocation.latitude - 2 / 111320;
          const newLocation = {
            latitude: newLatitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };

          setLocation(newLocation);
          setRoute((prevRoute) => {
            if (prevRoute.length > 0) {
              const lastLocation = prevRoute[prevRoute.length - 1];
              const distance = haversine(lastLocation, newLocation, { unit: 'meter' });
              setTotalDistance((prevTotalDistance) => prevTotalDistance + distance / 1000);
            }
            return [...prevRoute, newLocation];
          });

          currentLocation = newLocation;
        }, 1000);
      })();

      return () => clearInterval(intervalId);
    }, [setCurrentLocation, setLocation, setMapRegion, setRoute, setRouteWidth, setFinalDistance])
  );

  const handleCurrentLocation = async () => {
    const { coords } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    await getLocation(coords.latitude, coords.longitude);
    if (mapRef.current && location) {
      mapRef.current.animateToRegion(location, 1000);
    }
    console.log("Returned to current location");
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours < 10 ? `0${hours}` : hours}:${
      minutes < 10 ? `0${minutes}` : minutes
    }:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const handlePopupOpen = (name) => {
    setCallerName(name);
    setPopupVisible(true);
  };

  const handlePopupClose = () => {
    setPopupVisible(false);
  };

  const handleRegionChange = (region) => {
    setMapRegion(region);
  };

  const handleMapPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    await getLocation(latitude, longitude);
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
        onLongPress={handleMapPress} // 지도 클릭하면 주소
      >
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
          <Popup_White si={si} dong={dong} />
        </View>
        <View style={styles.bottomContainer}>
          <WalkPage_bottom onOpenPopup={handlePopupOpen} distance={totalDistance}/>
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
    position: "relative",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 50,
  },
  timerText: {
    position: "absolute",
    top: 30,
    fontSize: 48,
    marginBottom: 20,
    color: "#141410",
  },
  popupContainer: {
    position: "absolute",
    top: 120,
    left: 10,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  locIcon: {
    position: "absolute",
    top: 38,
    right: 40,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 5,
  },
  distanceText: {
    position: "absolute",
    color: "white",
    marginLeft: 10,
    bottom: 150,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
