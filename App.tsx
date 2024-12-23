import React, { useState, useEffect, useLayoutEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Animated, SafeAreaView } from "react-native";
import { Popular } from "./components/Popular";
import { Saved } from "./components/Saved";
import { createStackNavigator } from "@react-navigation/stack";
import { LyricsView } from "./components/lyrics_page/LyricsView";
import { TamaguiProvider } from "tamagui";
import config from "./tamagui.config";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LyricsEntryScreen } from "./components/new_entry/LyricEntry";
import { KanjiView } from "./components/AllKanjiListTab";
import {
  Globe,
  LibraryBig,
  NotebookText,
  SquareUserRound,
} from "@tamagui/lucide-icons";
import { KanjiListView } from "./components/kanji_page/KanjiList";
import { IndividualKanjiView } from "./components/kanji_page/IndividualKanjiPage";
import ProfilePage from "./components/ProfileView";
import { Session } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase";
import Auth from "./components/Authentication/Auth";

const Tab = createBottomTabNavigator();
const SavedStack = createStackNavigator();
const PopularStack = createStackNavigator();
const GeneralStack = createStackNavigator();

// Stack navigator for the Saved tab
function SavedStackScreen() {
  return (
    <SavedStack.Navigator
      screenOptions={{
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
        options={{
          tabBarIcon: ({ color, size }) => (
            <LibraryBig color={color} size={size} />
          ),
          tabBarLabel: () => null, // Hide the tab name
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            navigation.getParent()!.setOptions({
              headerTitle: "Saved",
            });
          },
        })}
      />
      <Tab.Screen
        name="Popular Tab"
        component={PopularStackScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Globe color={color} size={size} />,
          tabBarLabel: () => null, // Hide the tab name
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            navigation.getParent()!.setOptions({
              headerTitle: "Popular",
            });
          },
        })}
      />
      <Tab.Screen
        name="My Kanji Tab"
        component={KanjiView}
        options={{
          tabBarIcon: ({ color, size }) => (
            <NotebookText color={color} size={size} />
          ),
          tabBarLabel: () => null, // Hide the tab name
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            navigation.getParent()!.setOptions({
              headerTitle: "My Kanji",
            });
          },
        })}
      />
      <Tab.Screen
        name="My Profile Tab"
        component={ProfilePage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <SquareUserRound color={color} size={size} />
          ),
          tabBarLabel: () => null, // Hide the tab name
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            navigation.getParent()!.setOptions({
              headerTitle: "Me",
            });
          },
        })}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [headerText, setHeaderText] = useState("Gakuji");
  const fadeAnim = useState(new Animated.Value(1))[0];

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

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);
  {}

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TamaguiProvider config={config}>
        <NavigationContainer>
          {session && session.user ? (
            <GeneralStack.Navigator
              screenOptions={{
                headerTitle: headerText,
                headerTitleStyle: { opacity: fadeAnim, fontSize: 24 },
                headerTitleAlign: "center",
              }}
            >
              <GeneralStack.Screen
                name="Home"
                component={TabNavigationScreen}
              />
              <GeneralStack.Screen name="LyricsView" component={LyricsView} />
              <GeneralStack.Screen
                name="LyricsEntry"
                component={LyricsEntryScreen}
                listeners={({ navigation }) => ({
                  focus: (e) => {
                    navigation.setOptions({
                      headerTitle: "New Song",
                    });
                  },
                })}
              />
              <GeneralStack.Screen
                name="KanjiListView"
                component={KanjiListView}
              />
              <GeneralStack.Screen
                name="IndividualKanjiView"
                component={IndividualKanjiView}
              />
            </GeneralStack.Navigator>
          ) : (
            <Auth />
          )}
        </NavigationContainer>
      </TamaguiProvider>
    </GestureHandlerRootView>
  );
}
