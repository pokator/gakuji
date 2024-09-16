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
  data: any;
  renderAdditionalContent?: () => React.ReactNode;
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
        {renderAdditionalContent && renderAdditionalContent()}
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
  wordData: any;
}

// const dummyData: DataItem[] = [
//   {
//     id: "1",
//     kanji: "日",
//     readings: ["にち", "じつ"],
//     meanings: ["day", "sun"],
//   },
//   {
//     id: "2",
//     kanji: "月",
//     readings: ["げつ", "がつ"],
//     meanings: ["month", "moon"],
//   },
//   { id: "3", kanji: "火", readings: ["か"], meanings: ["fire"] },
//   { id: "4", kanji: "水", readings: ["すい"], meanings: ["water"] },
//   // Add more dummy data as needed
// ];

const KanjiList: React.FC<KanjiListProps> = ({ data, navigation, type }) => {
  const renderKanjiCard = (item: DataItem) => {
    const { meanings, readings_kun, readings_on } = item.wordData || {};

    // Get at most two meanings
    const displayedMeanings = meanings ? meanings.slice(0, 2) : [];
    // Get at most two readings from each type
    const displayedKunReadings = readings_kun ? readings_kun.slice(0, 2) : [];
    const displayedOnReadings = readings_on ? readings_on.slice(0, 2) : [];

    return (
      <View>
        <Text>{displayedMeanings.join(", ")}</Text>
        <Text>{[...displayedKunReadings, ...displayedOnReadings].join(", ")}</Text>
      </View>
    );
  };

  const renderWordCard = (item: DataItem) => {
    const { definitions, furigana, romaji } = item.wordData || {};
  
    // Get at most two furigana and two romaji
    const displayedFurigana = furigana ? furigana.slice(0, 2) : [];
    const displayedRomaji = romaji ? romaji.slice(0, 2) : [];
  
    // Get at most two definitions
    const displayedDefinitions = definitions ? definitions.slice(0, 2) : [];
  
    return (
      <View>
        {/* Display definitions */}
        {displayedDefinitions.map((def: any, index: number) => (
          <View key={index} style={{ marginBottom: 8 }}>
            <Text>POS: {def.pos.join(", ")}</Text> {/* Join POS array */}
            <Text>Definition: {def.definition.join(", ")}</Text> {/* Join definition array */}
          </View>
        ))}
        
        {/* Display furigana and romaji */}
        <Text>{[...displayedFurigana, ...displayedRomaji].join(", ")}</Text>
      </View>
    );
  };
  

  return (
    <FlatList
      contentContainerStyle={styles.listContainer}
      data={data}
      numColumns={1}
      renderItem={({ item }) =>
        type === "kanji" ? (
          <KanjiCard
            kanji={item.value}
            navigation={navigation}
            type={type}
            data={item}
            renderAdditionalContent={() => renderKanjiCard(item)}
          />
        ) : (
          <KanjiCard
            kanji={item.value}
            navigation={navigation}
            type={type}
            data={item}
            renderAdditionalContent={() => renderWordCard(item)}
          />
        )
      }
      keyExtractor={(item) =>
        `${item["title"]}-${item["artist"]}-${item["value"]}`
      }
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

  const [list, setList] = useState<DataItem[] | null>([]); // Ensure lists is an array or null

  // Initialize API client with the access token
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
  
        // Fetch word data for each item in the list
        const updatedList = await Promise.all(
          listData.map(async (item) => {
            // Get word data for the item's value
            const wordData = await apiClient.getWordData(item.value);
  
            // Add the word data to the item
            return {
              ...item,
              wordData, // Add wordData to the item
            };
          })
        );
  
        // Update the state with the modified list
        setList(updatedList);
  
        // Log the modified list to the console
        console.log("Updated list with word data:", updatedList);
      }
    } catch (error) {
      console.error("Failed to fetch list or word data:", error);
    }
  };
  

  // Fetch the songs when the component mounts
  useEffect(() => {
    onGetList();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `${title}`,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <KanjiList data={list} navigation={navigation} type={type}/>
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
