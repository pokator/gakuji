import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, TouchableOpacity } from "react-native";

interface DotsProps {
  activeIndex: number;
  dotScroll: (index: number) => void;
}

const Dots: React.FC<DotsProps> = React.memo(({ activeIndex, dotScroll }) => {
  const dotPosition = useRef(new Animated.Value(activeIndex)).current;

  useEffect(() => {
    Animated.spring(dotPosition, {
      toValue: activeIndex,
      useNativeDriver: false,
    }).start();
  }, [activeIndex]);

  const renderDot = (index) => (
    <TouchableOpacity key={index} onPress={() => dotScroll(index)}>
      <Animated.View
        style={[
          styles.dot,
          {
            backgroundColor: dotPosition.interpolate({
              inputRange: [0, 1, 2],
              outputRange: index === 0 ? ["black", "lightgray", "lightgray"]
                        : index === 1 ? ["lightgray", "black", "lightgray"]
                        : ["lightgray", "lightgray", "black"],
            }),
            width: dotPosition.interpolate({
              inputRange: [0, 1, 2],
              outputRange: index === 0 ? [14, 10, 10]
                        : index === 1 ? [10, 14, 10]
                        : [10, 10, 14],
            }),
          },
        ]}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {Array.from({ length: 3 }).map((_, index) => renderDot(index))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 10, // Increased spacing between dots
  },
});

export default Dots;
