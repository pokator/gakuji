import React, { useState } from "react";
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

interface CardProps {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  navigation: any;
}

const Card: React.FC<CardProps> = ({id, title, subtitle, type, navigation }) => {
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
  id: string;
  title: string;
  subtitle: string;
  type: string;
}

const dummyData: DataItem[] = [
  { id: "1", title: "All Kanji", subtitle: "123 Kanji", type: "漢字" },
  { id: "2", title: "Card 2", subtitle: "Subtitle 2", type: "言葉" },
  { id: "3", title: "Card 3", subtitle: "Subtitle 3", type: "漢字" },
  { id: "4", title: "Card 4", subtitle: "Subtitle 4", type: "言葉" },
  // Add more dummy data as needed
];

export function KanjiView({ navigation }: { navigation: any }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = dummyData.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={filteredData}
        numColumns={2}
        renderItem={({ item }) => (
          <Card
            id={item.id}
            title={item.title}
            subtitle={item.subtitle}
            type={item.type}
            navigation={navigation}
          />
        )}
        keyExtractor={(item) => item.id}
      />
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

// export default KanjiView;
