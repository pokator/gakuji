import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

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
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  artist: {
    fontSize: 16,
  },
});

export function Card({ title, artist, uri }: { title: string, artist: string, uri: string }) {
  return (
    <View style={styles.card}>
      <Image
        style={styles.albumCover}
        source={{ uri: uri }}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.artist}>{artist}</Text>
      </View>
    </View>
  );
}