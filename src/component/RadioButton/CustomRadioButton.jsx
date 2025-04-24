import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

const CustomRadioButton = ({ selected, onPress, label }) => {
    return (
        <TouchableOpacity 
            onPress={onPress} 
            className="flex-row items-center mb-2"
        >
            <View
                className={`h-6 w-6 rounded-full border-2 justify-center items-center ${selected ? 'border-primary' : 'border-gray-400'}`}
            >
                {selected && (
                    <View className="h-3 w-3 rounded-full bg-primary" />
                )}
            </View>
            <Text className="ml-2 text-base text-custom-heading font-semibold">{label}</Text>
        </TouchableOpacity>
    );
};

export default CustomRadioButton;
