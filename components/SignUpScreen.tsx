// import React from "react";
// import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
// import { TextInput, Button, Title } from "react-native-paper";
// import { useSignUp } from "@clerk/clerk-expo";
// import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

// export default function SignUpScreen({ navigation }: { navigation: any }) {
//   const { isLoaded, signUp, setActive } = useSignUp();
//   const [username, setUsername] = React.useState("");
//   const [emailAddress, setEmailAddress] = React.useState("");
//   const [password, setPassword] = React.useState("");
//   const [pendingVerification, setPendingVerification] = React.useState(false);
//   const [code, setCode] = React.useState("");

//   const onSignUpPress = async () => {
//     if (!isLoaded) {
//       return;
//     }

//     try {
//       await signUp.create({
//         username,
//         emailAddress,
//         password,
//       });

//       await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
//       setPendingVerification(true);
//     } catch (err: any) {
//       console.error(JSON.stringify(err, null, 2));
//     }
//   };

//   const onPressVerify = async () => {
//     if (!isLoaded) {
//       return;
//     }

//     try {
//       const completeSignUp = await signUp.attemptEmailAddressVerification({
//         code,
//       });

//       await setActive({ session: completeSignUp.createdSessionId });
//     } catch (err: any) {
//       console.error(JSON.stringify(err, null, 2));
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={styles.container}
//     >
//       <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.inner}>
//         <Title style={styles.title}>Sign Up</Title>
//         {!pendingVerification ? (
//           <>
//             <TextInput
//               label="Username"
//               value={username}
//               onChangeText={(username) => setUsername(username)}
//               style={styles.input}
//               mode="outlined"
//               autoCapitalize="none"
//             />
//             <TextInput
//               label="Email"
//               value={emailAddress}
//               onChangeText={(email) => setEmailAddress(email)}
//               style={styles.input}
//               mode="outlined"
//               autoCapitalize="none"
//               keyboardType="email-address"
//             />
//             <TextInput
//               label="Password"
//               value={password}
//               onChangeText={(password) => setPassword(password)}
//               style={styles.input}
//               mode="outlined"
//               secureTextEntry
//             />
//             <Button mode="contained" onPress={onSignUpPress} style={styles.button}>
//               Sign Up
//             </Button>
//             <Button
//               mode="contained-tonal"
//               onPress={() => navigation.navigate('Sign In Screen')}
//               style={styles.switchButton}
//             >
//               Already have an account? Sign In
//             </Button>
//           </>
//         ) : (
//           <>
//             <TextInput
//               label="Verification Code"
//               value={code}
//               onChangeText={(code) => setCode(code)}
//               style={styles.input}
//               mode="outlined"
//             />
//             <Button mode="contained" onPress={onPressVerify} style={styles.button}>
//               Verify Email
//             </Button>
//           </>
//         )}
//       </Animated.View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     // padding: 16,
//   },
//   inner: {
//     padding: 24,
//     borderRadius: 10,
//     backgroundColor: "#fff",
//     elevation: 3,
//     height: "100%",
//     justifyContent: "center",
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 16,
//     textAlign: "center",
//   },
//   input: {
//     marginBottom: 12,
//   },
//   button: {
//     marginTop: 12,
//   },
//   switchButton: {
//     marginTop: 16,
//     // alignItems: "center",
//   },
// });

import React from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput, Title, Button } from "react-native-paper";
import { useSignUp, useOAuth } from "@clerk/clerk-expo";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Mail, Key, User } from "@tamagui/lucide-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function SignUpScreen({ navigation }: { navigation: any }) {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const [username, setUsername] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        username,
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onGoogleSignUpPress = async () => {
    try {
      const { createdSessionId } = await startOAuthFlow();

      if (createdSessionId) {
        setActive && setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  };

  const MailIcon = () => <Mail size={20} />;
  const PasswordIcon = () => <Key size={20} />;
  const UserIcon = () => <User size={20} />;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.inner}>
        <Title style={styles.title}>Sign Up</Title>
        {!pendingVerification ? (
          <>
            <TextInput
              label="Username"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              mode="outlined"
              autoCapitalize="none"
              left={<TextInput.Icon icon={UserIcon} />}
            />
            <TextInput
              label="Email"
              value={emailAddress}
              onChangeText={setEmailAddress}
              style={styles.input}
              mode="outlined"
              autoCapitalize="none"
              keyboardType="email-address"
              left={<TextInput.Icon icon={MailIcon} />}
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              mode="outlined"
              secureTextEntry
              left={<TextInput.Icon icon={PasswordIcon} />}
            />
            <View style={styles.buttonRow}>
              <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                style={styles.animatedButton}
              >
                <Button
                  mode="contained"
                  color="#6200ee"
                  style={styles.buttonText}
                  onPress={onSignUpPress}
                >
                  Sign Up
                </Button>
              </Animated.View>
              <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                style={styles.animatedButton}
              >
                <Button
                  mode="contained"
                  color="#db4437"
                  style={styles.buttonText}
                  onPress={onGoogleSignUpPress}
                >
                  Google
                </Button>
              </Animated.View>
            </View>
            <Animated.View entering={FadeIn} exiting={FadeOut}>
              <Button
                style={styles.switchButton}
                mode="contained-tonal"
                color="#6200ee"
                onPress={() => navigation.navigate("Sign In Screen")}
              >
                Already have an account? Sign In
              </Button>
            </Animated.View>
          </>
        ) : (
          <>
            <TextInput
              label="Verification Code"
              value={code}
              onChangeText={setCode}
              style={styles.input}
              mode="outlined"
            />
            <Button
              mode="contained"
              onPress={onPressVerify}
              style={styles.button}
            >
              Verify Email
            </Button>
          </>
        )}
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  inner: {
    justifyContent: "center",
    height: "100%",
    padding: 24,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 5,
  },
  title: {
    fontSize: 28,
    marginBottom: 24,
    textAlign: "center",
    fontWeight: "bold",
    color: "#6200ee",
  },
  input: {
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  animatedButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 5,
  },
  buttonText: {
    flex: 1,
  },
  switchButton: {
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 5,
  },
});
