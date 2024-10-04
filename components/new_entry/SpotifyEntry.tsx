//Create a modal view which allows a user to enter a spotify uri.
//
import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Modal, Portal, TextInput, Button } from "react-native-paper";
import { APIClient } from "../../api-client/api"; // API client initialized
import { supabase } from "../../lib/supabase"; // Supabase client initialized

export type SpotifyEntryRefProps = {
  showModal: () => void;
};
const SpotifyEntry = React.forwardRef<SpotifyEntryRefProps>((ref) => {
  // const SpotifyEntry = () => {
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [text, setText] = useState("");

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const onSubmit = async () => {
    // Add your logic here
    // try {
    //   const {
    //     data: { session },
    //   } = await supabase.auth.getSession();
    //   if (session?.access_token) {
    //     const apiClient = new APIClient(session.access_token);
    //     await apiClient.addSongSpot({ uri: text });
    //   }
    // } catch (error) {
    //   console.error("Failed to add Spotify URI:", error);
    // }

    setSubmitted(true);
  };

  const onReturn = () => {
    hideModal();
    setSubmitted(false);
  }

  return (
    <View>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.containerStyle}
        >
          {submitted ? (
            <>
              <Text>Song Submitted! It may take up to a minute for the result to arrive.</Text>
              <Button onPress={onReturn}>Return</Button>
            </>
          ) : (
            <>
              <TextInput
                label="Spotify URI"
                value={text}
                onChangeText={(text) => setText(text)}
              />
              <Button onPress={hideModal}>Cancel</Button>
              <Button onPress={hideModal}>Submit</Button>
            </>
          )}
        </Modal>
        <></>
      </Portal>
    </View>
  );
});

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
  },
});

export default SpotifyEntry;
