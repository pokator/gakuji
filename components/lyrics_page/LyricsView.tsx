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

const { width } = Dimensions.get("window");
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const MAX_TRANSLATE_Y = -SCREEN_HEIGHT;

const lyrics = [
  // Intro
  [
    { word: "無敵", definition: "invincible" },
    { word: "の", definition: "of" },
    { word: "笑顔", definition: "smile" },
    { word: "で", definition: "with" },
    { word: "荒らす", definition: "to disrupt" },
    { word: "メディア", definition: "media" },
  ],
  [
    { word: "知りたい", definition: "to want to know" },
    { word: "その", definition: "that" },
    { word: "秘密", definition: "secret" },
    { word: "ミステリアス", definition: "mysterious" },
  ],
  [
    { word: "抜けてる", definition: "stand out" },
    { word: "とこ", definition: "place" },
    { word: "さえ", definition: "even" },
    { word: "彼女", definition: "she" },
    { word: "の", definition: "of" },
    { word: "エリア", definition: "area" },
  ],
  [
    { word: "完璧", definition: "perfect" },
    { word: "で", definition: "in" },
    { word: "嘘つき", definition: "liar" },
    { word: "な", definition: "is" },
    { word: "君", definition: "you" },
    { word: "は", definition: "are" },
  ],
  [
    { word: "天才的", definition: "genius-like" },
    { word: "な", definition: "is" },
    { word: "アイドル", definition: "idol" },
  ],
  [{ word: "(You're my savior, you're my saving grace)" }],

  // Verse 1
  [
    { word: "今日", definition: "today" },
    { word: "何", definition: "what" },
    { word: "食べた", definition: "ate" },
    { word: "？", definition: "?" },
    { word: "好き", definition: "favorite" },
    { word: "な", definition: "is" },
    { word: "本", definition: "book" },
    { word: "は", definition: "is" },
    { word: "？", definition: "?" },
    { word: "遊び", definition: "play" },
  ],
  [
    { word: "に", definition: "to" },
    { word: "行く", definition: "go" },
    { word: "なら", definition: "if" },
    { word: "どこ", definition: "where" },
    { word: "に", definition: "to" },
    { word: "行く", definition: "go" },
    { word: "の", definition: "of" },
    { word: "？", definition: "?" },
    { word: "何", definition: "what" },
    { word: "も", definition: "even" },
    { word: "食べて", definition: "eat" },
  ],
  [
    { word: "ない", definition: "not" },
    { word: "それ", definition: "that" },
    { word: "は", definition: "is" },
    { word: "内緒", definition: "secret" },
    { word: "何", definition: "what" },
    { word: "を", definition: "object marker" },
    { word: "聞かれて", definition: "asked" },
    { word: "も", definition: "even" },
    { word: "のらりくらり", definition: "evasively" },
  ],

  // Verse 2
  [
    { word: "そう", definition: "so" },
    { word: "淡々", definition: "calmly" },
    { word: "と", definition: "and" },
    { word: "だけど", definition: "but" },
    { word: "燦々", definition: "brilliantly" },
    { word: "と", definition: "and" },
    { word: "見えそう", definition: "seems to be visible" },
  ],
  [
    { word: "で", definition: "in" },
    { word: "見えない", definition: "invisible" },
    { word: "秘密", definition: "secret" },
    { word: "は", definition: "is" },
    { word: "蜜", definition: "honey" },
    { word: "の", definition: "of" },
    { word: "味", definition: "flavor" },
    { word: "あれ", definition: "that" },
  ],
  [
    { word: "も", definition: "also" },
    { word: "ない", definition: "not" },
    { word: "ない", definition: "no" },
    { word: "ない", definition: "no" },
    { word: "これ", definition: "this" },
    { word: "も", definition: "also" },
    { word: "ない", definition: "not" },
    { word: "ない", definition: "no" },
    { word: "ない", definition: "no" },
  ],
  [
    { word: "好き", definition: "favorite" },
    { word: "な", definition: "is" },
    { word: "タイプ", definition: "type" },
    { word: "は", definition: "is" },
    { word: "？", definition: "?" },
    { word: "相手", definition: "partner" },
    { word: "は", definition: "is" },
    { word: "？", definition: "?" },
    { word: "さあ", definition: "come on" },
  ],
  [{ word: "答えて", definition: "answer" }],

  // Pre-Chorus
  [
    { word: "「誰か", definition: '"Someone' },
    { word: "を", definition: "to" },
    { word: "好き", definition: "like" },
    { word: "に", definition: "to" },
    { word: "なる", definition: "become" },
  ],
  [
    { word: "こと", definition: "thing" },
    { word: "なんて", definition: '"such' },
    { word: "私", definition: "I" },
    { word: "分から", definition: "understand" },
    { word: "なくて", definition: "not" },
    { word: "さ」", definition: '"' },
  ],
  [
    { word: "嘘", definition: "lie" },
    { word: "か", definition: "or" },
    { word: "本当", definition: "true" },
    { word: "か", definition: "or" },
    { word: "知り得", definition: "know" },
    { word: "ない", definition: "not" },
  ],
  [
    { word: "そんな", definition: "such" },
    { word: "言葉", definition: "words" },
    { word: "に", definition: "to" },
    { word: "また", definition: "again" },
    { word: "一人", definition: "one person" },
    { word: "堕ちる", definition: "fall" },
  ],
  [
    { word: "また", definition: "again" },
    { word: "好き", definition: "like" },
    { word: "に", definition: "to" },
    { word: "させる", definition: "let" },
  ],

  // Chorus
  [
    { word: "誰も", definition: "everyone" },
    { word: "が", definition: "subject marker" },
    { word: "目", definition: "eye" },
    { word: "を", definition: "object marker" },
    { word: "奪われて", definition: "captivated" },
  ],
  [
    { word: "いく", definition: "go" },
    { word: "君", definition: "you" },
    { word: "は", definition: "are" },
    { word: "完璧", definition: "perfect" },
    { word: "で", definition: "in" },
  ],
  [
    { word: "究極", definition: "ultimate" },
    { word: "の", definition: "of" },
    { word: "アイドル", definition: "idol" },
    { word: "金輪際", definition: "forever" },
  ],
  [
    { word: "現れない", definition: "won't appear" },
    { word: "一番星", definition: "first star" },
    { word: "の", definition: "of" },
    { word: "生まれ変わり", definition: "rebirth" },
  ],
  [
    { word: "Ah", definition: "Ah" },
    { word: "、", definition: "," },
    { word: "その", definition: "that" },
    { word: "笑顔", definition: "smile" },
    { word: "で", definition: "with" },
    { word: "愛してる", definition: "love" },
    { word: "で", definition: "with" },
  ],
  [
    { word: "誰も", definition: "everyone" },
    { word: "彼", definition: "he" },
    { word: "も", definition: "also" },
    { word: "虜", definition: "captivated" },
    { word: "に", definition: "to" },
    { word: "していく", definition: "make" },
  ],
  [
    { word: "その", definition: "that" },
    { word: "瞳", definition: "eyes" },
    { word: "が", definition: "are" },
    { word: "その", definition: "that" },
    { word: "言葉", definition: "words" },
    { word: "が", definition: "are" },
    { word: "嘘", definition: "lie" },
  ],
  [
    { word: "でも", definition: "but" },
    { word: "それ", definition: "that" },
    { word: "は", definition: "is" },
    { word: "完全", definition: "complete" },
    { word: "な", definition: "is" },
    { word: "アイ", definition: "eye" },
  ],

  // Verse 3
  [
    { word: "はい", definition: "yes" },
    { word: "はい", definition: "yes" },
    { word: "あの", definition: "that" },
    { word: "子", definition: "child" },
    { word: "は", definition: "is" },
    { word: "特別", definition: "special" },
    { word: "です", definition: "is" },
  ],
  [
    { word: "我々", definition: "we" },
    { word: "は", definition: "are" },
    { word: "ハナ", definition: "flower" },
    { word: "から", definition: "from" },
    { word: "おまけ", definition: "bonus" },
    { word: "です", definition: "is" },
  ],
  [
    { word: "お星様", definition: "star" },
    { word: "の", definition: "of" },
    { word: "引き立て役", definition: "supporting role" },
    { word: "B", definition: "B" },
    { word: "です", definition: "is" },
  ],
  [
    { word: "全て", definition: "all" },
    { word: "が", definition: "subject marker" },
    { word: "あの", definition: "that" },
    { word: "子", definition: "child" },
    { word: "の", definition: "of" },
    { word: "お陰", definition: "thanks to" },
    { word: "な", definition: "not" },
    { word: "わけ", definition: "reason" },
    { word: "ない", definition: "not" },
  ],
  [
    { word: "洒落臭い", definition: "smug" },
    { word: "妬み", definition: "envy" },
    { word: "嫉妬", definition: "jealousy" },
    { word: "なんて", definition: "such as" },
    { word: "ない", definition: "not" },
  ],
  [
    { word: "わけ", definition: "reason" },
    { word: "が", definition: "subject marker" },
    { word: "ない", definition: "not" },
    { word: "これ", definition: "this" },
    { word: "は", definition: "is" },
    { word: "ネタ", definition: "joke" },
    { word: "じゃ", definition: "is not" },
    { word: "ない", definition: "not" },
  ],
  [
    { word: "からこそ", definition: "for that reason" },
    { word: "許せない", definition: "unforgivable" },
    { word: "完璧", definition: "perfect" },
    { word: "じゃ", definition: "is not" },
    { word: "ない", definition: "not" },
  ],
  [
    { word: "君", definition: "you" },
    { word: "じゃ", definition: "is not" },
    { word: "許せない", definition: "unforgivable" },
    { word: "自分", definition: "self" },
    { word: "を", definition: "object marker" },
    { word: "許せない", definition: "can't forgive" },
  ],
  [
    { word: "誰", definition: "who" },
    { word: "より", definition: "more than" },
    { word: "も", definition: "also" },
    { word: "強い", definition: "stronger" },
    { word: "君", definition: "you" },
    { word: "以外", definition: "other than" },
    { word: "は", definition: "are" },
    { word: "認めない", definition: "not accepted" },
  ],

  // Chorus
  [
    { word: "誰も", definition: "everyone" },
    { word: "が", definition: "subject marker" },
    { word: "信じ", definition: "believe" },
    { word: "崇め", definition: "worship" },
    { word: "てる", definition: "ing" },
  ],
  [
    { word: "まさに", definition: "exactly" },
    { word: "最強", definition: "strongest" },
    { word: "で", definition: "in" },
    { word: "無敵", definition: "invincible" },
    { word: "の", definition: "of" },
    { word: "アイドル", definition: "idol" },
  ],
  [
    { word: "弱点", definition: "weakness" },
    { word: "なんて", definition: "such as" },
    { word: "見当たら", definition: "cannot be found" },
    { word: "ない", definition: "not" },
  ],
  [
    { word: "一番星", definition: "first star" },
    { word: "を", definition: "object marker" },
    { word: "宿し", definition: "lodge" },
    { word: "て", definition: "ing" },
    { word: "いる", definition: "is" },
  ],
  [
    { word: "弱い", definition: "weak" },
    { word: "とこ", definition: "place" },
    { word: "なんて", definition: "such as" },
    { word: "見せちゃ", definition: "showing" },
    { word: "ダメ", definition: "no good" },
    { word: "ダメ", definition: "no good" },
  ],
  [
    { word: "知りたく", definition: "want to know" },
    { word: "ない", definition: "not" },
    { word: "とこ", definition: "place" },
    { word: "は", definition: "is" },
    { word: "見せず", definition: "without showing" },
    { word: "に", definition: "to" },
  ],
  [
    { word: "唯一無二", definition: "one and only" },
    { word: "じゃ", definition: "is not" },
    { word: "なく", definition: "not" },
    { word: "ちゃ", definition: "no" },
    { word: "イヤ", definition: "no" },
    { word: "イヤ", definition: "no" },
  ],
  [
    { word: "それ", definition: "that" },
    { word: "こそ", definition: "indeed" },
    { word: "本物", definition: "genuine" },
    { word: "の", definition: "of" },
    { word: "アイ", definition: "eye" },
  ],

  // Bridge
  [
    { word: "得意", definition: "skillful" },
    { word: "の", definition: "of" },
    { word: "笑顔", definition: "smile" },
    { word: "で", definition: "with" },
    { word: "沸かす", definition: "stir up" },
    { word: "メディア", definition: "media" },
  ],
  [
    { word: "隠し", definition: "hide" },
    { word: "きる", definition: "completely" },
    { word: "この", definition: "this" },
    { word: "秘密", definition: "secret" },
    { word: "だけ", definition: "only" },
    { word: "は", definition: "is" },
  ],
  [
    { word: "愛してる", definition: "love" },
    { word: "って", definition: "saying" },
    { word: "嘘", definition: "lie" },
    { word: "で", definition: "with" },
    { word: "積む", definition: "accumulate" },
    { word: "キャリア", definition: "career" },
  ],
  [
    { word: "これ", definition: "this" },
    { word: "こそ", definition: "indeed" },
    { word: "私", definition: "I" },
    { word: "なり", definition: "becoming" },
    { word: "の", definition: "of" },
    { word: "愛", definition: "love" },
    { word: "だ", definition: "is" },
  ],
  [
    { word: "流れる", definition: "flowing" },
    { word: "汗", definition: "sweat" },
    { word: "も", definition: "also" },
    { word: "綺麗", definition: "beautiful" },
    { word: "な", definition: "is" },
    { word: "アクア", definition: "aqua" },
  ],
  [
    { word: "ルビー", definition: "ruby" },
    { word: "を", definition: "object marker" },
    { word: "隠し", definition: "hide" },
    { word: "た", definition: "past tense" },
    { word: "この", definition: "this" },
    { word: "瞼", definition: "eyelid" },
  ],
  [
    { word: "歌い", definition: "sing" },
    { word: "踊り", definition: "dance" },
    { word: "舞う", definition: "perform" },
    { word: "私", definition: "I" },
    { word: "は", definition: "am" },
    { word: "マリア", definition: "Maria" },
  ],
  [
    { word: "そう", definition: "so" },
    { word: "嘘", definition: "lie" },
    { word: "は", definition: "is" },
    { word: "とびきり", definition: "super" },
    { word: "の", definition: "of" },
    { word: "愛", definition: "love" },
    { word: "だ", definition: "is" },
  ],

  // Pre-Chorus
  [
    { word: "誰か", definition: "someone" },
    { word: "に", definition: "to" },
    { word: "愛され", definition: "be loved" },
    { word: "た", definition: "past tense" },
    { word: "こと", definition: "thing" },
    { word: "も", definition: "also" },
  ],
  [
    { word: "誰か", definition: "someone" },
    { word: "の", definition: "of" },
    { word: "こと", definition: "thing" },
    { word: "愛し", definition: "love" },
    { word: "た", definition: "past tense" },
    { word: "こと", definition: "thing" },
    { word: "も", definition: "also" },
    { word: "な", definition: "not" },
  ],

  // Outro
  [
    { word: "あ", definition: "Ah" },
    { word: "やっと", definition: "finally" },
    { word: "言えた", definition: "said" },
  ],
  [
    { word: "これ", definition: "this" },
    { word: "は", definition: "is" },
    { word: "絶対", definition: "absolute" },
    { word: "嘘", definition: "lie" },
    { word: "じゃ", definition: "is not" },
    { word: "ない", definition: "not" },
    { word: "愛してる", definition: "love" },
  ],
  [{ word: "(You're my savior, my true savior, my saving grace)" }],
];

