import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);

const OtpFooter = ({ resendTime }) => (
    <StyledView className="flex-row justify-end items-center space-x-2 mb-4 mt-2">
        <TouchableOpacity onPress={() => console.log('Resend Code')}>
            <Text className="text-red-500 text-sm underline">Resend Code</Text>
        </TouchableOpacity>
        <Text className="text-gray-500 text-sm">({resendTime} min)</Text>
    </StyledView>
);

export default OtpFooter;
