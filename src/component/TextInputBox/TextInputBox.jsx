import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

const TextInputBox = ({
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
    isCurrency = false,
    isPercentage = false,
    mb="mb-4",
    keyboardType = "default",
    multiline=false,
    numberOfLines=1
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
                    {isCurrency && (value || isFocused) &&
                        <Text style={styles.currencySymbol}>₹</Text>}
                    <TextInput
                        className="flex-1 text-lg"
                        editable={editable}
                        value={value}
                        multiline={multiline}
                        numberOfLines={numberOfLines}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onChangeText={onChangeText}
                        keyboardType = {keyboardType}
                        textAlignVertical={multiline ? 'top' : 'center'} // ensures text starts at top for multiline
                        style={{
                            color: "#142650",
                            fontSize: 12,
                            ...(multiline ? { minHeight: numberOfLines * 20 } : { height: 40 }),
                        }}
                    />
                    {isPercentage && (value || isFocused) && (
                        <Text style={styles.percentageSymbol}>%</Text>
                    )}
                </View>
            </View>

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

export default TextInputBox;
