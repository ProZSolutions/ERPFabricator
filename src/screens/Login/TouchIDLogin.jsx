import React from 'react'
import { Text, TouchableOpacity } from 'react-native';
import TouchIDLoginIcon from '../../assets/svg-component/TouchIDLoginIcon';

function TouchIDLogin() {
    return (
        <TouchableOpacity className="flex-col items-center justify-center">
            <TouchIDLoginIcon />
            <Text className="text-custom-heading text-base font-normal">Use Touch ID</Text>
        </TouchableOpacity>
    )
}
export default TouchIDLogin;