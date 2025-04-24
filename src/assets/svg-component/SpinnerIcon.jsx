import React, { useEffect ,useRef} from 'react';
import { Animated, View, StyleSheet, Easing } from 'react-native'; // Import Easing here
import Svg, { Circle } from 'react-native-svg';

const SpinnerIcon = () => {
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the rotation animation
    const rotate = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000, // Duration for one complete spin
        useNativeDriver: true,
        easing: Easing.linear, // Use Easing.linear for smooth rotation
      })
    );

    rotate.start(); // Start the loop animation

    return () => rotate.stop(); // Cleanup on component unmount
  }, [spinAnim]);

  // Interpolating the rotation value
  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'], // Full rotation
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid"
        >
          <Circle
            cx="50"
            cy="50"
            r="35"
            stroke="#285FE7" // Blue color
            strokeWidth="8"
            fill="none"
            strokeDasharray="164.93361431346415 56.97787143782138"
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SpinnerIcon;
