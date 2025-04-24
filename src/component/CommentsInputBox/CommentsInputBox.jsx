import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

const CommentsInputBox = ({
    icon = null,
    label = "",
    placeholder = "",
    containerClass = "",
    editable = true,
    onChangeText = () => { },
    value = "",
    required = false,
    errorMessage = "",
    mb="mb-4"
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View className={mb}>
            {label ? <Text style={styles.label}>{label}
                {required && (
                    <Text className="text-red-500 ml-1"> *</Text>
                )}
            </Text> : null}

            <View
                className={`flex-row items-center border border-gray-200 px-2 rounded-lg ${containerClass}`}
            >
                {icon && <View className="mr-2">{icon}</View>}
                <View className="flex-1 flex-row items-center">
                    {required && !isFocused && !value ? (
                        <Text style={styles.placeholder}>
                            {placeholder}{' '}
                        </Text>
                    ) : null}
                   
                    <TextInput
                        className="flex-1 text-lg"
                        editable={editable}
                        multiline
                        numberOfLines={4}
                        value={value}
                        maxLength={300}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onChangeText={onChangeText}
                        style={{
                            color: "#142650",
                            fontSize: 12,
                        }}
                    />
                   
                </View>
            </View>

            {errorMessage ? (
                <Text className="text-red-500 font-normal text-[12px]">
                    {errorMessage}
                </Text>
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
    currencySymbol: {
        color: '#142650',
        fontSize: 14,
        paddingRight: 2, // Space between symbol and text
    },
    input: {
        fontSize: 12,
    },
    percentageSymbol: {
        color: '#142650',
        fontSize: 14,
        paddingLeft: 2, // Space between text and percentage symbol
    },
});

export default CommentsInputBox;
