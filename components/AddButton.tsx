import React, { useState } from "react";
import { StyleSheet, Modal, View, TextInput, Button, Text, TouchableOpacity } from "react-native";
import { FAB, Portal } from "react-native-paper";

const AddButton = ({navigation}) => {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
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
    setURI('');
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
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleCloseModal}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, {backgroundColor: '#007bff'}]} onPress={handleSubmit}>
                  <Text style={[styles.buttonText, {color: '#fff'}]}>Submit</Text>
                </TouchableOpacity>
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
    width: '80%',
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
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
