import React, { useState, useEffect, useLayoutEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  useFocusEffect,
  useNavigation,
  CommonActions,
} from "@react-navigation/native";
import { View, Text, Animated } from "react-native";
import { Popular } from "./components/Popular";
import { Saved } from "./components/Saved";
import { createStackNavigator } from "@react-navigation/stack";
import { LyricsView } from "./components/LyricsView";
import { TamaguiProvider } from "tamagui";
import config from "./tamagui.config";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider, Provider } from "react-native-paper";

const Tab = createBottomTabNavigator();
// const Tab = createBottomTabNavigator();
const SavedStack = createStackNavigator();
const PopularStack = createStackNavigator();
const GeneralStack = createStackNavigator();

// Stack navigator for the Saved tab
function SavedStackScreen() {
  return (
    <SavedStack.Navigator
      screenOptions={{
        // headerTitle: headerText,
        // headerTitleStyle: { opacity: fadeAnim, fontSize: 24 },
        // headerTitleAlign: "center",
        headerShown: false,
      }}
    >
      <SavedStack.Screen name="Saved" component={Saved} />
      {/* Add more screens here if needed */}
    </SavedStack.Navigator>
  );
}

// Stack navigator for the Popular tab
function PopularStackScreen() {
  return (
    <PopularStack.Navigator screenOptions={{ headerShown: false }}>
      <PopularStack.Screen name="Popular" component={Popular} />
      {/* Add more screens here if needed */}
    </PopularStack.Navigator>
  );
}

function TabNavigationScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#f0f0f0",
          zIndex: 5,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Saved Tab"
        component={SavedStackScreen}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            // // Prevent default action
            // e.preventDefault();

            // // Navigate to the screen
            // navigation.navigate("Popular");

            // // Call any function or perform any action here
            // console.log("Popular tab is selected");
            navigation.getParent()!.setOptions({
              headerTitle: "Saved",
            });
          },
        })}
      />
      <Tab.Screen
        name="Popular Tab"
        component={PopularStackScreen}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            // // Prevent default action
            // e.preventDefault();

            // // Navigate to the screen
            // navigation.navigate("Popular");

            // // Call any function or perform any action here
            // console.log("Popular tab is selected");
            navigation.getParent()!.setOptions({
              headerTitle: "Popular",
            });
          },
        })}
      />
      {/* Add two additional screens: a kanji list and a profile */}
    </Tab.Navigator>
  );
}

export default function App() {
  const [headerText, setHeaderText] = useState("Gakuji");
  const fadeAnim = useState(new Animated.Value(1))[0];
  // const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setHeaderText("Saved");
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 500);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TamaguiProvider config={config}>
        <NavigationContainer>
          <GeneralStack.Navigator
            screenOptions={{
              headerTitle: headerText,
              headerTitleStyle: { opacity: fadeAnim, fontSize: 24 },
              headerTitleAlign: "center",
            }}
          >
            <GeneralStack.Screen name="Home" component={TabNavigationScreen} />
            <GeneralStack.Screen name="LyricsView" component={LyricsView} />
          </GeneralStack.Navigator>
        </NavigationContainer>
      </TamaguiProvider>
    </GestureHandlerRootView>
  );
}

// import React, { useState, useEffect } from "react";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import {
//   NavigationContainer,
//   useFocusEffect,
//   useNavigation,
//   CommonActions,
// } from "@react-navigation/native";
// import { View, Text, Animated, TouchableOpacity, Image } from "react-native";
// import { Popular } from "./components/Popular";
// import { Saved } from "./components/Saved";
// import { createStackNavigator } from "@react-navigation/stack";
// import { LyricsView } from "./components/LyricsView";
// import { TamaguiProvider } from "tamagui";
// import config from "./tamagui.config";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { BarChart, Library } from "@tamagui/lucide-icons";
// import { IconButton } from "react-native-paper";

// const Tab = createBottomTabNavigator();
// const SavedStack = createStackNavigator();
// const PopularStack = createStackNavigator();

// // Custom tab bar component
// const CustomTabBar = ({ state, descriptors, navigation }) => {
//   return (
//     // <SafeAreaView style={{ backgroundColor: "#3498db", paddingVertical: 0, }}>
//       <View
//         style={{
//           flexDirection: "row",
//           justifyContent: "space-around",
//           alignItems: "center",
//           marginVertical: 20,
//         }}
//       >
//         {/* Adjust the height as needed */}
//         {state.routes.map((route, index) => {
//           const { options } = descriptors[route.key];
//           const icon = options.tabBarIcon; // Extract tabBarIcon from options

