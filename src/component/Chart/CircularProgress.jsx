import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const CircularProgress = ({ size = 100, strokeWidth = 5, progress = 75, color = '#3498db', backgroundColor = '#CCD9F9', total = 0, added = 0 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          stroke={backgroundColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Progress Circle */}
        <Circle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          strokeLinecap="round"
          rotation={-90} // Start from top
          origin={`${size / 2}, ${size / 2}`} // Set origin to center
        />
      </Svg>
      <Text className="text-custom-companytxt text-xs font-normal absolute">{added}/{total}</Text>
    </View>
  );
};

export default CircularProgress;