const hiraganaLyrics = [
  "むてき の えがお で あらす メヂィア",
  "しりたい その ひみつ ミステリアス",
  "ぬけてる とこ さえ かのじょ の エリア",
  "かんぺき で うそつき な きみ は",
  "てんさい てき な アイドル さま",
  "",
  "きょう なに たべた？",
  "すき な ほん は？",
  "あそび に いく なら どこ に いく の？",
  "なにも たべてない",
  "それ は ないしょ",
  "なに を きかれても",
  "のらり くらり",
  "",
  "そう たんたん と",
  "だけど さんさん と",
  "みえそう で みえない ひみつ は みつ の あじ",
  "あれ も ない ない ない",
  "これ も ない ない ない",
  "すき な タイプ は？",
  "あいて は？",
  "さあ こたえて",
  "",
  "「だれか を すき に なる こと なんて わたし わからなくて さ」",
  "うそ か ほんとう か しりえない",
  "そんな ことば に また ひとり おちる",
  "また すき に させる",
  "",
  "だれも が め を うばわれて いく",
  "きみ は かんぺき で きゅうよく の アイドル",
  "こんりんざい あらわれない",
  "いちばん ぼし の うまれかわり",
  "その えがお で あいしてる で",
  "だれも かれ も とりこ に して いく",
  "その ひとみ が その ことば が",
  "うそ でも それ は かんぜん な アイ",
  "",
  "はいはい あの こ は とくべつ です",
  "われわれ は はな から おまけ です",
  "おほしさま の ひきたて やく B です",
  "すべて が あの こ の おかげ な わけ ない",
  "しゃら くさい",
  "ねたみ しっと なんて ない わけ が ない",
  "これ は ネタ じゃない",
  "から こそ ゆるせない",
  "かんぺき じゃない きみ じゃ ゆるせない",
  "じぶん を ゆるせない",
  "だれ より も つよい きみ いがい はみとめない",
  "",
  "だれも が しんじ あがめてる",
  "まさに さいきょう で むてき の アイドル",
  "じゃくてん なんて みあたらない",
  "いちばん ぼし を やどしている",
  "よわい とこ なんて みせちゃ ダメ ダメ",
  "しりたくない とこ は みせず に",
  "ゆいいつ むぬ じゃなくちゃ イヤイヤ",
  "それ こそ ほんもの の アイ",
  "",
  "とくい の えがお で わかす メヂィア",
  "かくしきる この ひみつ だけ は",
  "あいしてる って うそ で つむ キャリア",
  "これ こそ わたし なり の あい だ",
  "ながれる あせ も きれい な アクア",
  "ルビー を かくした この まぶた",
  "うたい おどりまう わたし は マリア",
  "そう うそ は とびきり の あい だ",
  "",
  "だれか に あいされた こと も",
  "だれか の こと あいした こと も ない",
  "そんな わたし の うそ が いつか ほんと に なる こと",
  "しんじてる",
  "",
  "いつか きっと ぜんぶ て に いれる",
  "わたし は そう よくばり な アイドル",
  "とうしんだい で みんな の こと",
  "ちゃんと あいしたい から",
  "きょう も うそ を つく の",
  "この ことば が いつか ほんと に なる ひ を ねがって",
  "それ でも まだ",
  "きみ と きみ に だけ は いえず に いた けど",
  "やっと いえた",
  "これ は ぜったい うそ じゃない",
  "あいしてる",
];

