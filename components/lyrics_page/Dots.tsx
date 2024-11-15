import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";

const Dots = ({ activeIndex }) => {
  const dotPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(dotPosition, {
      toValue: activeIndex,
      useNativeDriver: false,
    }).start();
  }, [activeIndex]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.dot,
          {
            backgroundColor: dotPosition.interpolate({
              inputRange: [0, 1, 2],
              outputRange: ["black", "lightgray", "lightgray"],
            }),
            width: dotPosition.interpolate({
              inputRange: [0, 1, 2],
              outputRange: [14, 10, 10],
            }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          {
            backgroundColor: dotPosition.interpolate({
              inputRange: [0, 1, 2],
              outputRange: ["lightgray", "black", "lightgray"],
            }),
            width: dotPosition.interpolate({
              inputRange: [0, 1, 2],
              outputRange: [10, 14, 10],
            }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          {
            backgroundColor: dotPosition.interpolate({
              inputRange: [0, 1, 2],
              outputRange: ["lightgray", "lightgray", "black"],
            }),
            width: dotPosition.interpolate({
              inputRange: [0, 1, 2],
              outputRange: [10, 10, 14],
            }),
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default Dots;
