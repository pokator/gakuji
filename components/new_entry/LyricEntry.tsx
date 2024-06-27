import React from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { Mic, Disc } from "@tamagui/lucide-icons";

export function LyricsEntryScreen({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const { fromLink } = route.params;
  console.log("fromLink:", fromLink);
  const handleSubmit = () => {
    // Handle the submission of lyrics here
    // For example, you can send them to a backend server
    // or save them locally
    console.log("Lyrics submitted!");
    // After handling the submission, you might want to navigate back
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {!fromLink && (
        <View>
          <View style={styles.row}>
            {/* Icon */}
            <View style={styles.iconContainer}>
              <Mic size={24} color="black" />
            </View>
            {/* Text Input */}
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} placeholder="Artist" />
            </View>
          </View>
          <View style={styles.row}>
            {/* Icon */}
            <View style={styles.iconContainer}>
              <Disc size={24} color="black" />
            </View>
            {/* Text Input */}
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} placeholder="Title" />
            </View>
          </View>
        </View>
      )}

      <View style={styles.lyricInput}>
        <TextInput placeholder="Paste lyrics here" multiline={true} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Cancel" onPress={() => navigation.goBack()} />
        <Button title="Submit" onPress={handleSubmit} />
      </View>
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
});
