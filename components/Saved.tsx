import React, { useState, useEffect, useCallback, useLayoutEffect } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Card } from "./Card";
import AddButton from "./AddButton";
import { PaperProvider } from "react-native-paper";
import { APIClient } from "../api-client/api"; // API client initialized
import { supabase } from "../lib/supabase"; // Supabase client initialized
import { SafeAreaView } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  button: {
    position: "relative",
  }
});

export function Saved({ navigation }: { navigation: any }) {
  const [songs, setSongs] = useState([]);
  const [lastFetchedSongs, setLastFetchedSongs] = useState([]);

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
  useLayoutEffect(() => {
    onGetSongList();
  }, []);

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
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
        <View style={styles.button}>
          <AddButton navigation={navigation} refreshList={onGetSongList} />
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}

export default Saved;
