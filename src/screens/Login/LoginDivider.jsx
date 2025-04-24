import React from 'react'
import { Text, View } from 'react-native';

function LoginDivider() {
    return (
        <View className="flex flex-row items-center my-8 px-3">
            <View className="flex-1 h-[1px] bg-gray-200"></View>
            <Text className="px-4 text-center text-custom-heading text-base font-medium">Or login with</Text>
            <View className="flex-1 h-[1px] bg-gray-200"></View>
        </View>
    )
}
export default LoginDivider;