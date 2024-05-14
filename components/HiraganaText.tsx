import React from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";

interface ClickableTextProps {
  lyrics: string[];
}

export const HiraganaText: React.FC<ClickableTextProps> = ({ lyrics }) => {
  return (
    <View style={styles.container}>
      {lyrics.map((line, lineIndex) => (
        <View key={lineIndex} style={{ flexDirection: "row", flexWrap: "nowrap" }}>
          <Text style={{ fontSize: 18 }}>{line} </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
});
