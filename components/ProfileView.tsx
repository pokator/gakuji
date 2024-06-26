import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
// import { useAuth } from "@clerk/clerk-expo";

export function ProfilePage({ navigation }: { navigation: any }) {
  const username = "johndoe";
  const name = "John Doe";
  const email = "john.doe@johndoe.doe";
  const bio = "I am a person who likes to listen to music.";

  // const { isLoaded, signOut } = useAuth();

  // if (!isLoaded) {
  //   return null;
  // }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileInfo}>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Username</Text>
            <Text style={styles.value}>{username}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{name}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{email}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Bio</Text>
            <Text style={[styles.value, styles.bio]}>{bio}</Text>
          </View>
        </View>
        {/* Action buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => console.log("Edit Profile pressed")}
          >
            <Feather name="edit" size={24} color="#007bff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => console.log("Settings pressed")}
          >
            <Feather name="settings" size={24} color="#007bff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.logoutButton]}
            onPress={() => {
              // signOut();
            }}
          >
            <Feather name="log-out" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20, // Adjusted paddingBottom to leave space for buttons
  },
  profileInfo: {
    backgroundColor: "#f9f9f9",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    padding: 20,
    marginBottom: 20,
  },
  infoItem: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#555",
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  bio: {
    fontStyle: "italic",
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  actionButton: {
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#007bff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutButton: {
    borderColor: "red",
  },
});

export default ProfilePage;
