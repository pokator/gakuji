import React, { useCallback } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";

interface ClickableTextProps {
  lyrics: string[];
}

export const HiraganaText: React.FC<ClickableTextProps> = ({ lyrics }) => {
  const renderLine = useCallback(
    ({ item: line, index: lineIndex }) => (
      <View key={lineIndex} style={styles.line}>
        <Text style={{ fontSize: 18 }}>{line} </Text>
      </View>
    ),
    [lyrics]
  );

  return (
    <FlatList
      data={lyrics}
      renderItem={renderLine}
      keyExtractor={(item, index) => `${index}`}
      style={styles.container}
      initialNumToRender={10}
      extraData={[lyrics]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    height: "100%",
  },
  line: {
    flexDirection: "row",
    flexWrap: "wrap", // Allow lines to wrap
    justifyContent: "center",
    alignContent: "center", // Center the lines horizontally
    marginVertical: 5, // Add vertical spacing between lines
  },
});
