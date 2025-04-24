import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const DurationSelector = ({ label = '', months, decreaseMonths, increaseMonths, disabledIncrease = false, disabledDecrease = false }) => {
  return (
    <View className="flex-row items-center justify-between py-2 border border-gray-300 rounded-lg mb-4">
      <Text className="text-xs font-normal text-black mx-4">{label}</Text>
      <View className="flex-row items-center px-2">
        <TouchableOpacity onPress={decreaseMonths} className={`bg-blue-800 p-2 rounded-full ${disabledIncrease ? "opacity-50":""}`}>
          <Icon name="remove" size={16} color="white" />
        </TouchableOpacity>

        <Text className="text-base text-black font-bold mx-4">{months}</Text>

        <TouchableOpacity  onPress={increaseMonths} className={`bg-blue-800 p-2 rounded-full ${disabledDecrease ? "opacity-50":""}`}>
          <Icon name="add" size={16} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DurationSelector;
