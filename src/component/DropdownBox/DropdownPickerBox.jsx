import React, { useEffect, useState ,useRef} from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { styled } from "nativewind";
import DownArrowIcon from "../../assets/svg-component/DownArrowIcon";

const StyledView = styled(TouchableOpacity);

function DropdownPickerBox({
    options = [],
    required = false,
    label = "Select",
    onValueChange = () => { },
    placeholder = "Select",
    icon = null,
    disabled = false,
    errorMessage = "",
    value = "",
    mb="mb-4"
}) {
   const pickerRef = useRef();



    const handleOpenPicker = () => {
        pickerRef.current.focus();
    };


    return (
        <StyledView className={`w-full ${mb}`}>
            {label ? (
                <Text style={styles.label}>
                    {label}
                    {required && <Text className="text-red-500 ml-1"> *</Text>}
                </Text>
            ) : null}

            <StyledView
                onPress={handleOpenPicker}
                className={`border border-gray-200 rounded-lg bg-white`}
            >
                <TouchableOpacity
                    onPress={handleOpenPicker}
                    style={{
                        height: 48,
                        justifyContent: 'center',
                        paddingLeft: 10,
                        fontSize: 12,
                        borderRadius: 5
                    }}
                >
                    <Text className="text-custom-black text-xs">{placeholder}</Text>
                    <View className="absolute right-3 top-3 -translate-y-1/2">
                        <DownArrowIcon />
                    </View>
                    <Picker
                        ref={pickerRef}
                        selectedValue={1}
                        onValueChange={onValueChange}
                        useNativeAndroidPickerStyle={false}
                        enabled={!disabled}
                        style={{ display: 'none', opacity: 0, height: 0, width: 0 }}

                    >
                        {options.map((item) => (
                            <Picker.Item key={item.value} label={item.label} value={item.value} />
                        ))}
                    </Picker>
                </TouchableOpacity>

            </StyledView>
            {errorMessage ? (
                <Text className="text-red-500 font-normal text-[12px]">
                    {errorMessage}
                </Text>
            ) : null}
        </StyledView>
    );
}

const styles = StyleSheet.create({
    label: {
        color: "#142650",
        fontSize: 12,
        marginBottom: 4,
    },
    placeholder: {
        position: "absolute",
        color: "#9B9B9B",
        fontSize: 12,
    },
    asterisk: {
        color: "red",
    },
    input: {
        fontSize: 12,
    },
});

export default DropdownPickerBox;
