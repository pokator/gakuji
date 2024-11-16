import React, { useState, useRef } from "react";
import {
  Alert,
  StyleSheet,
  View,
  Text,
  Animated,
  AppState,
} from "react-native";
import { supabase } from "../../lib/supabase";
import { Input } from "@rneui/themed";
import { Button } from "tamagui";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation states
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  // Error message states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Animation refs
  const emailBorderAnimation = useRef(new Animated.Value(0)).current;
  const passwordBorderAnimation = useRef(new Animated.Value(0)).current;
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

    if (!validateEmail(email)) {
      setIsEmailValid(false);
      setEmailError("Please enter a valid email address");
      animateError("email");
      isValid = false;
    }

    if (!password.trim()) {
      setIsPasswordValid(false);
      setPasswordError("Password is required");
      animateError("password");
      isValid = false;
    }

    return isValid;
  };

  const getBorderColor = (borderAnim) => {
    return borderAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["#86939e", "#ff0000"],
    });
  };

  async function signInWithEmail() {
    if (!validateInputs()) {
      return;
    }

    // setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setIsEmailValid(false);
      setIsPasswordValid(false);
      setEmailError("Invalid email or password");
      setPasswordError("Invalid email or password");
      animateError("email");
      animateError("password");

      console.error("Error signing in:", error.message);
      console.error("Error metadata:", error.code);
      console.error("Error details:", error.name);
    }
    // setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>gakuji</Text>
      <Animated.View
        style={[
          styles.verticallySpaced,
          styles.mt20,
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
        <Button theme="active" disabled={loading} onPress={signInWithEmail}>
          Sign in
        </Button>
      </View>
      <View style={styles.verticallySpaced}>
        <Button
          variant="outlined"
          onPress={() => navigation.navigate("SignUp")}
        >
          Don't have an account? Sign up
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
