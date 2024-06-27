import React, { useLayoutEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

interface KanjiDetailProps {
  kanji: string;
  readings: string[];
  meanings: string[];
}

const KanjiDetailView: React.FC<KanjiDetailProps> = ({
  kanji,
  readings,
  meanings,
}) => {
  return (
    <ScrollView contentContainerStyle={styles.detailContainer}>
      <Text style={styles.detailKanji}>{kanji}</Text>
      <Text style={styles.detailReadings}>Readings: {readings.join(", ")}</Text>
      <Text style={styles.detailMeanings}>Meanings: {meanings.join(", ")}</Text>
      <Text style={styles.detailSectionTitle}>Example Words:</Text>
      {/* {exampleWords.map((word: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, index: React.Key | null | undefined) => (
        <Text key={index} style={styles.exampleWord}>
          {word}
        </Text>
      ))} */}
      {/* Placeholder for generated sentences */}
      <Text style={styles.detailSectionTitle}>Example Sentences:</Text>
      {/* Example sentences would be fetched and displayed here */}
    </ScrollView>
  );
};

export function IndividualKanjiView({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const { kanji, readings, meanings, type } = route.params;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `${type}: ${kanji}`,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <KanjiDetailView kanji={kanji} readings={readings} meanings={meanings} />
    </View>
  );
}

const styles = StyleSheet.create({
  detailContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  detailKanji: {
    fontSize: 64,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  detailReadings: {
    fontSize: 24,
    color: "#333",
    marginBottom: 8,
  },
  detailMeanings: {
    fontSize: 24,
    color: "#333",
    marginBottom: 16,
  },
  detailSectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
  },
  exampleWord: {
    fontSize: 18,
    color: "#555",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
});
