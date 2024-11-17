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
  SafeAreaView,
} from "react-native";
import SegmentedControl from "./SegmentedControl";
import { ClickableText } from "./LyricsText";
import KanjiSheet, { BottomSheetRefProps } from "./BottomDrawer";
import { Bookmark, FileEdit } from "@tamagui/lucide-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { HiraganaText } from "./HiraganaText";
import { APIClient, SongData } from "../../api-client/api"; // API client initialized
import { supabase } from "../../lib/supabase"; // Supabase client initialized
import ModalComponent from "./ListModal";

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

interface WordDefinition {
  definition: string[];
  pos: string[];
}

export function LyricsView({ route, navigation }) {
  const { artist, title } = route.params;
  const [song, setSong] = useState<SongData | null>(null);
  const [kanjiActive, setKanjiActive] = useState(true);

  // Update state definitions
  const [compositeWord, setCompositeWord] = useState({
    word: "",
    definitions: [], // Will now hold array of definition objects
    definitionIndex: 0,
  });

  const [rootWord, setRootWord] = useState({
    word: "",
    definitions: [], // Will now hold array of definition objects
    definitionIndex: 0,
  });

  // State for suffixes
  const [suffixes, setSuffixes] = useState([]);
  const [kanjiList, setKanjiList] = useState<KanjiInfo[]>([]);

  const pagerRef = useRef<ScrollView>(null);
  const lyricsViewRef = useRef<Animated.ScrollView>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  
  const scrollViewHeight = useSharedValue(0);
  const [topRowHeight, setTopRowHeight] = useState(0);
  const kanjiActiveShared = useSharedValue(kanjiActive ? 1 : 0);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedKanji, setSelectedKanji] = useState<string>("");

  const openModal = (kanji: string) => {
    setSelectedKanji(kanji);
    setModalVisible(true);
  };

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

  // const onPress = useCallback(
  //   (word: React.SetStateAction<string>) => {
  //     const isClosed = ref?.current?.zeroPosition();
  //     if (isClosed) {
  //       ref?.current?.openBottomSheet(1);
  //     }
  //     const wordObj = song?.["word_mapping"][word];

  //     setWord(word);
  //     setFurigana(wordObj.furigana);
  //     setRomaji(wordObj.romaji);
  //     setPartOfSpeech(wordObj.definitions?.[0]?.pos || []);
  //     setIdseq(wordObj.idseq);
  //     setDefinitions(wordObj.definitions || []);
  //     setDefinitionIndex(0);

  //     const kanjiList = parseKanji(word, song?.["kanji_data"]);
  //     setKanjiList(kanjiList);
  //   },
  //   [song]
  // );

  const onPress = useCallback(
    (word: React.SetStateAction<string>) => {
      const isClosed = ref?.current?.zeroPosition();
      if (isClosed) {
        ref?.current?.openBottomSheet(1);
      }
      const wordObj = song?.["word_mapping"]?.[word];
      if (!wordObj) {
        console.error("Word object not found for:", word);
        return;
      }

      console.log("Processing word object:", wordObj);

      // Update composite word state
      if (wordObj.composite && Array.isArray(wordObj.composite)) {
        setCompositeWord({
          word: word,
          definitions: wordObj.composite.map((def) => ({
            furigana: def.furigana || "",
            romaji: def.romaji || "",
            definitions: Array.isArray(def.definitions) ? def.definitions : [],
            idseq: def.idseq || "",
          })),
          definitionIndex: 0,
        });
      } else {
        setCompositeWord({
          word: "",
          definitions: [],
          definitionIndex: 0,
        });
      }

      // Update root word state
      if (wordObj.root && Array.isArray(wordObj.root)) {
        setRootWord({
          word: wordObj.root[0]?.word || wordObj.root[0]?.surface || "",
          definitions: wordObj.root.map((def) => ({
            furigana: def.furigana || "",
            romaji: def.romaji || "",
            definitions: Array.isArray(def.definitions) ? def.definitions : [],
            idseq: def.idseq || "",
          })),
          definitionIndex: 0,
        });
      } else {
        setRootWord({
          word: "",
          definitions: [],
          definitionIndex: 0,
        });
      }

      // Update suffixes state (unchanged as it was already handling arrays correctly)
      setSuffixes(Array.isArray(wordObj.suffixes) ? wordObj.suffixes : []);

      const kanjiList = parseKanji(word, song?.["kanji_data"]);
      setKanjiList(kanjiList);
    },
    [song]
  );
  // Update WordSection component to handle the data more robustly
  const WordSection = ({ data, title }) => {
    if (!data || !data.word || !data.definitions?.length) return null;

    const currentDef = data.definitions[data.definitionIndex];

    return (
      <View style={styles.section}>
        <View style={styles.kanjiRow}>
          <Text style={styles.word}>{data.word}</Text>
          <View style={styles.definitionSelector}>
            <View style={styles.definitionSelectorButtons}>
              {data.definitions
                .filter(
                  (definition) =>
                    definition &&
                    definition.romaji &&
                    definition.furigana &&
                    definition.definitions
                )
                .map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      if (title === "Complete Word") {
                        setCompositeWord((prev) => ({
                          ...prev,
                          definitionIndex: index,
                        }));
                      } else {
                        setRootWord((prev) => ({
                          ...prev,
                          definitionIndex: index,
                        }));
                      }
                    }}
                    style={[
                      styles.definitionSelectorItem,
                      data.definitionIndex === index &&
                        styles.definitionSelectorItemActive,
                    ]}
                  >
                    <Text style={styles.definitionSelectorText}>
                      {index + 1}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        </View>
        <View style={styles.kanjiRow}>
          <View style={styles.kanjiItem}>
            <Text style={styles.romaji}>{currentDef.romaji}</Text>
            <Text style={styles.furigana}>{currentDef.furigana}</Text>
            {currentDef.definitions?.filter(Boolean).map((def, index) => (
              <View key={index} style={styles.definitionContainer}>
                {def.pos?.length > 0 && (
                  <Text style={styles.partOfSpeech}>
                    ({def.pos.join(", ")})
                  </Text>
                )}
                <Text style={styles.definition}>
                  {def.definition.join(", ")}
                </Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            onPress={() => openModal(data.idseq)}
            style={styles.bookmarkContainer}
          >
            <Bookmark size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const SuffixSection = ({ suffixes }) => {
    if (!suffixes?.length) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suffixes</Text>
        {suffixes.filter(Boolean).map((suffix, index) => (
          <View key={index} style={styles.suffixItem}>
            <Text style={styles.suffixToken}>{suffix.token}</Text>
            <Text style={styles.suffixDetail}>
              Root form: {suffix.root_form}
            </Text>
            <Text style={styles.suffixDetail}>Furigana: {suffix.furigana}</Text>
            <Text style={styles.suffixDetail}>Romaji: {suffix.romaji}</Text>
            <Text style={styles.suffixDetail}>Meaning: {suffix.meaning}</Text>
          </View>
        ))}
      </View>
    );
  };

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

  useEffect(() => {
    setCompositeWord({
      word: "",
      definitions: [],
      definitionIndex: 0,
    });
    setRootWord({
      word: "",
      definitions: [],
      definitionIndex: 0,
    });
    setSuffixes([]);
  }, []);

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

  const rHiraganaViewHeight = useAnimatedStyle(() => {
    return {
      height: SCREEN_HEIGHT - 150,
    };
  });

  //present a modal with a list of checkboxes and a submit and cancel button

  return (
    <SafeAreaView style={styles.container}>
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
        {/* <View style={{ alignItems: "flex-end", paddingRight: 16, flex: 1 }}>
          <IconButton
            icon={({ size, color }) => <FileEdit size={size} color={color} />}
            mode="outlined"
            onPress={() => console.log("Pressed")}
          />
        </View> */}
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
                <ScrollView style={styles.kanjiContainer}>
                  {compositeWord.word && (
                    <WordSection data={compositeWord} title="Complete Word" />
                  )}
                </ScrollView>
              </View>
              <View style={styles.page}>
                <View style={styles.kanjiContainer}>
                  {rootWord.word && (
                    <WordSection data={rootWord} title="Root Word" />
                  )}
                  {suffixes.length > 0 && <SuffixSection suffixes={suffixes} />}
                </View>
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
                        onPress={() => openModal(kanjiItem.kanji)}
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
        <SafeAreaView>
          <Animated.View style={[rHiraganaViewHeight]}>
            <HiraganaText lyrics={song.hiragana_lyrics} />
          </Animated.View>
        </SafeAreaView>
      )}
      <ModalComponent
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        term={selectedKanji}
        activeIndex={activeIndex}
        title={title}
        artist={artist}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginVertical: 10,
  },
  alignment: {
    // marginHorizontal: 10,
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
    flex: 1,
  },
  bookmarkContainer: {
    margin: 10,
    alignItems: "center",
  },
  definitionSelector: {
    flexDirection: "column",
  },
  partOfSpeech: {
    fontSize: 12, // Smaller font
    color: "#666",
  },
  section: {
    marginBottom: 8, // Reduced margin
    padding: 12, // Reduced padding
    backgroundColor: "#fff",
    borderRadius: 6, // Reduced border radius
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3, // Reduced shadow radius
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 14, // Reduced font size
    fontWeight: "600",
    color: "#666",
    marginBottom: 4, // Reduced margin
  },

  suffixItem: {
    marginTop: 8, // Reduced margin
    paddingTop: 8, // Reduced padding
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },

  suffixToken: {
    fontSize: 16, // Reduced font size
    fontWeight: "500",
    marginBottom: 2, // Reduced margin
  },

  suffixDetail: {
    fontSize: 12, // Reduced font size
    color: "#666",
    marginBottom: 1, // Reduced margin
  },

  definitionContainer: {
    marginTop: 6, // Reduced margin
  },

  definitionSelectorButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 6, // Reduced margin
  },

  definitionSelectorItem: {
    padding: 6, // Reduced padding
    marginHorizontal: 3, // Reduced margin
    borderRadius: 3, // Reduced border radius
    backgroundColor: "#eee",
  },

  definitionSelectorItemActive: {
    backgroundColor: "#007AFF",
  },

  definitionSelectorText: {
    fontSize: 12, // Reduced font size
    color: "#000",
  },
  definitionSelectorTextActive: {
    color: "#fff",
  },
});

export default LyricsView;
