import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withRepeat,
} from "react-native-reanimated";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const LiveIndicator = () => {
  const ring1Radius = useSharedValue(15);
  const ring1Opacity = useSharedValue(0.5);

  const ring2Radius = useSharedValue(15);
  const ring2Opacity = useSharedValue(0.5);

  // Animate the first ring
  useEffect(() => {
    ring1Radius.value = withRepeat(
      withTiming(40, { duration: 1500 }),
      -1,
      false
    );
    ring1Opacity.value = withRepeat(
      withTiming(0, { duration: 1500 }),
      -1,
      false
    );

    ring2Radius.value = withRepeat(
      withTiming(40, { duration: 1500 }),
      -1,
      false
    );
    ring2Opacity.value = withRepeat(
      withTiming(0, { duration: 1500 }),
      -1,
      false
    );
  }, []);

  // Animated properties for the first ring
  const ring1AnimatedProps = useAnimatedProps(() => ({
    r: ring1Radius.value,
    opacity: ring1Opacity.value,
  }));

  // Animated properties for the second ring
  const ring2AnimatedProps = useAnimatedProps(() => ({
    r: ring2Radius.value,
    opacity: ring2Opacity.value,
  }));

  return (
    <View style={styles.container}>
      <Svg width="30" height="30" viewBox="0 0 100 100">
        {/* Central red circle */}
        <Circle cx="50" cy="50" r="10" fill="red" />
        
        {/* Expanding ring 1 */}
        <AnimatedCircle
          cx="50"
          cy="50"
          fill="none"
          stroke="red"
          strokeWidth="2"
          animatedProps={ring1AnimatedProps}
        />

        {/* Expanding ring 2 */}
        <AnimatedCircle
          cx="50"
          cy="50"
          fill="none"
          stroke="red"
          strokeWidth="2"
          animatedProps={ring2AnimatedProps}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});

export default LiveIndicator;
