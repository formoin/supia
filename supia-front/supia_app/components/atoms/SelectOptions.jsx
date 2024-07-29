import DropDownPicker from 'react-native-dropdown-picker';
import { StyleSheet } from "react-native";
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';

export default function SelectOptions() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('name');
  const [items, setItems] = useState([
    {label: '레벨 순', value: 'level'},
    {label: '이름순', value: 'name'}
  ]);

  return (
    <DropDownPicker
      open={open} // 드롭다운의 열림/닫힘 상태를 제어합니다.
      value={value} // 현재 선택된 값을 설정합니다.
      items={items} // 드롭다운에 표시될 항목들을 설정합니다.
      setOpen={setOpen} // 드롭다운의 열림/닫힘 상태를 변경하는 함수를 설정합니다.
      setValue={setValue} // 선택된 값을 변경하는 함수를 설정합니다.
      setItems={setItems} // 드롭다운 항목들을 변경하는 함수를 설정합니다.
      textStyle={{ fontSize: 12 }}
      style={styles.dropdown}
      TickIconComponent={() => (
        <FontAwesome name="check" size={12} color="black" />
      )}
      ArrowDownIconComponent={() => (
        <FontAwesome name="angle-down" size={14} color="black" />
      )}
      ArrowUpIconComponent={() => (
        <FontAwesome name="angle-up" size={14} color="black" />
      )}
    />
  );
}

const styles = StyleSheet.create({
  dropdown: {
    width: 85,
    height: 8,
    borderRadius: 10,
    minHeight: 30,
  },
})