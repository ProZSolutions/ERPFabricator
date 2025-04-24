import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import CloseIcon from '../../assets/svg-component/CloseIcon';

const StyledView = styled(View);

const OtpHeader = ({ onClose }) => (
    <StyledView className="flex-row items-center justify-between w-full mb-4">
        <StyledView className="flex-1 justify-center">
            <Text className="text-lg font-bold text-black text-center">OTP Verification</Text>
        </StyledView>
        <TouchableOpacity onPress={onClose}>
            <CloseIcon/>
        </TouchableOpacity>
    </StyledView>
);

export default OtpHeader;
