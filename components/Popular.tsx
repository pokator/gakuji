import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Card } from "./Card";
import { APIClient } from "../api-client/api";
import { supabase } from "../lib/supabase";

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
  loader: {
    marginVertical: 16,
    alignItems: 'center',
  },
});

export function Popular({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [allSongs, setAllSongs] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 50;

  const initializeApiClient = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      return new APIClient(session.access_token);
    }
    return null;
  };

  const fetchSongs = async (reset = false) => {
    if (isLoading || (!hasMore && !reset)) return;

    setIsLoading(true);
    try {
      const apiClient = await initializeApiClient();
      if (apiClient) {
        const currentOffset = reset ? 0 : offset;
        const response = await apiClient.getGlobalSongs(LIMIT, currentOffset);
        
        if (response.length < LIMIT) {
          setHasMore(false);
        }

        if (reset) {
          setAllSongs(response);
        } else {
          setAllSongs(prevSongs => [...prevSongs, ...response]);
        }
        
        setOffset(currentOffset + response.length);
      }
    } catch (error) {
      console.error("Failed to fetch global songs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSongs(true);
    }, [])
  );

  useEffect(() => {
    const filtered = allSongs.filter(
      (song) =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery, allSongs]);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      fetchSongs();
    }
  };

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
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
                artist: item.artist,
                title: item.title,
              })
            }
          >
            <Card
              title={item.title}
              artist={item.artist}
              uri={item.SongData.image_url}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => `${item.title}-${item.artist}`}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
}

export default Popular;