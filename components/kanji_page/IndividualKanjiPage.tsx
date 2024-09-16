import React, { useLayoutEffect, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { APIClient } from "../../api-client/api"; // API client initialized
import { supabase } from "../../lib/supabase"; // Supabase client initialized
import { Card } from "../Card";
import { TouchableOpacity } from "react-native-gesture-handler";

interface KanjiDetailProps {
  type: string;
  kanji: string;
  wordData: any; // The complete data object passed from the previous screen
}

const KanjiDetailView: React.FC<KanjiDetailProps> = ({
  type,
  kanji,
  wordData,
}) => {
  if (type === "kanji") {
    // For Kanji, display JLPT level, meanings, radicals, readings
    const { jlpt_new, meanings, radicals, readings_kun, readings_on } =
      wordData;

    return (
      <ScrollView contentContainerStyle={styles.detailContainer}>
        <Text style={styles.detailKanji}>{kanji}</Text>
        <Text style={styles.detailRow}>JLPT Level: {jlpt_new}</Text>
        <Text style={styles.detailRow}>Meanings: {meanings.join(", ")}</Text>
        <Text style={styles.detailRow}>Radicals: {radicals.join(", ")}</Text>
        <Text style={styles.detailRow}>
          Kun Readings: {readings_kun.join(", ")}
        </Text>
        <Text style={styles.detailRow}>
          On Readings: {readings_on.join(", ")}
        </Text>
      </ScrollView>
    );
  } else if (type === "word") {
    // For words, display furigana, romaji, and definitions
    const { furigana, romaji, definitions } = wordData;

    return (
      <ScrollView contentContainerStyle={styles.detailContainer}>
        <Text style={styles.detailKanji}>{kanji}</Text>
        <Text style={styles.detailRow}>Furigana: {furigana}</Text>
        <Text style={styles.detailRow}>Romaji: {romaji}</Text>
        <Text style={styles.detailSectionTitle}>Definitions:</Text>
        {definitions.map((def: any, index: number) => (
          <View key={index} style={styles.definitionContainer}>
            <Text style={styles.detailRow}>POS: {def.pos.join(", ")}</Text>
            <Text style={styles.detailRow}>
              Definition: {def.definition.join(", ")}
            </Text>
          </View>
        ))}
      </ScrollView>
    );
  }

  return null;
};

export function IndividualKanjiView({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const { kanji, type, data } = route.params; // 'data' contains the full wordData object
  const { wordData } = data; // This is where the specific kanji or word data is located

  const [image_url, setImageUrl] = useState("https://via.placeholder.com/150");

  // Initialize API client with the access token
  const initializeApiClient = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      const apiClient = new APIClient(session.access_token);
      return apiClient;
    }
    return null;
  };

  const onGetList = async () => {
    try {
      const apiClient = await initializeApiClient();
      if (apiClient) {
        const response = await apiClient.getImageData(data.title, data.artist);
        if (response) setImageUrl(response.image_url);
      }
    } catch (error) {
      console.error("Failed to fetch image URL:", error);
    }
  };

  // Fetch the songs when the component mounts
  useEffect(() => {
    onGetList();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `${type}: ${kanji}`,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <KanjiDetailView kanji={kanji} type={type} wordData={wordData} />
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("LyricsView", {
            artist: data["artist"],
            title: data["title"],
          })
        }
      >
        <Card title={data.title} artist={data.artist} uri={image_url} />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  detailContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  detailKanji: {
    fontSize: 64,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  detailRow: {
    fontSize: 20,
    color: "#333",
    marginBottom: 8,
  },
  detailSectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 16,
  },
  definitionContainer: {
    marginVertical: 8,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
});

// const styles = StyleSheet.create({
//   detailContainer: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: "#fff",
//   },
//   detailKanji: {
//     fontSize: 64,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginVertical: 16,
//   },
//   detailReadings: {
//     fontSize: 24,
//     color: "#333",
//     marginBottom: 8,
//   },
//   detailMeanings: {
//     fontSize: 24,
//     color: "#333",
//     marginBottom: 16,
//   },
//   detailSectionTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginTop: 16,
//   },
//   exampleWord: {
//     fontSize: 18,
//     color: "#555",
//   },
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: "#fff",
//   },
// });
