import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {BarChart} from 'react-native-gifted-charts';

const CustomButton = ({title, isSelected, onPress}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, isSelected && styles.selectedButton]}>
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
};

const ActivityChart = ({
  weeklyWalkHistory,
  monthlyWalkHistory,
  yearlyWalkHistory,
}) => {
  const [view, setView] = useState('week');
  const [data, setData] = useState([]);

  // 데이터를 chart에 넣기 위해 label,value 쌍으로 수정
  // 주, 월, 년 다르게 설정...
  const ValidateWeekData = datas => {
    const dataset = [];
    // 요일 배열 (일요일이 0부터 시작)
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    for (let i = 0; i < datas.length; i++) {
      // walkDate를 Date 객체로 변환
      const date = new Date(datas[i].walkDate);
      dataset.push({
        value: datas[i].totalDistance, // totalDistance 사용
        label: daysOfWeek[date.getDay()], // 요일로 변환
      });
    }
    for (let i = datas.length; i < 7; i++) {
      dataset.push({
        value: 0, // totalDistance 사용
        label: daysOfWeek[date.getDay()], // 요일로 변환
      });
    }
    return dataset;
    // 반대로 나오는 경우 : return dataset.reverse();
  };

  const ValidateMonthData = datas => {
    const dataset = [];

    // 실제 데이터 있는 부분 처리
    for (let i = 0; i < datas.length; i++) {
      dataset.push({
        value: datas[i].totalDistance,
        label: null, // 7, 14, 21, 28일에만 label 추가
      });
    }

    // 데이터가 없는 나머지 부분 처리
    for (let i = datas.length; i < 31; i++) {
      dataset.push({
        value: 0,
        label: null, // 7, 14, 21, 28일에만 label 추가
      });
    }

    return dataset;
  };

  const ValidateYearData = datas => {
    const dataset = [];
    // 요일 배열 (일요일이 0부터 시작)
    const monthsOfYear = [
      'Jan',
      'Fab',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Nov',
      'Oct',
      'Sep',
      'Dec',
    ];
    // 역시 자바스크립트...
    const startMonth = datas[0].month.slice(-2) - 0;
    const endMonth = datas[datas.length - 1].month.slice(-2) - 0;

    for (let i = 0; i < endMonth - 1; i++) {
      dataset.push({
        value: 0, // totalDistance 사용
        label: i + 1,
      });
    }

    for (let i = startMonth; i >= endMonth; i--) {
      dataset.push({
        value: datas[i - endMonth].totalDistance, // totalDistance 사용
        label: i + 1,
      });
    }

    for (let i = startMonth; i < 12; i++) {
      dataset.push({
        value: 0, // totalDistance 사용
        label: i + 1,
      });
    }
    return dataset;
    // 반대로 나오는 경우 : return dataset.reverse();
  };

  useEffect(() => {
    // 초기에는 1주일 데이터를 표시
    setData(ValidateWeekData(weeklyWalkHistory));
  }, []);

  const showData = text => {
    setView(text);
    if (text === 'week') {
      // 최근 데이터로부터 1주일 데이터
      setData(ValidateWeekData(weeklyWalkHistory));
    } else if (text === 'month') {
      // 한달 치
      setData(ValidateMonthData(monthlyWalkHistory));
    } else {
      // 월 단위 기록
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