//           const isFocused = state.index === index;

//           const onPress = () => {
//             const event = navigation.emit({
//               type: "tabPress",
//               target: route.key,
//               canPreventDefault: true,
//             });

//             if (!isFocused && !event.defaultPrevented) {
//               navigation.navigate(route.name);
//             }
//           };

//           return (
//             <IconButton
//               icon={icon}
//               size={24}
//               // color={isFocused ? "#fff" : "#ccc"}
//               onPress={onPress}
//               iconColor={isFocused ? "#fff" : "#ccc"}
//               style={{ flexGrow: 1, }}
//             />
//           );
//         })}
//       </View>
//     // </SafeAreaView>
//   );
// };

// // Stack navigator for the Saved tab
// function SavedStackScreen() {
//   const [headerText, setHeaderText] = useState("Gakuji");
//   const fadeAnim = useState(new Animated.Value(1))[0];
//   const navigation = useNavigation();

//   useEffect(() => {
//     setTimeout(() => {
//       Animated.timing(fadeAnim, {
//         toValue: 0,
//         duration: 500,
//         useNativeDriver: true,
//       }).start(() => {
//         setHeaderText("Saved");
//         Animated.timing(fadeAnim, {
//           toValue: 1,
//           duration: 500,
//           useNativeDriver: true,
//         }).start();
//       });
//     }, 500);
//   }, []);

//   return (
//     // <SafeAreaView style={{ flex: 1, backgroundColor: "#e74c3c" }}>
//     <SavedStack.Navigator
//       screenOptions={{
//         headerTitle: headerText,
//         headerTitleStyle: { opacity: fadeAnim, fontSize: 24 },
//         headerTitleAlign: "center",
//         headerStyle: { backgroundColor: "#e74c3c" }, // Custom header color
//         headerTintColor: "#fff", // Custom text color
//       }}
//     >
//       <SavedStack.Screen name="Saved" component={Saved} />
//       <SavedStack.Screen name="LyricsView" component={LyricsView} />
//       {/* Add more screens here if needed */}
//     </SavedStack.Navigator>
//     // </SafeAreaView>
//   );
// }

// // Stack navigator for the Popular tab
// function PopularStackScreen() {
//   return (
//     // <SafeAreaView style={{ flex: 1, backgroundColor: "#e74c3c" }}>
//     <PopularStack.Navigator>
//       <PopularStack.Screen name="Popular" component={Popular} />
//       {/* Add more screens here if needed */}
//     </PopularStack.Navigator>
//     // </SafeAreaView>
//   );
// }

// export default function App() {
//   const [headerText, setHeaderText] = useState("dummy text");
//   const fadeAnim = useState(new Animated.Value(1))[0];

//   useEffect(() => {
//     setTimeout(() => {
//       Animated.timing(fadeAnim, {
//         toValue: 0,
//         duration: 500,
//         useNativeDriver: true,
//       }).start(() => {
//         setHeaderText("Saved");
//         Animated.timing(fadeAnim, {
//           toValue: 1,
//           duration: 500,
//           useNativeDriver: true,
//         }).start();
//       });
//     }, 500);
//   }, []);

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <TamaguiProvider config={config}>
//         <NavigationContainer>
//           <Tab.Navigator
//             tabBar={(props) => <CustomTabBar {...props} />}
//             screenOptions={{
//               tabBarStyle: {
//                 backgroundColor: "#3498db", // Custom tab bar color
//               },
//               headerShown: false,
//             }}
//           >
//             <Tab.Screen
//               name="Saved Tab"
//               component={SavedStackScreen}
//               options={{
//                 tabBarIcon: ({ focused }) => (
//                   <Library size={24} color={focused ? "#fff" : "#ccc"} />
//                 ),
//               }}
//             />
//             <Tab.Screen
//               name="Popular Tab"
//               component={PopularStackScreen}
//               options={{
//                 tabBarIcon: ({ focused }) => (
//                   <BarChart size={24} color={focused ? "#fff" : "#ccc"} />
//                 ),
//               }}
//             />
//             {/* Add two additional screens: a kanji list and a profile */}
//           </Tab.Navigator>
//         </NavigationContainer>
//       </TamaguiProvider>
//     </GestureHandlerRootView>
//   );
// }
