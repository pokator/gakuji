import React, { useState, useEffect, useRef } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity, Pressable } from "react-native";
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
  noSongText: {
    fontSize: 15,
    color: "darkgrey",
    textAlign: "center",
    marginHorizontal: 20,
  },
});

export function Saved({ navigation }) {
  const [songs, setSongs] = useState([]); 
  const [loadingSongs, setLoadingSongs] = useState({});
  const pollingInterval = useRef(null);

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
        return response?.word_mapping || null;
      }
    } catch (error) {
      console.error("Failed to fetch word mapping:", error);
    }
    return null;
  };

  const onGetSongList = async () => {
    try {
      const apiClient = await initializeApiClient();
      if (!apiClient) return;

      const response = await apiClient.getSongs();
      
      if (!Array.isArray(response) || response.length === 0) return;

      // For each song in the response, check if it needs word mapping
      const songsToUpdate = [];
      const initialLoadingState = {};

      response.forEach(song => {
        // If the song doesn't have word_mapping, mark it for polling
        if (!song.word_mapping) {
          const songKey = `${song.title}-${song.artist}`;
          initialLoadingState[songKey] = true;
          songsToUpdate.push(song);
        }
      });

      // Update loading states first
      setLoadingSongs(initialLoadingState);

      // Update songs state
      setSongs((prevSongs) => {
        const newSongs = response.filter(
          (song) => !prevSongs.some(
            (prevSong) => prevSong.title === song.title && prevSong.artist === song.artist
          )
        );
        return [...prevSongs, ...newSongs];
      });

      // Only start polling for songs that need word mapping
      if (songsToUpdate.length > 0) {
        startPolling(songsToUpdate);
      }
    } catch (error) {
      console.error("Failed to fetch songs:", error);
    }
  };

  const startPolling = (songsToPoll) => {
    if (pollingInterval.current) clearInterval(pollingInterval.current);

    pollingInterval.current = setInterval(async () => {
      const updatedLoadingSongs = {};
      let allLoaded = true;

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

      setSongs((prevSongs) => {
        const updatedSongList = prevSongs.map((prevSong) => {
          const updatedSong = updatedSongs.find(
            (song) => song.title === prevSong.title && song.artist === prevSong.artist
          );
          return updatedSong || prevSong;
        });
        return updatedSongList;
      });
      setLoadingSongs(updatedLoadingSongs);

      if (allLoaded) {
        clearInterval(pollingInterval.current);
        pollingInterval.current = null;
      }
    }, 3000);
  };

  useEffect(() => {
    onGetSongList();
    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, []);

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        {songs.length === 0 ? (
          <View style={styles.noSongs}>
            <Text style={styles.noSongText}>No Songs Yet Added (Add a song using the add button below)</Text>
          </View>
        ) : (
          <FlatList
            data={songs}
            renderItem={({ item }) => {
              const songKey = `${item.title}-${item.artist}`;
              const isLoading = loadingSongs[songKey] && !item.wordMapping;
              
              return (
                <Pressable
                  onPress={() =>
                    navigation.getParent().getParent().navigate("LyricsView", {
                      artist: item.artist,
                      title: item.title,
                    })
                  }
                  disabled={isLoading}
                >
                  <Card
                    title={item.title}
                    artist={item.artist}
                    uri={item.SongData?.image_url}
                    loading={isLoading}
                  />
                </Pressable>
              );
            }}
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