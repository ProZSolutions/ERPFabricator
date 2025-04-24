import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);

const BoxItem = ({ title, notification, icon = null, onPress, width, style , isLargeScreen = true}) => {
    return (
        <StyledTouchableOpacity
            onPress={onPress}
            style={[{ width }, style]} // Apply dynamic width and passed styles (including marginBottom)
            className="min-h-[120px] rounded-lg justify-center items-center border border-[#303D501A] relative"
        >
            {notification && (
                <StyledView className="absolute top-0 right-0 pt-1 pr-1">
                    <StyledView className="bg-yellow-400 rounded-full w-8 h-8 justify-center items-center">
                        <Text className="text-white text-sm">{notification}</Text>
                    </StyledView>
                </StyledView>
            )}
            {icon && icon}
            <Text className = {`text-black text-xs ${!isLargeScreen ? 'pt-3':"pt-1"}`}>{title}</Text>
        </StyledTouchableOpacity>
    );
};

export default BoxItem;
