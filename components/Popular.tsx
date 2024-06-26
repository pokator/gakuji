import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Card } from "./Card"; // Assuming Card component is in a separate file

const data = [
  {
    id: 1,
    title: "Song 1",
    artist: "Artist 1",
    albumCover: "https://example.com/cover1.jpg",
  },
  {
    id: 2,
    title: "Song 2",
    artist: "Artist 2",
    albumCover: "https://example.com/cover2.jpg",
  },
  // Add more songs as needed
];

export function Popular({ navigation }: { navigation: any }) {
  const [searchQuery, setSearchQuery] = useState("");

  const [filteredData, setFilteredData] = useState<
    { id: number; title: string; artist: string; albumCover: string }[]
  >([]);

  useEffect(() => {
    // Filter data based on search query
    const filtered = data.filter(
      (song) =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery]);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleCardPress(item)}>
      <Card song={item} />
    </TouchableOpacity>
  );

  const handleCardPress = (song) => {
    // Function stub for handling card press
    // Fill in with your desired functionality
    console.log("Clicked on:", song.title);
    // Example: navigation.navigate('SongDetails', { songId: song.id });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
});

export default Popular;