export function LyricsView({ route, navigation }) {
  const { artist, title } = route.params;

  const [kanjiActive, setKanjiActive] = useState(true);

  const [definition, setDefinition] = useState("invincible");
  const [word, setWord] = useState("無敵");
  const [furigana, setFurigana] = useState("むてき");
  const [romaji, setRomaji] = useState("muteki");
  const [partOfSpeech, setPartOfSpeech] = useState("adjective");
  const [kanjiList, setKanjiList] = useState([
    {
      kanji: "無",
      onyomi: {
        reading: "ム",
        romaji: "mu",
      },
      kunyomi: {
        reading: "ない",
        romaji: "nai",
      },
      meanings: ["nothing", "naught", "nil", "zero"],
    },
    {
      kanji: "敵",
      onyomi: {
        reading: "テキ",
        romaji: "teki",
      },
      kunyomi: {
        reading: "かたき",
        romaji: "kataki",
      },
      meanings: ["enemy", "foe", "opponent"],
    },
  ]);

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
      headerTitle: `${title}`,
    });
  }, [navigation]);

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

  const onPress = useCallback((definition: React.SetStateAction<string>) => {
    const isClosed = ref?.current?.zeroPosition();
    if (isClosed) {
      ref?.current?.openBottomSheet(1);
    }

    setDefinition(definition);
  }, []);

  useEffect(() => {
    // ref?.current?.openBottomSheet(2);
    return () => {
      // Cleanup actions here
      setKanjiActive(false); // Reset kanjiActive state when unmounting
    };
  }, []);

  const onChange = (text: String) => {
    // Do something when the segmented control is changed
    if (text === "hiragana") {
      setKanjiActive(false);
    } else {
      setKanjiActive(true);
      // ref?.current?.openBottomSheet(2);
    }
  };

  const setHeight = useCallback((height: number) => {
    console.log(SCREEN_HEIGHT - height * -1 - 5);
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
      {kanjiActive && (
        <View>
          <Animated.View style={[rScrollViewHeight]} ref={lyricsViewRef}>
            <ClickableText lyrics={lyrics} onPress={onPress} />
          </Animated.View>
          <KanjiSheet ref={ref} activeIndex={activeIndex} setHeight={setHeight}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              // style={styles.scrollView}
              // contentContainerStyle={{width: width * 2}}
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
                {/* Icon button for page 1 */}
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
                          Onyomi: {kanjiItem.onyomi.reading} (
                          {kanjiItem.onyomi.romaji})
                        </Text>
                        <Text style={styles.kunyomi}>
                          Kunyomi: {kanjiItem.kunyomi.reading} (
                          {kanjiItem.kunyomi.romaji})
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
      {/* </Animated.View> */}
      {/* <Animated.View style={[kanjiInactiveStyle, { height: "95%" }]}> */}
      {!kanjiActive && (
        <ScrollView>
          <HiraganaText lyrics={hiraganaLyrics} />
        </ScrollView>
      )}
      {/* </Animated.View> */}
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
  text: {
    marginLeft: 16,
    fontSize: 20,
    textAlign: "left",
    flex: 1,
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 16,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flex: 1, // Occupy remaining space
  },
  dot: {
    marginRight: 2,
  },
  buttonsContainer: {
    flexDirection: "row",
    flex: 1, // Occupy remaining space
    justifyContent: "flex-end",
    marginRight: 16,
  },
  scrollView: {
    backgroundColor: "red",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  bookmarkContainer: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "flex-end",
    // alignContent: "center",
    marginRight: 20,
  },
  details: {
    flex: 5,
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 20,
  },
  word: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  romaji: {
    fontSize: 18,
    color: "gray",
    marginBottom: 4,
  },
  furigana: {
    fontSize: 18,
    color: "gray",
    marginBottom: 16,
  },
  definition: {
    fontSize: 16,
    lineHeight: 24,
  },
  kanjiContainer: {
    flex: 5,
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 20,
  },
  kanjiRow:{
    flexDirection: "row",
    alignItems: "flex-start",
    // justifyContent: "space-between",
    marginBottom: 20,
  },
  kanjiItem: {
    marginBottom: 20,
  },
  kanji: {
    fontSize: 30,
    fontWeight: "bold",
  },
  onyomi: {
    fontSize: 18,
    color: "gray",
  },
  kunyomi: {
    fontSize: 18,
    color: "gray",
  },
  meanings: {
    fontSize: 16,
    color: "black",
  },
});
