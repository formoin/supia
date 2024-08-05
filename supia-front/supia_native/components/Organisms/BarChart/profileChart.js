import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {BarChart} from 'react-native-gifted-charts';
import moment from 'moment';


// 지금 러닝 데이터 그냥 랜덤으로 생성 중 ->
// 나중에 데이터 받으면 prop되는 데이터로 넣어준다
const generateData = () => {
  const data = [];
  for (let i = 0; i < 360; i++) {
    const date = moment().subtract(i, 'days');
    data.push({
      value: Math.random() * 2000, // Random distance between 0 and 2 km
      label: date.format('MM-DD'),
    });
  }

  return data.reverse();
};

const CustomButton = ({title, isSelected, onPress}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, isSelected && styles.selectedButton]}>
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
};


const groupDataByMonth = data => {
  const groupedData = {};
  data.forEach(item => {
    const month = item.label.slice(0, 2); // "MM" 형식으로 받기
    if (!groupedData[month]) {
      groupedData[month] = 0;
    }
    groupedData[month] += item.value;
  });
  return Object.keys(groupedData).map(month => ({
    label: month,
    value: groupedData[month],
  }));
};

const ActivityChart = () => {

  const [view, setView] = useState('week');
  const [data, setData] = useState([]);

  useEffect(() => {
    // 컴포넌트 마운트 시 데이터 초기화
    const initialData = generateData();
    setData(initialData.slice(-7)); // 초기에는 1주일 데이터를 표시
  }, []);

  const showData = text => {
    setView(text);
    const rawdata = generateData();
    if (text === 'week') {
      setData(rawdata.slice(-7));
    } else if (text === 'month') {
      setData(rawdata.slice(-30));
    } else {
      setData(groupDataByMonth(rawdata));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>활동 기록</Text>
      <View style={styles.buttonContainer}>
        <CustomButton
          title="주"
          isSelected={view === 'week'}
          onPress={() => showData('week')}
        />
        <CustomButton
          title="월"
          isSelected={view === 'month'}
          onPress={() => showData('month')}
        />
        <CustomButton
          title="년"
          isSelected={view === 'year'}
          onPress={() => showData('year')}
        />
      </View>
      {data && data.length > 0 && (
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
      )}
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
    textAlign: 'center',
    marginVertical: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#E6E1D8',
  },
  selectedButton: {
    backgroundColor: '#ECEADE',

  },
  buttonText: {
    fontSize: 16,
  },
});

export default ActivityChart;
