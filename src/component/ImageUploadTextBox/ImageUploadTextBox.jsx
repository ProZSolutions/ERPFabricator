import React, { useEffect, useState } from "react";
import { View, TextInput, Text, StyleSheet, TouchableWithoutFeedback, Alert,TouchableOpacity } from "react-native";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const ImageUploadTextBox = ({
    icon = null,
    label = "",
    placeholder = "",
    containerClass = "",
    editable = true,
    onChangeText = () => { },
    value = "",
    required = false,
    isNoteText = false,
    noteTxt = "",
    errorMessage = "",
    disabled = false,
    leftIcon = true,
    rightIcon = false,
    mb = "mb-4"
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const handlePress = () => {
        if (disabled) {
            return false
        }

        launchImageLibrary(
            {
                mediaType: 'photo',
                includeBase64: true,
            },
            (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.errorCode) {
                    console.log('ImagePicker Error: ', response.errorMessage);
                } else if (response.assets) {
                    const image = response.assets[0];
                    const fileSizeInMB = image.fileSize / (1024 * 1024); 
                    if (fileSizeInMB <= 2) {
                        onChangeText({
                            name: response.assets[0].fileName,
                            base64: response.assets[0].base64
                        })
                    } else {
                        Alert.alert(
                            'Error',
                            'The selected file size exceeds 2MB. Please choose a smaller file.'
                        );
                    }
                }
            }
        );
    };



    return (
        <View className={mb}>
            {label ? (
                <Text style={styles.label}>
                    {label}
                    {required && <Text className="text-red-500 ml-1"> *</Text>}
                </Text>
            ) : null}

            <TouchableWithoutFeedback onPress={handlePress}>
                <View className={`flex-row items-center border border-gray-200  rounded-lg ${containerClass}`}>
                    {leftIcon && icon && <View className="mr-2">{icon}</View>}
                    <View className="flex-1 flex-row items-center">
                        {required && !isFocused && !value ? (
                            <Text style={styles.placeholder}>
                                {placeholder}
                            </Text>
                        ) : null}
                        <TouchableOpacity className="bg-blue-600 px-5 py-3 rounded-l-md">
                            <Text className="text-white font-semibold text-sm">Choose File</Text>
                        </TouchableOpacity>
                        <TextInput
                            className="flex-1 text-lg ml-2"
                            editable={editable}
                            value={value}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            onChangeText={onChangeText}
                            style={{
                                color: "#142650",
                                fontSize: 12,
                            }}
                        />
                    </View>
                    {rightIcon && icon && <View className="mr-2">{icon}</View>}
                </View>
            </TouchableWithoutFeedback>

            {errorMessage ? (
                <Text className="text-red-500 font-normal text-[12px]">
                    {errorMessage}
                </Text>
            ) : null}

            {isNoteText && (
                <Text className="font-normal text-[12px] leading-[24px] text-custom-companytxt">
                    {noteTxt}
                </Text>
            )}
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
    input: {
        fontSize: 12,
    },
});

export default ImageUploadTextBox;
