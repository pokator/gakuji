import React, { useState } from "react";
import { Alert, StyleSheet, View, Text } from "react-native";
import { supabase } from "../../lib/supabase";
import { Button } from "tamagui";
import { Input } from "@rneui/themed";

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // New state variable for username
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    setLoading(true);
    const { data: { session }, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username, // Include the username in the user metadata
        },
      },
    });

    if (error) Alert.alert(error.message);
    if (!session) Alert.alert("Please check your inbox for email verification!");

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>gakuji</Text>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Username"
          leftIcon={{ type: "font-awesome", name: "user" }}
          onChangeText={(text) => setUsername(text)}
          value={username}
          placeholder="Username"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Email"
          leftIcon={{ type: "font-awesome", name: "envelope" }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: "font-awesome", name: "lock" }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize="none"
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button theme="active" disabled={loading} onPress={signUpWithEmail}>
            Sign up
        </Button>
      </View>
      <View style={styles.verticallySpaced}>
        <Button
        //   title="Already have an account? Sign in"
          variant="outlined"
          onPress={() => navigation.navigate("SignIn")}
        >
            Already have an account? Sign in
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  logo: {
    fontSize: 40,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 30,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
