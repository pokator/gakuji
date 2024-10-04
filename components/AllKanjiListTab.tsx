import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Searchbar } from "react-native-paper";
import { APIClient } from "../api-client/api"; // API client initialized
import { supabase } from "../lib/supabase"; // Supabase client initialized

interface CardProps {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  navigation: any;
}

const Card: React.FC<CardProps> = ({ id, title, subtitle, type, navigation }) => {
  const handlePress = () => {
    console.log(`Card with title: ${title} was pressed`);
    navigation.navigate("KanjiListView", {
      id: id,
      title: title,
      type: type,
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <Text style={styles.type}>{type}</Text>
      </View>
    </TouchableOpacity>
  );
};

interface DataItem {
  list_name: string;
  type: string;
  id: string;
}

export function KanjiView({ navigation }: { navigation: any }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [lists, setLists] = useState<DataItem[] | null>([]); // Ensure lists is an array or null
  const [lastFetchedList, setLastFetchedList] = useState<DataItem[] | null>(null);

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
        const response = await apiClient.getLists();
        if (JSON.stringify(response["data"]) !== JSON.stringify(lastFetchedList)) {
          setLastFetchedList(response["data"]);
          setLists(response["data"]);
        }
        // setLists(response["data"]);
      }
    } catch (error) {
      console.error("Failed to fetch songs:", error);
    }
  };

  // Fetch the songs when the component mounts
  useLayoutEffect(() => {
    onGetList();
  }, []);

  // Ensure lists is not null before filtering
  const filteredData = lists
    ? lists.filter((item) =>
        item.list_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {/* Show a loading message if lists is null */}
      {lists === null ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={filteredData}
          numColumns={2}
          renderItem={({ item }) => (
            <Card
              id={item.id}
              title={item.list_name}
              subtitle={"asdf"}
              type={item.type}
              navigation={navigation}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
}

const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - 48) / 2; // Subtracting padding and margins

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  listContainer: {
    alignSelf: "center", // Center cards horizontally
  },
  searchBar: {
    height: 40,
    width: "100%", // Set search bar width to 100% of parent
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  card: {
    width: cardWidth,
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
  },
  type: {
    fontSize: 16,
    color: "#555",
    fontWeight: "bold",
  },
});
