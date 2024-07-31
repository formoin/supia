import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Modal } from "react-native";
import WalkPage_bottom from "../atoms/WalkPage_bottom";
import Popup_White from "../Popup_White";
import useStore from '../store/useStore';
import IsCall from "../atoms/IsCall";

export default function WalkingScreen() {
  const time = useStore((state) => state.time);
  const isActive = useStore((state) => state.isActive);
  const isPaused = useStore((state) => state.isPaused);
  const incrementTime = useStore((state) => state.incrementTime);
  const [popupVisible, setPopupVisible] = useState(false);
  const [callerName, setCallerName] = useState('');
  
  useEffect(() => {
    let interval = null;
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        incrementTime();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const handlePopupOpen = (name) => {
    setCallerName(name);
    setPopupVisible(true);
  };

  const handlePopupClose = () => {
    setPopupVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{formatTime(time)}</Text>
      {popupVisible && <IsCall callerName={callerName} onClose={handlePopupClose}/>}
      <View style={styles.popupContainer}>
        <Popup_White dong="분평동" />
      </View>
      <View style={styles.bottomContainer}>
        <WalkPage_bottom onOpenPopup={handlePopupOpen}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 30,
  },
  timerText: {
    fontSize: 48,
    marginBottom: 20,
  },
  popupContainer: {
    position: 'absolute',
    top: 120,
    left: 10,
  },
  bottomContainer: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 50, // Adjust padding as needed
  },
});
