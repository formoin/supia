import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import { Avatar } from "@rneui/themed";
import Line from "../../atoms/Line";
import { Octicons } from "@expo/vector-icons";
import ActivityChart from "../../organisms/BarChart/profileChart";
import { useNavigation } from "@react-navigation/native";

const ProfileHeader = () => {
  const navigation = useNavigation();
  const today = new Date();
  const [view, setView] = useState("month");

  const formattedDate = `${today.getMonth() + 1}월 ${today.getDate()}일`;
  const [modalVisible, setModalVisible] = useState(false);

  const [loginuser, setLoginuser] = useState({
    name: "이름",
    nickname: "닉네임",
    profile_img: "프로필 이미지",
    level: "130",
    exp: "410",
    point: "point",
  });

  const minExp = 300;
  const maxExp = 500;
  const nowExp = ((loginuser.exp - minExp) / (maxExp - minExp)) * 120;

  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.dateText}>{formattedDate}</Text>
      <View style={styles.profileContainer}>
        <View>
          <Avatar
            size={64}
            rounded
            source={{
              uri: `${loginuser.profile_img}`,
            }}
            title="Bj"
            containerStyle={{ backgroundColor: "grey" }}
          >
            <Avatar.Accessory onPress={() => {}} size={24} />
          </Avatar>
        </View>
        <Text style={styles.username}>{loginuser.nickname}</Text>
        <Text style={styles.points}>내 포인트 {loginuser.point}</Text>
      </View>
      <View style={{ marginTop: 10, marginBottom: 30 }}>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Line />
        </View>
      </View>
      <View style={styles.levelContainer}>
        <Avatar
          size={64}
          rounded
          source={{
            uri: `${loginuser.profile_img}`,
          }}
          title="Bj"
          containerStyle={{ backgroundColor: "grey" }}
        ></Avatar>
        <View style={{ marginLeft: 30 }}>
          <Text style={styles.levelText}>Lv. {loginuser.level}</Text>
          <View style={styles.levelTextContainer}>
            <Text style={styles.titleText}>새싹</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Octicons name="question" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: `${nowExp}%` }]} />
        </View>
        <View style={styles.progressLabels}>
          <Text style={styles.progressLabel}>{minExp}</Text>

          <Text style={styles.progressLabel}>{maxExp}</Text>
        </View>
      </View>
      <View
        style={{ backgroundColor: "#fff", borderRadius: 40, width: "100%" }}
      >
        <View style={{ padding: 15, justifyContent: "center" }}>
          <ActivityChart></ActivityChart>
        </View>
      </View>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECEADE",
  },
  dateText: {
    fontSize: 16,
    color: "#666",
    paddingLeft: 20,
    paddingTop: 20,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    paddingLeft: 25,
    paddingRight: 25,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
    marginLeft: 15,
    padding: 20,
  },
  points: {
    fontSize: 14,
    color: "#666",
    marginTop: 20,
  },
  levelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 25,
  },
  levelTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  levelText: {
    fontSize: 16,
    color: "#666",
    marginRight: 10,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 5,
  },
  questionButton: {
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  questionMark: {
    fontSize: 18,
    color: "#666",
  },
  progressContainer: {
    padding: 20,
  },
  progressBar: {
    height: 15,
    backgroundColor: "#e0dbd0",
    borderRadius: 10,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    backgroundColor: "#4caf50",
    borderRadius: 10,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: {
    color: "#666",
    fontSize: 14,
  },
  progressValue: {
    color: "#4caf50",
    fontSize: 14,
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#ECEADE",
    borderRadius: 10,
    marginBottom: 16,
    height: "7%",
  },
});

export default ProfileHeader;
