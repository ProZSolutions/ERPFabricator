import React from 'react'
import { Text, TouchableOpacity } from 'react-native';
import FaceIDLoginIcon from '../../assets/svg-component/FaceIDLoginIcon';

function FaceIDLogin() {
    return (
        <TouchableOpacity className="flex-col items-center justify-center">
            <FaceIDLoginIcon/>
            <Text>Use Face ID</Text>
        </TouchableOpacity>
    )
}

export default FaceIDLogin;