import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useImperativeHandle } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import Dots from "./Dots";
import { ArrowUp, ArrowDown } from "@tamagui/lucide-icons";
import { IconButton } from "react-native-paper";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const MAX_TRANSLATE_Y = -SCREEN_HEIGHT;

type BottomSheetProps = {
  children?: React.ReactNode;
  activeIndex?: number;
  setHeight: (height: number) => void;
};

export type BottomSheetRefProps = {
  scrollTo: (destination: number) => void;
  zeroPosition: () => boolean;
  openBottomSheet: (newPosition: number) => void;
  getSheetHeight: () => number;
};

const KanjiSheet = React.forwardRef<BottomSheetRefProps, BottomSheetProps>(
  ({ children, activeIndex = 0, setHeight }, ref) => {
    const active = useSharedValue(false);
    const offset = 105;
    const translateY = useSharedValue(0);
    const position = useSharedValue(2);
    const snapPoints = [
      MAX_TRANSLATE_Y + offset,
      MAX_TRANSLATE_Y + 200 + offset,
      -150 - offset,
    ];
    const scrollTo = useCallback((destination: number) => {
      "worklet";
      translateY.value = withSpring(destination, { damping: 50 });
      runOnJS(setHeight)(destination);
    }, []);

    useEffect(() => {
      scrollTo(snapPoints[2]);
      position.value = 2;
    }, []);

    const isActive = useCallback(() => {
      return active.value;
    }, []);

    const zeroPosition = useCallback(() => {
      return position.value === 2;
    }, []);

    const getSheetHeight = useCallback(() => {
      return SCREEN_HEIGHT + snapPoints[position.value];
    }, []);

    const openBottomSheet = useCallback((newPosition: number) => {
      position.value = newPosition;
      runOnJS(scrollTo)(snapPoints[newPosition]);
    }, []);

    useImperativeHandle(
      ref,
      () => ({ scrollTo, zeroPosition, openBottomSheet, getSheetHeight }),
      [scrollTo, zeroPosition, openBottomSheet, getSheetHeight]
    );

    const context = useSharedValue({ y: 0 });
    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = { y: translateY.value };
      })
      .onUpdate((event) => {
        translateY.value = event.translationY + context.value.y;
        translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
      })
      .onEnd(() => {
        if (translateY.value > -SCREEN_HEIGHT / 3) {
          position.value = snapPoints.length - 1;
          scrollTo(snapPoints[snapPoints.length - 1]);
        } else if (
          translateY.value <= -SCREEN_HEIGHT / 3 &&
          translateY.value >= -SCREEN_HEIGHT / 1.5
        ) {
          position.value = 1;
          scrollTo(snapPoints[1]);
        } else if (translateY.value < -SCREEN_HEIGHT / 1.5) {
          position.value = 0;
          scrollTo(snapPoints[0]);
        }
      });

    const tap = Gesture.Tap()
      .onEnd(() => {
        if (position.value === 2) {
          scrollTo(snapPoints[1]);
          position.value = 1;
        } else {
          scrollTo(snapPoints[2]);
          position.value = 2;
        }
      });

    const rBottomSheetStyle = useAnimatedStyle(() => {
      const borderRadius = interpolate(
        translateY.value,
        [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
        [25, 5],
        Extrapolation.CLAMP
      );

      return {
        borderRadius,
        transform: [{ translateY: translateY.value }],
      };
    });

    const collapseBottomSheet = () => {
      if (position.value < snapPoints.length - 1) {
        scrollTo(snapPoints[position.value + 1]);
        position.value += 1;
      }
    };

    const expandBottomSheet = () => {
      if (position.value > 0) {
        scrollTo(snapPoints[position.value - 1]);
        position.value -= 1;
      }
    };

    const arrowUpStyle = useAnimatedStyle(() => {
      const opacity = position.value === snapPoints.length - 1 ? 0 : 1;

      return {
        opacity: withTiming(opacity),
      };
    });

    const textStyle = useAnimatedStyle(() => {
      const opacity = position.value === snapPoints.length - 1 ? 0 : 1;

      return {
        opacity: withTiming(opacity),
      };
    });

    const arrowDownStyle = useAnimatedStyle(() => {
      const opacity = position.value === 0 ? 0 : 1;

      return {
        opacity: withTiming(opacity),
      };
    });

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
          <GestureDetector gesture={tap}>
            <View style={styles.lineContainer}>
              <View style={styles.line} />
            </View>
          </GestureDetector>
          <View style={{ width: "100%" }}>
            <View style={styles.topContainer}>
              <Text style={styles.text}>
                {activeIndex === 0
                  ? "Word"
                  : activeIndex === 1
                  ? "Components"
                  : "Kanji"}
              </Text>
              <View style={styles.dotsContainer}>
                <Animated.View style={[arrowUpStyle]}>
                  <Dots activeIndex={activeIndex} />
                </Animated.View>
              </View>
              <View style={styles.buttonsContainer}>
                <Animated.View style={[arrowDownStyle]}>
                  <IconButton
                    icon={() => <ArrowUp size={20} color="black" />}
                    style={styles.button}
                    onPress={() => expandBottomSheet()}
                  />
                </Animated.View>
                <Animated.View style={[arrowUpStyle]}>
                  <IconButton
                    icon={() => <ArrowDown size={20} color="black" />}
                    style={styles.button}
                    onPress={() => collapseBottomSheet()}
                  />
                </Animated.View>
              </View>
            </View>
            <Animated.View style={[textStyle]}>{children}</Animated.View>
          </View>
        </Animated.View>
      </GestureDetector>
    );
  }
);

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: "100%",
    backgroundColor: "white",
    position: "absolute",
    top: SCREEN_HEIGHT,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: "grey",
    alignSelf: "center",
    borderRadius: 2,
  },
  lineContainer: {
    width: "100%",
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "transparent",
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "flex-end",
    marginRight: 20,
  },
  button: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  text: {
    marginLeft: 15,
    fontSize: 20,
    textAlign: "left",
    flex: 1,
  },
});

export default KanjiSheet;
