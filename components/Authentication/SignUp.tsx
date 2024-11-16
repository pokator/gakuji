import React, { useState, useRef } from "react";
import { Alert, StyleSheet, View, Text, Animated } from "react-native";
import { supabase } from "../../lib/supabase";
import { Button } from "tamagui";
import { Input } from "@rneui/themed";

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation states
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  // Error message states
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Animation refs
  const usernameBorderAnimation = useRef(new Animated.Value(0)).current;
  const emailBorderAnimation = useRef(new Animated.Value(0)).current;
  const passwordBorderAnimation = useRef(new Animated.Value(0)).current;
  const usernameShakeAnimation = useRef(new Animated.Value(0)).current;
  const emailShakeAnimation = useRef(new Animated.Value(0)).current;
  const passwordShakeAnimation = useRef(new Animated.Value(0)).current;
  

  const createShakeAnimation = (shakeAnim) => {
    shakeAnim.setValue(0);
    return Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 8,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -8,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 5,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]);
  };

  const flashBorder = (borderAnim) => {
    borderAnim.setValue(0);
    return Animated.sequence([
      Animated.timing(borderAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(borderAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(borderAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(borderAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]);
  };

  const animateError = (field) => {
    const animations = {
      username: [usernameBorderAnimation, usernameShakeAnimation],
      email: [emailBorderAnimation, emailShakeAnimation],
      password: [passwordBorderAnimation, passwordShakeAnimation],
    };

    const [borderAnim, shakeAnim] = animations[field];
    Animated.parallel([
      createShakeAnimation(shakeAnim),
      flashBorder(borderAnim),
    ]).start();
  };

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Reset field state
  const resetField = (field) => {
    switch (field) {
      case "username":
        setIsUsernameValid(true);
        setUsernameError("");
        break;
      case "email":
        setIsEmailValid(true);
        setEmailError("");
        break;
      case "password":
        setIsPasswordValid(true);
        setPasswordError("");
        break;
    }
  };

  // Validation function
  const validateInputs = () => {
    let isValid = true;

    if (!username.trim()) {
      setIsUsernameValid(false);
      setUsernameError("Username is required");
      animateError("username");
      isValid = false;
    }

    if (!validateEmail(email)) {
      setIsEmailValid(false);
      setEmailError("Please enter a valid email address");
      animateError("email");
      isValid = false;
    }

    if (password.length < 6) {
      setIsPasswordValid(false);
      setPasswordError("Password must be at least 6 characters");
      animateError("password");
      isValid = false;
    }

    return isValid;
  };

  async function signUpWithEmail() {
    if (!validateInputs()) {
      return;
    }

    // setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username,
        },
      },
    });

    if (error) {
      if (error.code?.includes("user_already_exists")) {
        setIsEmailValid(false);
        setEmailError("This email is already registered");
        animateError("email");
      } else {
        // Handle other errors appropriately
        Alert.alert("Error", error.message);
        setIsEmailValid(false);
        setEmailError("An error occurred. Please try again later.");
        animateError("email");
      }
    } else if (!session) {
      Alert.alert("Success", "Please check your inbox for email verification!");
    }

    // setLoading(false);
  }

  const getBorderColor = (borderAnim) => {
    return borderAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["#86939e", "#ff0000"],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>gakuji</Text>
      <Animated.View
        style={[
          styles.verticallySpaced,
          styles.mt20,
          { transform: [{ translateX: usernameShakeAnimation }] },
        ]}
      >
        <Input
          label="Username"
          leftIcon={{
            type: "font-awesome",
            name: "user",
            color: isUsernameValid ? "#86939e" : "#ff0000",
          }}
          onChangeText={(text) => {
            setUsername(text);
            resetField("username");
          }}
          value={username}
          placeholder="Username"
          autoCapitalize="none"
          errorMessage={usernameError}
          inputContainerStyle={{
            borderBottomColor: getBorderColor(usernameBorderAnimation),
          }}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.verticallySpaced,
          { transform: [{ translateX: emailShakeAnimation }] },
        ]}
      >
        <Input
          label="Email"
          leftIcon={{
            type: "font-awesome",
            name: "envelope",
            color: isEmailValid ? "#86939e" : "#ff0000",
          }}
          onChangeText={(text) => {
            setEmail(text);
            resetField("email");
          }}
          value={email}
          placeholder="email@address.com"
          autoCapitalize="none"
          errorMessage={emailError}
          inputContainerStyle={{
            borderBottomColor: getBorderColor(emailBorderAnimation),
          }}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.verticallySpaced,
          { transform: [{ translateX: passwordShakeAnimation }] },
        ]}
      >
        <Input
          label="Password"
          leftIcon={{
            type: "font-awesome",
            name: "lock",
            color: isPasswordValid ? "#86939e" : "#ff0000",
          }}
          onChangeText={(text) => {
            setPassword(text);
            resetField("password");
          }}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize="none"
          errorMessage={passwordError}
          inputContainerStyle={{
            borderBottomColor: getBorderColor(passwordBorderAnimation),
          }}
        />
      </Animated.View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button theme="active" disabled={loading} onPress={signUpWithEmail}>
          Sign up
        </Button>
      </View>
      <View style={styles.verticallySpaced}>
        <Button
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
