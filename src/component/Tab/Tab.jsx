// Tab.js
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const Tab = ({ label, isActive, onPress, isLast = false }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-1 items-center justify-center py-2 ${isActive ? 'bg-custom-hyperlink' : 'bg-gray-200'} ${isActive ? 'text-white' : 'text-custom-heading'} ${!isLast ? "border-r border-white":""}`}
    >
      <Text className={`text-base font-semibold ${isActive ? 'text-white' : 'text-custom-heading'}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default Tab;
