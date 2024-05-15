//Create a view which maps saved songs to individual card components stored in Card.tsx, and also includes the AddButton component floating in the bottom right.

import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Card } from "./Card";
import AddButton from "./AddButton";
import { PaperProvider, Provider } from "react-native-paper";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
});

export function Saved({ navigation }: { navigation: any }) {
  const songs = [
    {
      title: "アイドル",
      artist: "YOASOBI",
      albumCover:
        "https://upload.wikimedia.org/wikipedia/en/b/b0/Yoasobi_-_Idol.png",
    },
  ];

  // useLayoutEffect(() => {
  //   navigation.getParent()!.getParent()!.setOptions({
  //     headerTitle: 'Saved', // Set the desired title
  //   });
  // }, [navigation]);

  return (
    <PaperProvider>
      <View style={styles.container}>
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
            >
              <Card song={item} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.title}
        />
        <AddButton navigation={navigation}/>
      </View>
    </PaperProvider>
  );
}
