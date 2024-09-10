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
import { APIClient } from "../api-client/api"; // API client initialized
import { supabase } from "../lib/supabase"; // Supabase client initialized

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

export function Popular({ navigation }: { navigation: any }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [allSongs, setAllSongs] = useState<
    { id: number; title: string; artist: string; albumCover: string }[]
  >([]);
  const [filteredData, setFilteredData] = useState<
    { id: number; title: string; artist: string; albumCover: string }[]
  >([]);

  // Initialize API client with the access token
  const initializeApiClient = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      const apiClient = new APIClient(session.access_token);
      return apiClient;
    }
    return null;
  };

  const onGetGlobalSongs = async () => {
    try {
      const apiClient = await initializeApiClient();
      if (apiClient) {
        const response = await apiClient.getGlobalSongs();
        setAllSongs(response);
      }
    } catch (error) {
      console.error("Failed to fetch global songs:", error);
    }
  };

  useEffect(() => {
    // Fetch global songs when the component mounts
    onGetGlobalSongs();
  }, []);

  useEffect(() => {
    // Filter data based on search query
    const filtered = allSongs.filter(
      (song) =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery, allSongs]); // Depend on both searchQuery and allSongs

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
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.getParent().getParent().navigate("LyricsView", {
                  artist: item["artist"],
                  title: item["title"],
                })
              }
            >
              <Card song={item} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => `${item["title"]}-${item["artist"]}`}
        />
    </View>
  );
}

export default Popular;
