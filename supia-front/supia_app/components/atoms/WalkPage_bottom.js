import React, { useState, useCallback } from "react";
import { StyleSheet, View, Pressable, Modal, Text, TouchableWithoutFeedback } from "react-native";
import { Ionicons, Entypo, Feather } from "@expo/vector-icons";
import useStore from "../store/useStore";
import Button_Green from "../atoms/Button_Green";
import Button_Red from "../atoms/Button_Red";
import { useNavigation } from "@react-navigation/native";
import Popup_Call from "../Popup_Call";
import axios from 'axios';

const WalkPage_bottom = ({ onOpenPopup, distance }) => {
  const navigation = useNavigation();
  const { resetStopwatch, pauseStopwatch, setWalkEndTime } = useStore();
  const setRouteWidth = useStore((state) => state.setRouteWidth);
  const finalDistance = useStore((state) => state.finalDistance);
  const walkStartTime = useStore((state) => state.walkStartTime);
  const walkEndTime = useStore((state) => state.walkEndTime);

  const [modalVisible, setModalVisible] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);

  const onPressCamera = () => {
    alert("camera");
  };

  const formatTime = (isoString) => {
        if (!isoString) return '00:00';
        const date = new Date(isoString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
  };

  const sendWalkData = async () => {
    const currentTime = new Date().toISOString();
    const walkData = {
        walkStart: formatTime(walkStartTime),
        walkEnd: formatTime(currentTime),
        distance: distance.toFixed(2),
    };

    try {
        const response = await axios.post('http://i11b304.p.ssafy.io/api/walk', walkData);

        if (response.status === 200) {
            console.log(walkData);
            console.log("산책 정보 저장");
        } else {
            console.log(walkData);
            console.log("산책 저장 실패");
        }
    } catch (error) {
        console.log(walkData);
        console.error("요청 중 오류 발생:", error);
    }
  };

  const onPressPause = useCallback(() => {
    resetStopwatch(); // 스톱워치 리셋
    pauseStopwatch(); // 스톱워치 일시 정지

    const currentTime = new Date().toISOString();
    setWalkEndTime(currentTime);
    sendWalkData(); // 산책 정보를 서버로 전송
    setRouteWidth(4); // 경로 너비 설정
    console.log("Final Distance:", distance.toFixed(2));

    // 모달 팝업 시 산책 경로 표시
    setModalVisible(true);
  }, [resetStopwatch, pauseStopwatch, setWalkEndTime, setRouteWidth, distance]);

  const onPressUser = () => {
    setPopupVisible(true);
  };

  const handleConfirm = () => {
    setModalVisible(false);
    navigation.navigate("WalkRecord", { distance });
  };

  const handleCancel = () => {
    setModalVisible(false);
    navigation.navigate("Home");
  };

  const handlePopupClose = () => {
    setPopupVisible(false);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.buttonWrapper}>
          <Pressable onPress={onPressCamera} style={styles.iconContainer}>
            <Ionicons
              name="camera-outline"
              size={30}
              color="#A2AA7B"
              style={styles.whiteIcon}
            />
          </Pressable>
          <View style={styles.iconWithCircle}>
            <View style={styles.bg} />
            <Pressable onPress={onPressPause} style={styles.pauseButton}>
              <Entypo name="controller-paus" size={30} color="#141410" />
            </Pressable>
          </View>
          <Pressable onPress={onPressUser} style={styles.iconContainer}>
            <Feather
              name="user"
              size={30}
              color="#A2AA7B"
              style={styles.whiteIcon}
            />
          </Pressable>
        </View>

        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>산책 종료</Text>
              <Text style={styles.modalMessage}>
                산책 기록을 확인하시겠습니까?
              </Text>
              <View style={styles.buttonContainerModal}>
                <Button_Green label="네" onPress={handleConfirm} />
                <Button_Red label="아니오" onPress={handleCancel} />
              </View>
            </View>
          </View>
        </Modal>

        <TouchableWithoutFeedback onPress={handlePopupClose}>
          <View>
            <Popup_Call
              visible={popupVisible}
              onClose={handlePopupClose}
              onOpenPopup={onOpenPopup}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    margin: 15,
  },
  buttonWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  iconContainer: {
    paddingHorizontal: 10,
  },
  whiteIcon: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: "#fff",
  },
  pauseButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#A2AA7B",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#A2AA7B",
  },
  bg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(162, 170, 123, 0.8)",
    position: "absolute",
    zIndex: -1,
    opacity: 0.8,
  },
  iconWithCircle: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 50,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainerModal: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
  },
});

export default WalkPage_bottom;
