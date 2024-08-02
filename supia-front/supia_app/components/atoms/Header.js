import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Header({ label }) {
  const navigation = useNavigation();

  const onPressBackIcon = () => {
    navigation.goBack();
  }

  return (
    <View style={styles.HeaderContainer}>
      {label !== "배경" && (
        <Pressable onPress={onPressBackIcon}>
          <Entypo
            name="chevron-small-left"
            size={24}
            style={styles.BackIcon}
          />
        </Pressable>
      )}
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  HeaderContainer: {
    flexDirection: 'row',
    width: 360,
    paddingHorizontal: 18,
    alignItems: 'center',
    paddingTop: 20
  },
  BackIcon: {
    marginRight: 10,
  },
  label: {
    flex: 1,
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
  },
});
