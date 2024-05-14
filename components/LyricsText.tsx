// import React, { useState } from 'react';
// import { Pressable, StyleSheet } from 'react-native';
// import Animated, { useAnimatedStyle, withTiming, interpolateColor } from 'react-native-reanimated';

// import { View, FlatList } from 'react-native';

// const Word = ({ wordObj, isSelected, onPress }) => {
//   const animatedStyle = useAnimatedStyle(() => {
//     const backgroundColor = interpolateColor(
//       isSelected ? 1 : 0,
//       [0, 1],
//       ['transparent', 'rgba(255,255,255,0.5)']
//     );

//     return {
//       backgroundColor,
//       borderWidth: isSelected ? withTiming(1, { duration: 100 }) : withTiming(0, { duration: 100 }),
//       borderColor: 'black',
//     };
//   });

//   return (
//     <Pressable onPress={onPress}>
//       <Animated.Text style={[styles.word, isSelected && styles.selectedWord, animatedStyle]}>
//         {wordObj.word + ' '}
//       </Animated.Text>
//     </Pressable>
//   );
// };

// interface ClickableTextProps {
//   lyrics: (
//     | { word: string; definition: string }
//     | { word: string; definition?: undefined }
//   )[][];
//   onPress: (word: string) => void;
// }

// export const ClickableText: React.FC<ClickableTextProps> = ({
//   lyrics,
//   onPress,
// }) => {
//   const [selectedLineIndex, setSelectedLineIndex] = useState(-1);
//   const [selectedWordIndex, setSelectedWordIndex] = useState(-1);

//   const renderLine = ({ item: line, index: lineIndex }) => (
//     <View key={lineIndex} style={styles.line}>
//       {line.map((wordObj, wordIndex) => {
//         const isSelected = lineIndex === selectedLineIndex && wordIndex === selectedWordIndex;
//         return (
//           <Word
//             key={wordIndex}
//             wordObj={wordObj}
//             isSelected={isSelected}
//             onPress={() => {
//               setSelectedLineIndex(lineIndex);
//               setSelectedWordIndex(wordIndex);
//               onPress(wordObj.definition!);
//             }}
//           />
//         );
//       })}
//     </View>
//   );

//   return (
//     <FlatList
//       data={lyrics}
//       renderItem={renderLine}
//       keyExtractor={(item, index) => `${index}`}
//       style={styles.container}
//       initialNumToRender={10}
//     />
//   );
// };



// export default ClickableText;

// import React, { useState } from 'react';
// import { Pressable, StyleSheet } from 'react-native';
// import Animated, { useAnimatedStyle, withTiming, interpolateColor } from 'react-native-reanimated';


import React, { useState, useCallback, memo } from 'react';
import { Pressable, StyleSheet, FlatList, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, interpolateColor } from 'react-native-reanimated';

const Word = memo(({ wordObj, isSelected, onPress }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      isSelected ? 1 : 0,
      [0, 1],
      ['transparent', 'rgba(255,255,255,0.5)']
    );

    return {
      backgroundColor,
      borderWidth: isSelected ? withTiming(1, { duration: 100 }) : withTiming(0, { duration: 100 }),
      borderColor: 'black',
    };
  }, [isSelected]);

  return (
    <Pressable onPress={onPress}>
      <Animated.Text style={[styles.word, isSelected && styles.selectedWord, animatedStyle]}>
        {wordObj.word + ' '}
      </Animated.Text>
    </Pressable>
  );
});

interface ClickableTextProps {
  lyrics: (
    | { word: string; definition: string }
    | { word: string; definition?: undefined }
  )[][];
  onPress: (word: string) => void;
}

export const ClickableText: React.FC<ClickableTextProps> = ({
  lyrics,
  onPress,
}) => {  const [selectedLineIndex, setSelectedLineIndex] = useState(-1);
  const [selectedWordIndex, setSelectedWordIndex] = useState(-1);

  const handlePress = useCallback((lineIndex, wordIndex, definition) => {
    setSelectedLineIndex(lineIndex);
    setSelectedWordIndex(wordIndex);
    onPress(definition);
  }, [onPress]);

  const renderLine = useCallback(({ item: line, index: lineIndex }) => (
    <View key={lineIndex} style={styles.line}>
      {line.map((wordObj, wordIndex) => {
        const isSelected = lineIndex === selectedLineIndex && wordIndex === selectedWordIndex;
        return (
          <Word
            key={wordIndex}
            wordObj={wordObj}
            isSelected={isSelected}
            onPress={() => handlePress(lineIndex, wordIndex, wordObj.definition!)}
          />
        );
      })}
    </View>
  ), [selectedLineIndex, selectedWordIndex, handlePress]);

  return (
    <FlatList
      data={lyrics}
      renderItem={renderLine}
      keyExtractor={(item, index) => `${index}`}
      style={styles.container}
      initialNumToRender={10}
      extraData={[selectedLineIndex, selectedWordIndex]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    // Your container style here
  },
  line: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow lines to wrap
    justifyContent: 'center',
    alignContent: 'center', // Center the lines horizontally
    marginVertical: 5, // Add vertical spacing between lines
  },
  word: {
    marginHorizontal: 2,
    fontSize: 18, // Make text bigger
  },
  selectedWord: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10, // Round the corners of selected bubbles
    paddingLeft: 4 // Add some padding inside the bubbles
  },
});