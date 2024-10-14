import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { Mic, Disc } from "@tamagui/lucide-icons";
import { APIClient } from "../../api-client/api"; // API client initialized
import { supabase } from "../../lib/supabase"; // Supabase client initialized
import { TouchableOpacity } from "react-native-gesture-handler";

export function LyricsEntryScreen({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  // const { refreshList } = route.params;
  // console.log("fromLink:", fromLink);

  const [artist, setArtist] = useState("");
  const [title, setTitle] = useState("");
  const [lyrics, setLyrics] = useState("");

  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = async () => {
    setSubmitted(true);
    // Handle the submission of lyrics here
    // For example, you can send them to a backend server
    // or save them locally
    // console.log("Lyrics submitted!");
    // After handling the submission, you might want to navigate back

    try {
      const apiClient = await initializeApiClient();
      if (apiClient) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const response = await apiClient.addSongManual({
          title: title,
          artist: artist,
          lyrics: lyrics,
          refresh_token: session?.refresh_token,
          access_token: session?.access_token,
        });
        console.log(response);
      }
    } catch (error) {
      console.error("Failed to fetch songs:", error);
    }
  };

  const onReturn = () => {
    setArtist("");
    setTitle("");
    setLyrics("");
    setSubmitted(false);

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {!submitted ? (
        <>
          <View>
            <View style={styles.row}>
              {/* Icon */}
              <View style={styles.iconContainer}>
                <Mic size={24} color="black" />
              </View>
              {/* Text Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Artist"
                  value={artist}
                  onChangeText={(text) => setArtist(text)}
                />
              </View>
            </View>
            <View style={styles.row}>
              {/* Icon */}
              <View style={styles.iconContainer}>
                <Disc size={24} color="black" />
              </View>
              {/* Text Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Title"
                  value={title}
                  onChangeText={(text) => setTitle(text)}
                />
              </View>
            </View>
          </View>
          <View style={styles.lyricInput}>
            <TextInput
              placeholder="Paste lyrics here"
              multiline={true}
              value={lyrics}
              onChangeText={(text) => setLyrics(text)}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={() => navigation.goBack()} />
            <Button title="Submit" onPress={handleSubmit} />
          </View>
        </>
      ) : (
        <>
          <Text>
            Song Submitted! It may take up to a minute for the result to arrive.
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onReturn} style={styles.button}>
              <Text>Return</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  row: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    // borderColor: "rgba(0, 0, 0, 0.25)",
    // borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 5,
    backgroundColor: "white",
  },
  iconContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  inputContainer: {
    flex: 5,
  },
  input: {
    fontSize: 16,
  },
  lyricInput: {
    width: "90%",
    // borderColor: "rgba(0, 0, 0, 0.25)",
    // borderWidth: 1,
    borderRadius: 10,
    // paddingHorizontal: 10,
    flex: 5,
    elevation: 5,
    backgroundColor: "white",
    padding: 10,
    marginVertical: 10,
  },
  buttonContainer: {
    marginVertical: 10,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    borderRadius: 20,
    marginHorizontal: 5,
  },
});
