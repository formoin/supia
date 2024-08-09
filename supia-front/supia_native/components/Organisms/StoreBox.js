import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Modal, Button, TouchableOpacity } from "react-native";
import Button_Green from "../Atoms/Button_Green";
import Line from "../Atoms/Line";
import Popup_Buy from "../Popup_Buy";
import useStore from "../store/useStore";
import Entypo from 'react-native-vector-icons/Entypo';

export default function StoreBox({ name, background, music, point, id, level }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { getS3Url } = useStore();

  const isBackground = Boolean(background);
  const item = isBackground ? background : music;

  // Determine if the user's level is sufficient
  const canPurchase = level >= item.level;

  const goBuy = () => {
    if (!canPurchase) {
      alert("레벨이 부족합니다!");
      return;
    }
    if (point - item.price < 0) {
      alert("포인트가 부족합니다!");
      console.log(point - item.price);
    } else {
      setIsModalVisible(!isModalVisible);
    }
  };

  return (
 <View>
   <View style={styles.container}>
     {isBackground ? (
       <Image
         source={{ uri: getS3Url(item.path) }}
         style={styles.image}
       />
     ) : (
       <View>
         <Entypo name="beamed-note" size={35} style={styles.soundIcon} />
       </View>
     )}
     <View style={styles.textContainer}>
       <Text style={styles.textbig}>{name}</Text>
       <Text style={styles.textsmall}>{item.price} P</Text>
     </View>
     <View style={styles.button}>
       {canPurchase ? (
         <Button_Green label="구매하기" onPress={goBuy} />
       ) : (
        <TouchableOpacity style={styles.disabledButton} disabled={true}>
          <Text style={styles.disabledButtonText}>Lv.{item.level}</Text>
        </TouchableOpacity>
       )}
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
         <Popup_Buy goBuy={goBuy} background={background} music={music} point={point} id={id} />
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
  soundIcon: {
    color: 'black',
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
  disabledButton: {
    width: 72,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 5,
    backgroundColor: 'lightgray',
    paddingBottom: 3,
  },
  disabledButtonText: {
    color: 'darkgray',
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
