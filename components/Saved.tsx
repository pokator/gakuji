import React, { useState, useEffect, useRef } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Card } from "./Card";
import AddButton from "./AddButton";
import { PaperProvider, Text } from "react-native-paper";
import { APIClient } from "../api-client/api";
import { supabase } from "../lib/supabase";
import { SafeAreaView } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  button: {
    position: "relative",
  },
  noSongs: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export function Saved({ navigation }) {
  const [songs, setSongs] = useState([]); // State to hold the song list
  const [loadingSongs, setLoadingSongs] = useState({}); // Loading state for individual songs
  const pollingInterval = useRef(null); // Ref to store the polling interval ID

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

  const fetchWordMapping = async (song) => {
    try {
      const apiClient = await initializeApiClient();
      if (apiClient) {
        const response = await apiClient.getSong(song.title, song.artist);
        return response.word_mapping;
      }
    } catch (error) {
      console.error("Failed to fetch word mapping:", error);
    }
    return null;
  };

  const onGetSongList = async () => {
    try {
      const apiClient = await initializeApiClient();
      if (apiClient) {
        const response = await apiClient.getSongs();

        // Only update songs if new ones are added, otherwise preserve the current state
        setSongs((prevSongs) => {
          const newSongs = response.filter(
            (song) => !prevSongs.some((prevSong) => prevSong.title === song.title && prevSong.artist === song.artist)
          );
          return [...prevSongs, ...newSongs]; // Append only the new songs
        });

        // Start polling for word mappings for any new songs
        const newlyAddedSongs = response.filter(
          (song) => !songs.some((existingSong) => existingSong.title === song.title && existingSong.artist === song.artist)
        );
        
        if (newlyAddedSongs.length > 0) {
          startPolling(newlyAddedSongs);
        }
      }
    } catch (error) {
      console.error("Failed to fetch songs:", error);
    }
  };

  const startPolling = (songsToPoll) => {
    // Clear any existing interval to avoid multiple polling instances
    if (pollingInterval.current) clearInterval(pollingInterval.current);

    pollingInterval.current = setInterval(async () => {
      const updatedLoadingSongs = {};
      let allLoaded = true;

      // Poll for word mapping for each song
      const updatedSongs = await Promise.all(
        songsToPoll.map(async (song) => {
          const songKey = `${song.title}-${song.artist}`;
          const wordMapping = await fetchWordMapping(song);
          if (wordMapping !== null) {
            return { ...song, wordMapping };
          } else {
            updatedLoadingSongs[songKey] = true;
            allLoaded = false;
            return song;
          }
        })
      );

      // Update the song list and loading state
      setSongs((prevSongs) => {
        const updatedSongList = prevSongs.map((prevSong) => {
          const updatedSong = updatedSongs.find((song) => song.title === prevSong.title && song.artist === prevSong.artist);
          return updatedSong || prevSong;
        });
        return updatedSongList;
      });
      setLoadingSongs(updatedLoadingSongs);

      // If all songs are loaded, stop polling
      if (allLoaded) {
        clearInterval(pollingInterval.current);
        pollingInterval.current = null;
      }
    }, 3000); // Poll every 3 seconds
  };

  useEffect(() => {
    onGetSongList(); // Initial fetch when the component is mounted

    return () => {
      // Clear interval when component unmounts to avoid memory leaks
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, []); // Run only once when the component mounts

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        {songs.length === 0 ? (
          <View style={styles.noSongs}>
            <Text>No Songs Yet Added (Add a song using the add button below)</Text>
          </View>
        ) : (
          <FlatList
            data={songs}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.getParent().getParent().navigate("LyricsView", {
                    artist: item.artist,
                    title: item.title,
                  })
                }
                disabled={!item.wordMapping} // Disable if wordMapping is null
              >
                <Card
                  title={item.title}
                  artist={item.artist}
                  uri={item.SongData.image_url}
                  loading={loadingSongs[`${item.title}-${item.artist}`] || item.wordMapping === null} // Show loading animation if loading
                />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => `${item.title}-${item.artist}`}
          />
        )}
        <View style={styles.button}>
          <AddButton navigation={navigation} refreshList={onGetSongList} />
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}

export default Saved;
