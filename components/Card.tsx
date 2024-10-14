import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, Animated } from "react-native";

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  albumCover: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  textContainer: {
    marginLeft: 16,
    justifyContent: "space-around",
    flex: 1, // This ensures the text container takes up the remaining space
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  artist: {
    fontSize: 16,
  },
  animatedTextContainer: {
    overflow: 'hidden',
  },
});

const AnimatedText = ({ text, style, containerWidth }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const textWidth = useRef(0);

  useEffect(() => {
    if (textWidth.current > containerWidth) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scrollX, {
            toValue: -textWidth.current,
            duration: textWidth.current * 50, // Adjust speed here
            useNativeDriver: true,
          }),
          Animated.timing(scrollX, {
            toValue: containerWidth,
            duration: 0,
            useNativeDriver: true,
          })
        ])
      ).start();
    }
  }, [scrollX, containerWidth]);

  return (
    <View style={[styles.animatedTextContainer, { width: containerWidth }]}>
      <Animated.Text
        style={[
          style,
          {
            transform: [{ translateX: scrollX }],
            width: 'auto',
          },
        ]}
        onLayout={(event) => {
          textWidth.current = event.nativeEvent.layout.width;
        }}
      >
        {text}
      </Animated.Text>
    </View>
  );
};

export function Card({ title, artist, uri }) {
  const [textContainerWidth, setTextContainerWidth] = useState(0);

  return (
    <View style={styles.card}>
      <Image
        style={styles.albumCover}
        source={{ uri: uri }}
      />
      <View 
        style={styles.textContainer}
        onLayout={(event) => {
          setTextContainerWidth(event.nativeEvent.layout.width);
        }}
      >
        <AnimatedText
          text={title}
          style={styles.title}
          containerWidth={textContainerWidth}
        />
        <Text style={styles.artist}>{artist}</Text>
      </View>
    </View>
  );
}