import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Modal } from "react-native";
import Button from "../atoms/Button_Green";
import Line from "../atoms/Line";
import Popup_Buy from "../Popup_Buy";

export default function StoreBox({ name }) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const goBuy = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View>
      <View style={styles.container}>
        <Image
          source={{ uri: '<path-to-image>' }}
          style={styles.image}
        />
        <View style={styles.textContainer}>
          <Text style={styles.textbig}>{name}</Text>
          <Text style={styles.textsmall}>200 P</Text>
        </View>
        <View style={styles.button}>
          <Button label="구매하기" onPress={goBuy} />
        </View>
      </View>
      <View style={styles.line}>
        <Line />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={goBuy}
      >
        <View style={styles.popupContainer}>
          <View style={styles.popup}>
            <Popup_Buy goBuy={goBuy} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 15,
    backgroundColor: 'lightgray',
    marginRight: 12,
    marginLeft: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 15,
  },
  textbig: {
    fontSize: 18,
    marginBottom: 8,
  },
  textsmall: {
    fontSize: 16,
  },
  button: {
    marginRight: 20,
  },
  line: {
    alignItems: 'center',
  },
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: to dim the background
  },
  popup: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

