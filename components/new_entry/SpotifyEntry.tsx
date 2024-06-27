//Create a modal view which allows a user to enter a spotify uri.
//
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Modal, Portal, TextInput, Button } from "react-native-paper";

export type SpotifyEntryRefProps = {
    showModal: () => void;
};
const SpotifyEntry = React.forwardRef<SpotifyEntryRefProps>(
    (ref) => {
// const SpotifyEntry = () => {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState("");

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <View>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.containerStyle}
        >
          <TextInput
            label="Spotify URI"
            value={text}
            onChangeText={(text) => setText(text)}
          />
          <Button onPress={hideModal}>Cancel</Button>
          <Button onPress={hideModal}>Submit</Button>
        </Modal>
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