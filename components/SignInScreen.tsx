// import React from "react";
// import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
// import { TextInput, Title, Button } from "react-native-paper";
// import { useSignIn, useOAuth } from "@clerk/clerk-expo";
// import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
// import * as WebBrowser from "expo-web-browser";
// import { useWarmUpBrowser } from "../hooks/useWarmUpBrowser";
// import { Mail, Key } from "@tamagui/lucide-icons";

// WebBrowser.maybeCompleteAuthSession();

// export default function SignInScreen({ navigation }: { navigation: any }) {
//   const { signIn, setActive, isLoaded } = useSignIn();
//   const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

//   const [emailAddress, setEmailAddress] = React.useState("");
//   const [password, setPassword] = React.useState("");

//   // Warm up the android browser to improve UX
//   useWarmUpBrowser();

//   const onSignInPress = async () => {
//     if (!isLoaded) {
//       return;
//     }

//     try {
//       const completeSignIn = await signIn.create({
//         identifier: emailAddress,
//         password,
//       });
//       await setActive({ session: completeSignIn.createdSessionId });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const onGoogleSignInPress = async () => {
//     try {
//       const { createdSessionId } = await startOAuthFlow();

//       if (createdSessionId) {
//         setActive && setActive({ session: createdSessionId });
//       } else {
//         // Use signIn or signUp for next steps such as MFA
//       }
//     } catch (err) {
//       console.error("OAuth error", err);
//     }
//   };

//   const MailIcon = () => <Mail size={20} />;
//   const PasswordIcon = () => <Key size={20} />;

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={styles.container}
//     >
//       <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.inner}>
//         <Title style={styles.title}>Sign In</Title>
//         <TextInput
//           label="Email"
//           value={emailAddress}
//           onChangeText={setEmailAddress}
//           style={styles.input}
//           mode="outlined"
//           autoCapitalize="none"
//           keyboardType="email-address"
//           left={<TextInput.Icon icon={MailIcon} />}
//         />
//         <TextInput
//           label="Password"
//           value={password}
//           onChangeText={setPassword}
//           style={styles.input}
//           mode="outlined"
//           secureTextEntry
//           left={<TextInput.Icon icon={PasswordIcon} />}
//         />
//         <View style={styles.buttonRow}>
//           <Animated.View
//             entering={FadeIn}
//             exiting={FadeOut}
//             style={styles.animatedButton}
//           >
//             <Button
//               mode="contained"
//               style={styles.buttonText}
//               onPress={onSignInPress}
//             >
//               Sign In
//             </Button>
//           </Animated.View>
//           <Animated.View
//             entering={FadeIn}
//             exiting={FadeOut}
//             style={styles.animatedButton}
//           >
//             <Button mode="contained" style={styles.buttonText} onPress={onGoogleSignInPress}>
//               Google
//             </Button>
//           </Animated.View>
//         </View>
//         <Animated.View entering={FadeIn} exiting={FadeOut}>
//           <Button
//             style={styles.switchButton}
//             mode="contained-tonal"
//             onPress={() => navigation.navigate("Sign Up Screen")}
//           >
//             Don't have an account? Sign Up
//           </Button>
//         </Animated.View>
//       </Animated.View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     // padding: 16,
//     backgroundColor: "#f5f5f5",
//   },
//   inner: {
//     justifyContent: "center",
//     height: "100%",
//     padding: 24,
//     borderRadius: 10,
//     backgroundColor: "#fff",
//     elevation: 5,
//   },
//   title: {
//     fontSize: 28,
//     marginBottom: 24,
//     textAlign: "center",
//     fontWeight: "bold",
//     color: "#6200ee",
//   },
//   input: {
//     marginBottom: 16,
//   },
//   buttonRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 16,
//   },
//   button: {
//     flex: 1,
//     marginHorizontal: 4,
//     borderRadius: 5,
//   },
//   animatedButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     flex: 1,
//     marginHorizontal: 4,
//     borderRadius: 5,
//   },
//   icon: {
//     marginRight: 8,
//   },
//   buttonText: {
//     flex: 1,
//   },
//   switchButton: {
//     marginTop: 16,
//     // alignItems: "center",
//   },
// });
