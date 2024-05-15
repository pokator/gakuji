import React, { useState } from "react";
import { StyleSheet, Modal, View, TextInput, Button, Text } from "react-native";
import { FAB, Portal } from "react-native-paper";

const AddButton = ({navigation}) => {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false); 
  const [uri, setURI] = useState('');

  const onStateChange = ({ open }) => setOpen(open);

  const handleFromLinkPress = () => {
    setModalOpen(true);
  };

  const handleManualEntryPress = () => {
    navigation.getParent().navigate("LyricsEntry", {fromLink: false});
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = () => {
    // Do something with the URI
    console.log("Submitted URI:", uri);
    // You can add more logic here, like sending the URI to an API or storing it locally
    // After handling the URI, close the modal
    setModalOpen(false);
    navigation.getParent().navigate("LyricsEntry", {fromLink: true});
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
              <Text style={styles.modalTitle}>From Link</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter URI"
                value={uri}
                onChangeText={(text) => setURI(text)}
              />
              {/* Spotify data display*/}
              <View style={styles.buttonContainer}>
                <Button title="Cancel"  onPress={handleCloseModal} />
                <Button title="Submit" disabled={isDisabled} onPress={handleSubmit} />
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <FAB.Group
        visible={true}
        open={open}
        icon={open ? "close" : "plus"}
        style={styles.fabContainer}
        rippleColor={"red"}
        actions={[
          {
            icon: "star",
            label: "From Link",
            onPress: handleFromLinkPress,
            labelTextColor: "black",
          },
          {
            icon: "heart",
            label: "Manual Entry",
            onPress: handleManualEntryPress,
            labelTextColor: "black",
          },
        ]}
        onStateChange={onStateChange}
        onPress={() => {
          if (open) {
            // do something if the speed dial is open
          }
        }}
      />
    </Portal>
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    position: "absolute",
    bottom: -32,
    right: 0,
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
    width: 300,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default AddButton;
