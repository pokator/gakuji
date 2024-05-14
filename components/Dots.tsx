//
import React, { useEffect, useRef } from "react";
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";

const Dots = ({ activeIndex }) => {
  const dotPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(dotPosition, {
      toValue: activeIndex === 0 ? 0 : 1,
      useNativeDriver: false,
    }).start();
  }, [activeIndex]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.dot,
          styles.leftDot,
          {
            backgroundColor: dotPosition.interpolate({
              inputRange: [0, 1],
              outputRange: ["black", "lightgray"],
            }),
            width: dotPosition.interpolate({
              inputRange: [0, 1],
              outputRange: [14, 10], // Adjust width as desired
            }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          styles.rightDot,
          {
            backgroundColor: dotPosition.interpolate({
              inputRange: [0, 1],
              outputRange: ["lightgray", "black"],
            }),
            width: dotPosition.interpolate({
              inputRange: [0, 1],
              outputRange: [10, 14], // Adjust width as desired
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
  leftDot: {
    marginRight: 6,
  },
  rightDot: {
    marginLeft: 1,
  },
});

export default Dots;
