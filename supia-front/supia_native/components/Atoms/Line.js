import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

const Line = () => {
  return <View style={styles.line} />;
};

const styles = StyleSheet.create({
  line: {
    width: '100%',
    height: 1,
    borderWidth: 1,
    borderColor: "#A2AA7B",
    opacity: 1,
  },
});

export default Line;
