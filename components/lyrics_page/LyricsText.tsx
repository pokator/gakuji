import React, { useState, useCallback, memo } from 'react';
import { Pressable, StyleSheet, FlatList, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, interpolateColor } from 'react-native-reanimated';

const Word = memo(({ word, isSelected, onPress }) => {
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
        {word + ''}
      </Animated.Text>
    </Pressable>
  );
});

interface ClickableTextProps {
  lyrics: (
    | { word: string}
  )[][];
  onPress: (word: string) => void;
}

export const ClickableText: React.FC<ClickableTextProps> = ({
  lyrics,
  onPress,
}) => {  const [selectedLineIndex, setSelectedLineIndex] = useState(-1);
  const [selectedWordIndex, setSelectedWordIndex] = useState(-1);

  const handlePress = useCallback((lineIndex, wordIndex, word) => {
    setSelectedLineIndex(lineIndex);
    setSelectedWordIndex(wordIndex);
    onPress(word);
  }, [onPress]);

  const renderLine = useCallback(({ item: line, index: lineIndex }) => (
    <View key={lineIndex} style={styles.line}>
      {line.map((word, wordIndex) => {
        const isSelected = lineIndex === selectedLineIndex && wordIndex === selectedWordIndex;
        return (
          <Word
            key={wordIndex}
            word={word}
            isSelected={isSelected}
            onPress={() => handlePress(lineIndex, wordIndex, word)}
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