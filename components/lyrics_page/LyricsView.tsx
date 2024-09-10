import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import SegmentedControl from "./SegmentedControl";
import { ClickableText } from "./LyricsText";
import KanjiSheet, { BottomSheetRefProps } from "./BottomDrawer";
import { IconButton } from "react-native-paper";
import { Bookmark, FileEdit } from "@tamagui/lucide-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { HiraganaText } from "./HiraganaText";
import { Gesture } from "react-native-gesture-handler";
import { APIClient, SongData } from "../../api-client/api"; // API client initialized
import { supabase } from "../../lib/supabase"; // Supabase client initialized

const { width } = Dimensions.get("window");
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const MAX_TRANSLATE_Y = -SCREEN_HEIGHT;

interface KanjiInfo {
  kanji: string;
  onyomi: {
    reading: string;
    romaji: string;
  };
  kunyomi: {
    reading: string;
    romaji: string;
  };
  meanings: string[];
}

export function LyricsView({ route, navigation }) {
  const { artist, title } = route.params;
  const [song, setSong] = useState<SongData | null>(null);
  const [kanjiActive, setKanjiActive] = useState(true);
  const [definition, setDefinition] = useState("invincible");
  const [word, setWord] = useState("無敵");
  const [furigana, setFurigana] = useState("むてき");
  const [romaji, setRomaji] = useState("muteki");
  const [partOfSpeech, setPartOfSpeech] = useState("adjective");
  const [kanjiList, setKanjiList] = useState<KanjiInfo[]>([]);

  const pagerRef = useRef<ScrollView>(null);
  const lyricsViewRef = useRef<Animated.ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewHeight = useSharedValue(0);
  const [topRowHeight, setTopRowHeight] = useState(0);
  const kanjiActiveShared = useSharedValue(kanjiActive ? 1 : 0);

  useEffect(() => {
    kanjiActiveShared.value = withTiming(kanjiActive ? 1 : 0, {
      duration: 200,
    });
  }, [kanjiActive]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: title,
    });
  }, [navigation, title]);

  const kanjiActiveStyle = useAnimatedStyle(() => {
    return {
      opacity: kanjiActiveShared.value,
    };
  });

  const kanjiInactiveStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - kanjiActiveShared.value,
    };
  });

  const handlePageChange = (event: any) => {
    const pageIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(pageIndex);
  };

  const ref = useRef<BottomSheetRefProps>(null);

  // Function to check if a character is kanji and fetch data
  function parseKanji(
    word: string,
    kanjiData: Record<string, any>
  ): KanjiInfo[] {
    const kanjiDetails = [];

    // Loop through each character in the word
    for (let i = 0; i < word.length; i++) {
      const char = word[i];

      // Check if character is in kanjiData
      if (kanjiData[char]) {
        const kanjiInfo = kanjiData[char];

        // Prepare onyomi and kunyomi data
        const onyomi = {
          reading: kanjiInfo.readings_on.join(", "),
        };

        const kunyomi = {
          reading: kanjiInfo.readings_kun.join(", "),
        };

        // Push kanji info to kanjiDetails array
        kanjiDetails.push({
          kanji: char,
          onyomi: onyomi,
          kunyomi: kunyomi,
          meanings: kanjiInfo.meanings,
        });
      }
    }

    return kanjiDetails;
  }

  const onPress = useCallback((word: React.SetStateAction<string>) => {
    const isClosed = ref?.current?.zeroPosition();
    if (isClosed) {
      ref?.current?.openBottomSheet(1);
    }
    const wordObj = song?.["word_mapping"][word][0];
    setWord(word);
    setFurigana(wordObj.furigana);
    setRomaji(wordObj.romaji);
    setPartOfSpeech(wordObj.definitions?.[0]?.pos?.join(", ") || ""); // Access pos safely
    setDefinition(wordObj.definitions?.[0]?.definition?.join(", ") || ""); // Access definition safely

    const kanjiList = parseKanji(word, song?.["kanji_data"]);
    setKanjiList(kanjiList);
  }, [song]);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const apiClient = await initializeApiClient();
        if (apiClient) {
          const response = await apiClient.getSong(title, artist);
          // console.log("Song response:", response);
          setSong(response);
        }
      } catch (error) {
        console.error("Failed to fetch song:", error);
      }
    };

    fetchSong();

    return () => {
      setKanjiActive(false); // Reset kanjiActive state when unmounting
    };
  }, [artist, title]);

  const initializeApiClient = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      const apiClient = new APIClient(session.access_token);
      return apiClient;
    }
    return null;
  };

  const onChange = (text: String) => {
    if (text === "hiragana") {
      setKanjiActive(false);
    } else {
      setKanjiActive(true);
    }
  };

  const setHeight = useCallback((height: number) => {
    scrollViewHeight.value = SCREEN_HEIGHT + height - 5;
  }, []);

  const rScrollViewHeight = useAnimatedStyle(() => {
    return {
      height: withTiming(scrollViewHeight.value, { duration: 300 }),
    };
  });

  return (
    <View style={styles.container}>
      <View
        style={styles.topRow}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          setTopRowHeight(height);
        }}
      >
        <View style={{ width: "100%" }}>
          <SegmentedControl onChange={onChange} />
        </View>
        <View style={{ alignItems: "flex-end", paddingRight: 16, flex: 1 }}>
          <IconButton
            icon={({ size, color }) => <FileEdit size={size} color={color} />}
            mode="outlined"
            onPress={() => console.log("Pressed")}
          />
        </View>
      </View>
      {kanjiActive && song && (
        <View>
          <Animated.View style={[rScrollViewHeight]} ref={lyricsViewRef}>
            <ClickableText lyrics={song["lyrics"]} onPress={onPress} />
          </Animated.View>
          <KanjiSheet ref={ref} activeIndex={activeIndex} setHeight={setHeight}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handlePageChange}
              scrollEventThrottle={16}
              ref={pagerRef}
            >
              <View style={styles.page}>
                <View style={styles.details}>
                  <Text style={styles.word}>{word}</Text>
                  <Text style={styles.definition}>{partOfSpeech}</Text>
                  <Text style={styles.romaji}>{romaji}</Text>
                  <Text style={styles.furigana}>{furigana}</Text>
                  <Text style={styles.definition}>{definition}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => console.log("Bookmark page 1")}
                  style={styles.bookmarkContainer}
                >
                  <Bookmark size={24} color="black" />
                </TouchableOpacity>
              </View>
              <View style={styles.page}>
                <View style={styles.kanjiContainer}>
                  {kanjiList.map((kanjiItem, index) => (
                    <View key={index} style={styles.kanjiRow}>
                      <View style={styles.kanjiItem}>
                        <Text style={styles.kanji}>{kanjiItem.kanji}</Text>
                        <Text style={styles.onyomi}>
                          Onyomi: {kanjiItem.onyomi.reading}
                        </Text>
                        <Text style={styles.kunyomi}>
                          Kunyomi: {kanjiItem.kunyomi.reading}
                        </Text>
                        <Text style={styles.meanings}>
                          Meanings: {kanjiItem.meanings.join(", ")}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() =>
                          console.log(`Bookmark ${kanjiItem.kanji}`)
                        }
                        style={styles.bookmarkContainer}
                      >
                        <Bookmark size={24} color="black" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          </KanjiSheet>
        </View>
      )}
      {!kanjiActive && song && (
        <ScrollView>
          <HiraganaText lyrics={song.hiragana_lyrics} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    marginVertical: 10,
  },
  page: {
    width: width,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  textContainer: {
    width: width,
    padding: 10,
  },
  kanjiContainer: {
    width: width,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  kanjiRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  kanjiItem: {
    flex: 1,
  },
  kanji: {
    fontSize: 24,
    fontWeight: "bold",
  },
  onyomi: {
    fontSize: 16,
  },
  kunyomi: {
    fontSize: 16,
  },
  meanings: {
    fontSize: 16,
  },
  word: {
    fontSize: 24,
    fontWeight: "bold",
  },
  definition: {
    fontSize: 16,
  },
  romaji: {
    fontSize: 16,
  },
  furigana: {
    fontSize: 16,
  },
  topRow: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  details: {
    width: width - 50,
    padding: 10,
  },
  bookmarkContainer: {
    margin: 10,
    alignItems: "center",
  },
});

export default LyricsView;
