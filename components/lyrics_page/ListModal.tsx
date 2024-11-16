import React, { useLayoutEffect, useState, useRef } from "react";
import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  Animated,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { APIClient, WordAdd } from "../../api-client/api";
import { supabase } from "../../lib/supabase";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";

interface ModalComponentProps {
  visible: boolean;
  onClose: () => void;
  term: string;
  activeIndex: number;
  title: string;
  artist: string;
}

interface List {
  id: string;
  list_name: string;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
  visible,
  onClose,
  term,
  activeIndex,
  title,
  artist,
}) => {
  const [allLists, setAllLists] = useState<List[]>([]);
  const [originallyCheckedListIds, setOriginallyCheckedListIds] = useState<
    string[]
  >([]);
  const [checkedListIds, setCheckedListIds] = useState<string[]>([]);
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const borderAnimation = useRef(new Animated.Value(0)).current;
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const createShakeAnimation = () => {
    // Reset shake value
    shakeAnimation.setValue(0);

    // Create a sequence of small movements
    Animated.sequence([
      // Shake right
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      // Shake left
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      // Shake right
      Animated.timing(shakeAnimation, {
        toValue: 8,
        duration: 50,
        useNativeDriver: true,
      }),
      // Shake left
      Animated.timing(shakeAnimation, {
        toValue: -8,
        duration: 50,
        useNativeDriver: true,
      }),
      // Shake right
      Animated.timing(shakeAnimation, {
        toValue: 5,
        duration: 50,
        useNativeDriver: true,
      }),
      // Back to center
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const flashBorder = () => {
    // Reset animation value
    borderAnimation.setValue(0);

    // Create animation sequence
    Animated.sequence([
      Animated.timing(borderAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(borderAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(borderAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(borderAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const animateError = () => {
    // Run both animations together
    createShakeAnimation();
    flashBorder();
  };

  const handleSubmit = async () => {
    console.log("Submitted checked list IDs:", checkedListIds);
    console.log("Term:", term);
    if (isAddingList) {
      animateError();
      return; // Prevent form submission if adding a list
    }
    try {
      const apiClient = await initializeApiClient();
      if (apiClient) {
        for (const string of originallyCheckedListIds) {
          if (!checkedListIds.includes(string)) {
            await apiClient.deleteWordFromList(term.toString(), string);
            setCheckedListIds(checkedListIds.filter((id) => id !== string));
          }
        }

        for (const string of checkedListIds) {
          const wordAdd: WordAdd = {
            word: term.toString(),
            title: title,
            artist: artist,
            list_id: string,
          };
          await apiClient.addWordToList(wordAdd);
        }
        setIsAddingList(false);
        setNewListName("");
      }
    } catch (error) {
      console.error("Failed to update lists:", error);
    }

    onClose();
  };

  const handleClose = () => {
    setIsAddingList(false);
    setNewListName("");
    onClose();
  };

  const handleToggleCheckbox = (listId: string) => {
    setCheckedListIds((prevIds) =>
      prevIds.includes(listId)
        ? prevIds.filter((id) => id !== listId)
        : [...prevIds, listId]
    );
  };

  const initializeApiClient = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      return new APIClient(session.access_token);
    }
    return null;
  };

  const fetchLists = async () => {
    try {
      const apiClient = await initializeApiClient();
      if (apiClient) {
        const type = activeIndex === 2 ? "kanji" : "word";
        const allListsResponse = await apiClient.getTypeLists(type);
        const listsWithoutTermResponse = await apiClient.checkAllLists(
          term,
          type
        );

        console.log("All lists response:", allListsResponse);
        console.log("Lists without term response:", listsWithoutTermResponse);

        setAllLists(allListsResponse?.data || []);

        // Calculate the lists that DO have the term
        const listsWithTerm = allListsResponse?.data.filter(
          (list) =>
            !listsWithoutTermResponse.some((l: List) => l.id === list.id)
        );

        const checkedIds = listsWithTerm.map((list) => list.id);
        setCheckedListIds(checkedIds);
        setOriginallyCheckedListIds(checkedIds);
      }
    } catch (error) {
      console.error("Failed to fetch lists:", error);
    }
  };

  useLayoutEffect(() => {
    fetchLists();
  }, [term, activeIndex]);

  const handleAddNewList = async () => {
    if (newListName.trim()) {
      try {
        const apiClient = await initializeApiClient();
        if (apiClient) {
          const type = activeIndex === 0 ? "word" : "kanji";
          const response = await apiClient.addList(newListName.trim(), type);

          if (response.error) {
            if (response.error.includes("duplicate")) {
              Alert.alert("Error", "A list with this name already exists.");
            } else {
              Alert.alert("Error", "Failed to add new list. Please try again.");
            }
          } else {
            // List added successfully
            setNewListName("");
            setIsAddingList(false);
            // Re-fetch the lists to update the UI
            await fetchLists();
          }
        }
      } catch (error) {
        console.error("Failed to add new list:", error);
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      }
    }
  };

  const interpolatedBorderColor = borderAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#ccc", "#ff0000"],
  });

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            {activeIndex === 0
              ? "Store to a Word list"
              : "Store to a Kanji List"}
          </Text>

          {allLists.map((list) => (
            <View key={list.id} style={styles.checkboxRow}>
              <Checkbox
                status={
                  checkedListIds.includes(list.id) ? "checked" : "unchecked"
                }
                onPress={() => handleToggleCheckbox(list.id)}
              />
              <Text>{list.list_name}</Text>
            </View>
          ))}

          <View style={styles.addListRow}>
            <TouchableOpacity onPress={() => setIsAddingList(!isAddingList)}>
              <Text>{isAddingList ? "X" : "+"}</Text>
            </TouchableOpacity>
            {isAddingList ? (
              <>
                <Animated.View
                  style={[
                    styles.inputContainer,
                    {
                      borderColor: interpolatedBorderColor,
                      transform: [
                        {
                          translateX: shakeAnimation,
                        },
                      ],
                    },
                  ]}
                >
                  <TextInput
                    style={styles.input}
                    value={newListName}
                    onChangeText={setNewListName}
                    placeholder="Enter list name"
                  />
                </Animated.View>
                <TouchableOpacity onPress={handleAddNewList}>
                  <Text>ADD</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.newListText}>New List</Text>
            )}
          </View>

          <View style={styles.buttonRow}>
            <Button title="Submit" onPress={handleSubmit} />
            <Button title="Cancel" onPress={handleClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  addListRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  inputContainer: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  input: {
    padding: 5,
  },
  newListText: {
    marginLeft: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});

export default ModalComponent;
