import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Card } from "./Card";
import AddButton from "./AddButton";
import { PaperProvider } from "react-native-paper";
import { APIClient } from "../api-client/api"; // API client initialized
import { supabase } from "../lib/supabase"; // Supabase client initialized

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
});

export function Saved({ navigation }: { navigation: any }) {
  const [songs, setSongs] = useState([]);
  const [lastFetchedSongs, setLastFetchedSongs] = useState([]);

  // Initialize API client with the access token
  const initializeApiClient = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      const apiClient = new APIClient(session.access_token);
      return apiClient;
    }
    return null;
  };

  const onGetSongList = async () => {
    try {
      const apiClient = await initializeApiClient();
      if (apiClient) {
        const response = await apiClient.getSongs();

        // Compare the new response with the current state to avoid unnecessary re-renders
        if (JSON.stringify(response) !== JSON.stringify(lastFetchedSongs)) {
          setSongs(response);
          setLastFetchedSongs(response); // Update the last fetched songs
        }
      }
    } catch (error) {
      console.error("Failed to fetch songs:", error);
    }
  };

  // Fetch the songs when the component mounts
  useEffect(() => {
    onGetSongList();
  }, []);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <FlatList
          data={songs}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.getParent().getParent().navigate("LyricsView", {
                  artist: item["artist"],
                  title: item["title"],
                })
              }
            >
              <Card
                title={item["title"]}
                artist={item["artist"]}
                uri={item["SongData"]["image_url"]}
              />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => `${item["title"]}-${item["artist"]}`}
        />
        <AddButton navigation={navigation} refreshList={onGetSongList} />
      </View>
    </PaperProvider>
  );
}

export default Saved;
