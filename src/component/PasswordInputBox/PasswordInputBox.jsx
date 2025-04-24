import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import EyeOpenIcon from '../../assets/svg-component/EyeOpenIcon';
import EyeCloseIcon from '../../assets/svg-component/EyeCloseIcon';

const PasswordInputBox = ({
    lockIcon = null,
    placeholder = "Password",
    containerClass = '',
    editable = true,
    onChangeText = () => { },
    value = '',
    required = false,
    isNoteText = false,
    noteTxt = '',
    errorMessage = '',
    label = ''
}) => {
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };

    return (
        <View className="mb-4">
            {label ? <Text style={styles.label}>{label}
                {required && (
                    <Text className="text-red-500 ml-1"> *</Text>
                )}
            </Text> : null}
            <View className="flex-row items-center  border border-gray-200 px-2 rounded-lg">
                {lockIcon && <View className="mr-2">{lockIcon}</View>}
                <View className="flex-1 text-lg">
                    <TextInput
                        placeholder={placeholder}
                        secureTextEntry={!isPasswordVisible}
                        placeholderTextColor="#9B9B9B"
                        style={{
                            color: "#142650",
                            fontSize: 12,
                            height: 50
                        }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onChangeText={onChangeText}
                        value={value}
                    />
                </View>
                <TouchableOpacity onPress={togglePasswordVisibility}>
                    {isPasswordVisible ? <EyeOpenIcon /> : <EyeCloseIcon />}
                </TouchableOpacity>

            </View>
            {errorMessage ? (
                <Text className="text-red-500 font-normal text-[12px]">{errorMessage}</Text>
            ) : null}
        </View>

    );
};

const styles = StyleSheet.create({
    label: {
        color: "#142650",
        fontSize: 12,
        marginBottom: 4,
    },
    placeholder: {
        position: 'absolute',
        color: '#9B9B9B',
        fontSize: 12,
    },
    asterisk: {
        color: 'red',
    },
    input: {
        fontSize: 12,
    },
});

export default PasswordInputBox;
