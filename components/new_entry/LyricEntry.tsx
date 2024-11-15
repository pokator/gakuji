import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Mic, Disc } from "@tamagui/lucide-icons";
import { APIClient } from "../../api-client/api";
import { supabase } from "../../lib/supabase";

export function LyricsEntryScreen({ navigation }) {
  const [artist, setArtist] = useState("");
  const [title, setTitle] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [fillText, setFillText] = useState(
    "Song submitted! It will be added to the list shortly."
  );

  const initializeApiClient = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token ? new APIClient(session.access_token) : null;
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    try {
      const apiClient = await initializeApiClient();
      if (apiClient) {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const response = await apiClient.addSongManual({
          title,
          artist,
          lyrics,
          refresh_token: session?.refresh_token,
          access_token: session?.access_token,
        });
        console.log(response);

        const message = response.data?.message;
        if (response.data?.status === "success") {
          setFillText("Song added successfully.");
        } else {
          setFillText(
            message || "Song could not be added. Please try a different method."
          );
        }
      }
    } catch (error) {
      console.error("Failed to fetch songs:", error);
      setFillText("An error occurred. Please try again.");
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
        <View style={styles.contentContainer}>
          <View style={styles.inputsContainer}>
            <View style={styles.row}>
              <View style={styles.iconContainer}>
                <Mic size={24} color="#4A5568" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Artist name"
                placeholderTextColor="#A0AEC0"
                value={artist}
                onChangeText={setArtist}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.iconContainer}>
                <Disc size={24} color="#4A5568" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Song title"
                placeholderTextColor="#A0AEC0"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.lyricsContainer}>
              <TextInput
                style={styles.lyricsInput}
                placeholder="Enter song lyrics here..."
                placeholderTextColor="#A0AEC0"
                multiline={true}
                textAlignVertical="top"
                value={lyrics}
                onChangeText={setLyrics}
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={[styles.buttonText, styles.submitButtonText]}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.submittedContainer}>
          <Text style={styles.submittedText}>{fillText}</Text>
          <TouchableOpacity
            style={[styles.button, styles.returnButton]}
            onPress={onReturn}
          >
            <Text style={styles.buttonText}>Return</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
    padding: 16,
  },
  contentContainer: {
    flex: 1,
    gap: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 20,
    textAlign: "center",
  },
  inputsContainer: {
    flex: 1,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#2D3748",
  },
  lyricsContainer: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  lyricsInput: {
    flex: 1,
    fontSize: 16,
    color: "#2D3748",
    minHeight: 200,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#EDF2F7",
  },
  submitButton: {
    backgroundColor: "#4299E1",
  },
  returnButton: {
    backgroundColor: "#4299E1",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A5568",
  },
  submitButtonText: {
    color: "white",
  },
  submittedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  submittedText: {
    fontSize: 18,
    textAlign: "center",
    color: "#2D3748",
    marginBottom: 20,
  },
});
