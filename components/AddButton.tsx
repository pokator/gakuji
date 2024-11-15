import React, { useState } from "react";
import {
  StyleSheet,
  Modal,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { FAB, Portal, Button } from "react-native-paper";
import { APIClient } from "../api-client/api"; // API client initialized
import { supabase } from "../lib/supabase"; // Supabase client initialized

const AddButton = ({ navigation, refreshList }) => {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("link");
  const [uri, setURI] = useState("");
  const [artist, setArtist] = useState("");
  const [title, setTitle] = useState("");

  const [fillText, setFillText] = useState(
    "Song submitted! It will be added to the list shortly."
  );

  const onStateChange = ({ open }) => setOpen(open);

  const handleFromLinkPress = () => {
    setModalOpen(true);
    setModalType("link");
  };

  const handleSearchPress = () => {
    setModalOpen(true);
    setModalType("search");
  };

  const handleManualEntryPress = () => {
    navigation.getParent().navigate("LyricsEntry");
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

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
    // Do something with the URI
    setSubmitted(true);
    try {
      const apiClient = await initializeApiClient();
      if (apiClient) {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const response = await apiClient.addSongSpot({
          uri: uri,
          refresh_token: session?.refresh_token,
          access_token: session?.access_token,
        });

        console.log(response);

        const message = response.data?.message;
        if (response.data?.status === "success") {
          setFillText("Song added successfully.");
        } else {
          setFillText(message || "Song could not be added. Please try a different method.");
        }
      }
    } catch (error) {
      console.error("Failed to fetch songs:", error);
      setFillText("An error occurred. Please try again.");
    }

    // After handling the URI, close the modal

    setURI("");
    refreshList();
    // navigation.getParent().navigate("LyricsEntry", {fromLink: true});
  };

  const handleSearchSubmit = async () => {
    setSubmitted(true);
    try {
      const apiClient = await initializeApiClient();
      if (apiClient) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
  
        const response = await apiClient.addSongSearch({
          artist: artist,
          title: title,
          refresh_token: session?.refresh_token,
          access_token: session?.access_token,
        });
  
        const message = response.data?.message;
        if (response.data?.status === "success") {
          setFillText("Song added successfully.");
        } else {
          setFillText(message || "Song could not be added. Please try a different method.");
        }
      }
    } catch (error) {
      console.error("Failed to fetch songs:", error);
      setFillText("An error occurred. Please try again.");
    }
  
    setArtist("");
    setTitle("");
    refreshList();
  };

  const onReturn = () => {
    setModalOpen(false);
    setSubmitted(false);
  };

  return (
    <Portal>
      <View>
        <Modal
          visible={modalOpen}
          animationType="fade"
          transparent={true}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {submitted ? (
                <>
                  <Text>{fillText}</Text>
                  <View style={styles.buttonContainer}>
                    <Pressable onPress={onReturn} style={styles.button}>
                      <Text>Return</Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                <>
                  {modalType === "link" ? (
                    <>
                      <Text style={styles.modalTitle}>From Link</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter URI"
                        value={uri}
                        onChangeText={(text) => setURI(text)}
                      />
                      <View style={styles.buttonContainer}>
                        <Pressable
                          style={styles.button}
                          onPress={handleCloseModal}
                        >
                          <Text style={styles.buttonText}>Cancel</Text>
                        </Pressable>
                        <Pressable
                          style={[
                            styles.button,
                            { backgroundColor: "#007bff" },
                          ]}
                          onPress={handleSubmit}
                        >
                          <Text style={[styles.buttonText, { color: "#fff" }]}>
                            Submit
                          </Text>
                        </Pressable>
                      </View>
                    </>
                  ) : (
                    <>
                      <Text style={styles.modalTitle}>
                        Search (Japanese Title)
                      </Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter Artist"
                        value={artist}
                        onChangeText={(text) => setArtist(text)}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Enter Title"
                        value={title}
                        onChangeText={(text) => setTitle(text)}
                      />
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity
                          style={styles.button}
                          onPress={handleCloseModal}
                        >
                          <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.button,
                            { backgroundColor: "#007bff" },
                          ]}
                          onPress={handleSearchSubmit}
                        >
                          <Text style={[styles.buttonText, { color: "#fff" }]}>
                            Submit
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
      <FAB.Group
        visible={true}
        open={open}
        icon={open ? "close" : "plus"}
        style={styles.fabContainer}
        rippleColor={"rgba(0, 0, 0, 0.5)"}
        actions={[
          {
            icon: "star",
            label: "From Link",
            onPress: handleFromLinkPress,
            labelTextColor: "white",
          },
          {
            icon: "heart",
            label: "Manual Entry",
            onPress: handleManualEntryPress,
            labelTextColor: "white",
          },
          {
            icon: "search-web",
            label: "Search",
            onPress: handleSearchPress,
            labelTextColor: "white",
          },
        ]}
        onStateChange={onStateChange}
        onPress={() => {
          if (open) {
            // do something if the speed dial is open
          } else {
            // do something if the speed dial is closed
          }
        }}
      />
    </Portal>
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    // backgroundColor: "#007bff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: "80%",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
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
  buttonText: {
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default AddButton;
