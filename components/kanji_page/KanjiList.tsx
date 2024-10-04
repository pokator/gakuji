import React, { useLayoutEffect, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { APIClient } from "../../api-client/api"; // API client initialized
import { supabase } from "../../lib/supabase"; // Supabase client initialized

interface KanjiCardProps {
  kanji: string;
  navigation: any;
  type: string;
  data: DataItem;
  renderAdditionalContent: () => React.ReactNode;
}

const KanjiCard: React.FC<KanjiCardProps> = ({
  kanji,
  navigation,
  type,
  data,
  renderAdditionalContent,
}) => {
  const handlePress = () => {
    navigation.navigate("IndividualKanjiView", {
      kanji,
      type,
      data,
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.cardContent}>
        <Text style={styles.kanji}>{kanji}</Text>
        {renderAdditionalContent()}
      </View>
    </TouchableOpacity>
  );
};

interface KanjiListProps {
  data: DataItem[];
  navigation: any;
  type: string;
}

interface DataItem {
  artist: string;
  title: string;
  value: string;
  wordData: {
    definitions: Array<{ pos: string[]; definition: string[] }>;
    furigana: string;
    romaji: string;
    word: string;
  };
}

const KanjiList: React.FC<KanjiListProps> = ({ data, navigation, type }) => {
  const renderKanjiCard = (item: DataItem) => {
    const { meanings, readings_kun, readings_on } = item.wordData || {};

    const displayedMeanings = meanings ? meanings.slice(0, 2) : [];
    const displayedKunReadings = readings_kun ? readings_kun.slice(0, 2) : [];
    const displayedOnReadings = readings_on ? readings_on.slice(0, 2) : [];

    return (
      <View>
        <Text>{displayedMeanings.join(", ")}</Text>
        <Text>
          {[...displayedKunReadings, ...displayedOnReadings].join(", ")}
        </Text>
      </View>
    );
  };

  const renderWordCard = (item: DataItem) => {
    const { definitions, furigana, romaji } = item.wordData || {};

    return (
      <View>
        {definitions &&
          definitions.slice(0, 1).map((def, index) => (
            <View key={index} style={{ marginBottom: 8 }}>
              <Text>POS: {def.pos.join(", ")}</Text>
              <Text>Definition: {def.definition.join(", ")}</Text>
            </View>
          ))}

        <Text>{[furigana, romaji].filter(Boolean).join(", ")}</Text>
      </View>
    );
  };

  return (
    <FlatList
      contentContainerStyle={styles.listContainer}
      data={data}
      numColumns={1}
      renderItem={({ item }) => (
        <KanjiCard
          kanji={type === "kanji" ? item.value : item.wordData.word}
          navigation={navigation}
          type={type}
          data={item}
          renderAdditionalContent={() =>
            type === "kanji" ? renderKanjiCard(item) : renderWordCard(item)
          }
        />
      )}
      keyExtractor={(item) => `${item.title}-${item.artist}-${item.value}`}
    />
  );
};

export function KanjiListView({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const { id, title, type } = route.params;

  const [list, setList] = useState<DataItem[]>([]);

  const initializeApiClient = async () => {
    const { data: { session } } = await supabase.auth.getSession();
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
        const response = await apiClient.getAList(id);
        const listData = response["data"];

        const updatedList = await Promise.all(
          listData.map(async (item) => {
            try {
              const wordData = await apiClient.getWordData(item.value);
              return {
                ...item,
                wordData,
              };
            } catch (error) {
              console.error(
                `Error fetching word data for item: ${item.value}`,
                error
              );
              return null;
            }
          })
        );

        const validList = updatedList.filter(
          (item): item is DataItem => item !== null
        );
        setList(validList);

        console.log("Updated list with word data:", validList);
      }
    } catch (error) {
      console.error("Failed to fetch list or word data:", error);
      setList([]);
    }
  };

  useEffect(() => {
    onGetList();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `${title}`,
    });
  }, [navigation, title]);

  return (
    <View style={styles.container}>
      <KanjiList data={list} navigation={navigation} type={type} />
    </View>
  );
}

const screenWidth = Dimensions.get("window").width;
// const cardWidth = (screenWidth - 48) / 2; // Subtracting padding and margins

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  listContainer: {
    // alignSelf: "center", // Center cards horizontally
  },
  card: {
    // width: cardWidth,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 16,
    margin: 5,
    backgroundColor: "#f9f9f9",
    shadowColor: "#666",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  kanji: {
    fontSize: 32,
    fontWeight: "bold",
    marginRight: 16,
  },
  details: {
    flex: 1,
  },
  readings: {
    fontSize: 16,
    color: "#555",
  },
  meanings: {
    fontSize: 16,
    color: "#555",
  },
});
