import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {BarChart} from 'react-native-gifted-charts';
import useStore from '../../store/useStore';

const CustomButton = ({title, isSelected, onPress}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, isSelected && styles.selectedButton]}>
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
};

const ActivityChart = () => {
  // useStore에서 데이터 가져오기
  const {
    weeklyWalkHistory,
    monthlyWalkHistory,
    yearlyWalkHistory,
    fetchWalkHistory,
  } = useStore(state => ({
    weeklyWalkHistory: state.weeklyWalkHistory,
    monthlyWalkHistory: state.monthlyWalkHistory,
    yearlyWalkHistory: state.yearlyWalkHistory,
    fetchWalkHistory: state.fetchWalkHistory,
  }));

  const [view, setView] = useState('week');
  const [data, setData] = useState([]);

  const ValidateWeekData = datas => {
    const dataset = [];
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

    if (!datas) {
      for (let i = 0; i < 7; i++) {
        dataset.push({
          value: 0,
          label: daysOfWeek[i],
        });
      }
      return dataset;
    }

    for (let i = 0; i < datas.length; i++) {
      const date = new Date(datas[i].walkDate);
      dataset.push({
        value: datas[i].totalDistance / 1000,
        label: daysOfWeek[date.getDay()],
      });
    }

    for (let i = datas.length; i < 7; i++) {
      dataset.push({
        value: 0,
        label: daysOfWeek[i],
      });
    }

    return dataset;
  };

  const ValidateMonthData = datas => {
    const dataset = [];

    if (!datas) {
      for (let i = 0; i < 31; i++) {
        dataset.push({
          value: 0,
          label: (i + 1) % 7 === 0 ? (i + 1).toString() : null,
        });
      }
      return dataset;
    }

    for (let i = 0; i < datas.length; i++) {
      dataset.push({
        value: datas[i].totalDistance / 1000,
        label: (i + 1) % 7 === 0 ? (i + 1).toString() : null,
      });
    }

    for (let i = datas.length; i < 31; i++) {
      dataset.push({
        value: 0,
        label: (i + 1) % 7 === 0 ? (i + 1).toString() : null,
      });
    }

    return dataset;
  };

  const ValidateYearData = datas => {
    const dataset = [];
    const monthsOfYear = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    // 데이터가 없으면 기본 값으로 채움
    if (!datas || datas.length === 0) {
      for (let i = 0; i < 12; i++) {
        dataset.push({
          value: 0,
          label: monthsOfYear[i],
        });
      }
      return dataset;
    }

    // 데이터의 month를 키로 하는 맵 생성
    const dataMap = datas.reduce((acc, item) => {
      const monthIndex = parseInt(item.month.split('-')[1], 10) - 1;
      acc[monthIndex] = item.totalDistance / 1000; // 거리 값을 킬로미터로 변환
      return acc;
    }, {});

    // 모든 월을 데이터로 채움
    for (let i = 0; i < 12; i++) {
      dataset.push({
        value: dataMap[i] || 0, // 데이터가 없으면 0으로 채움
        label: monthsOfYear[i],
      });
    }

    return dataset;
  };

  // 컴포넌트가 마운트될 때 데이터를 가져옴
  useEffect(() => {
    fetchWalkHistory(); // 데이터 가져오기
  }, []);

  // weeklyWalkHistory 데이터가 변경될 때 데이터 설정
  useEffect(() => {
    setData(ValidateWeekData(weeklyWalkHistory));
  }, [weeklyWalkHistory]);

  const showData = text => {
    setView(text);
    if (text === 'week') {
      setData(ValidateWeekData(weeklyWalkHistory));
    } else if (text === 'month') {
      setData(ValidateMonthData(monthlyWalkHistory));
    } else {
      setData(ValidateYearData(yearlyWalkHistory));
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
      {data && data.length > 0 && view === 'week' && (
        <BarChart
          data={data}
          barWidth={24}
          barBorderRadius={4}
          frontColor="#A2AA7B"
          height={200}
          initialSpacing={7}
          yAxisThickness={0}
          xAxisThickness={0}
          noOfSections={3}
          disablePress
        />
      )}
      {data && data.length > 0 && view === 'month' && (
        <BarChart
          data={data}
          barWidth={2}
          barBorderRadius={4}
          frontColor="#A2AA7B"
          textFontSize={10}
          height={200}
          initialSpacing={5}
          yAxisThickness={0}
          xAxisThickness={0}
          noOfSections={3}
          spacing={8}
          disablePress
        />
      )}
      {data && data.length > 0 && view === 'year' && (
        <BarChart
          data={data}
          barWidth={10}
          barBorderRadius={4}
          frontColor="#A2AA7B"
          height={200}
          initialSpacing={5}
          yAxisThickness={0}
          xAxisThickness={0}
          noOfSections={3}
          spacing={17}
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
