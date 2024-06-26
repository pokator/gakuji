import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

interface KanjiCardProps {
  kanji: string;
  readings: string[];
  meanings: string[];
  navigation: any;
  type: string;
}

const KanjiCard: React.FC<KanjiCardProps> = ({
  kanji,
  readings,
  meanings,
  navigation,
  type,
}) => {
  const handlePress = () => {
    navigation.navigate("IndividualKanjiView", {
      kanji,
      readings,
      meanings,
      type
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.cardContent}>
        <Text style={styles.kanji}>{kanji}</Text>
        <View style={styles.details}>
          <Text style={styles.readings}>{readings.join(", ")}</Text>
          <Text style={styles.meanings}>{meanings.join(", ")}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

interface KanjiListProps {
  data: DataItem[];
  navigation: any;
  type: string;
}

interface DataItem {
  id: string;
  kanji: string;
  readings: string[];
  meanings: string[];
}

const dummyData: DataItem[] = [
  {
    id: "1",
    kanji: "日",
    readings: ["にち", "じつ"],
    meanings: ["day", "sun"],
  },
  {
    id: "2",
    kanji: "月",
    readings: ["げつ", "がつ"],
    meanings: ["month", "moon"],
  },
  { id: "3", kanji: "火", readings: ["か"], meanings: ["fire"] },
  { id: "4", kanji: "水", readings: ["すい"], meanings: ["water"] },
  // Add more dummy data as needed
];

const KanjiList: React.FC<KanjiListProps> = ({ data, navigation, type }) => {
  return (
    <FlatList
      contentContainerStyle={styles.listContainer}
      data={data}
      numColumns={1}
      renderItem={({ item }) => (
        <KanjiCard
          kanji={item.kanji}
          readings={item.readings}
          meanings={item.meanings}
          navigation={navigation}
          type={type}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  );
};

export function KanjiListView({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const { id, title, type } = route.params;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `${title}`,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <KanjiList data={dummyData} navigation={navigation} type={type}/>
    </View>
  );
}

const screenWidth = Dimensions.get("window").width;
// const cardWidth = (screenWidth - 48) / 2; // Subtracting padding and margins

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  listContainer: {
    // alignSelf: "center", // Center cards horizontally
  },
  card: {
    // width: cardWidth,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 16,
    margin: 5,
    backgroundColor: "#f9f9f9",
    shadowColor: "#666",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  kanji: {
    fontSize: 32,
    fontWeight: "bold",
    marginRight: 16,
  },
  details: {
    flex: 1,
  },
  readings: {
    fontSize: 16,
    color: "#555",
  },
  meanings: {
    fontSize: 16,
    color: "#555",
  },
});
