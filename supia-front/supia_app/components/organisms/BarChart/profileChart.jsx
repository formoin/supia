import React, { useState } from "react";
import {
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
import { BarChart } from "react-native-gifted-charts";
import moment from "moment";

// 지금 러닝 데이터 그냥 랜덤으로 생성 중 ->
// 나중에 데이터 받으면 prop되는 데이터로 넣어준다
const generateData = () => {
  const data = [];
  for (let i = 0; i < 360; i++) {
    const date = moment().subtract(i, "days");
    data.push({
      value: Math.random() * 2000, // Random distance between 0 and 2 km
      label: date.format("MM-DD"),
    });
    // console.log(data[i]);
  }

  return data.reverse();
};

const CustomButton = ({ title, isSelected, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, isSelected && styles.selectedButton]}
    >
      <Text style={[styles.buttonText]}>{title}</Text>
    </Pressable>
  );
};

const groupDataByYear = (data) => {
  const months = [];
  data.forEach((item) => {
    const month = item.label.slice(0, 2);
    // console.log(month);
    if (!months[month]) {
      //   console.log(months[month - 1]);
      months[month] = 0;
    }
    months[month] += item.value;
  });
  return Object.keys(months).map((month) => ({
    value: months[month],
    label: month,
  }));
};

const ActivityChart = () => {
  const [view, setView] = useState("month");
  const rawdata = generateData();
  const [data, setData] = useState(rawdata);

  const showData = async (text) => {
    setView(text);
    if (text == "week") {
      //   console.log("주");
      setData(rawdata.slice(-7));
    } else if (text == "month") {
      //   console.log("월");
      setData(rawdata.slice(-30));
    } else {
      //   console.log("년");
      setData(groupDataByYear(rawdata));
    }
  };

  // 버튼이 고정되게 하고 싶은데 ㅠ 이건 나중에 확인
  return (
    <View style={styles.container}>
      <Text style={styles.title}>활동 기록</Text>
      <View style={styles.buttonContainer}>
        <CustomButton
          title="주"
          isSelected={view === "week"}
          onPress={() => showData("week")}
        />
        <CustomButton
          title="월"
          isSelected={view === "month"}
          onPress={() => showData("month")}
        />
        <CustomButton
          title="년"
          isSelected={view === "year"}
          onPress={() => showData("year")}
        />
      </View>
      <BarChart
        data={data}
        barWidth={20}
        barBorderRadius={4}
        frontColor="#A2AA7B"
        height={200}
        initialSpacing={20}
        yAxisThickness={0}
        xAxisThickness={0}
        noOfSections={3}
        disablePress
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginVertical: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    backgroundColor: "#E6E1D8",
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: "#ECEADE",
    alignItems: "center",
    width: "33%",
  },
  buttonText: {
    fontSize: 16,
  },
});
export default ActivityChart;
