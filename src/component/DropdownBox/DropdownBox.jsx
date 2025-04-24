import React, { useEffect ,useRef} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { styled } from 'nativewind';
import DownArrowIcon from '../../assets/svg-component/DownArrowIcon';

const StyledView = styled(View);

function DropdownBox({
    options = [],
    required = false,
    label = 'Select',
    onValueChange = () => { },
    placeholder = {
        label: 'Select..',
        value: null,
    },
    icon = null,
    disabled = false,
    errorMessage = '',
    value = ''
}) {
     const pickerRef = useRef();
    useEffect(() => {
        // Open the picker on initial load by focusing the input
        if (pickerRef.current) {
          pickerRef.current.togglePicker();
        }
      }, []);
    return (
        <StyledView className="w-full mb-4">
            {label ? <Text style={styles.label}>{label}
                {required && (
                    <Text className="text-red-500 ml-1"> *</Text>
                )}
            </Text> : null}
            <StyledView className={`border border-gray-200 rounded-lg bg-white relative ${icon ? "pl-7" : 'pl-2'}`}>
                {icon && (
                    <View className="absolute left-1 top-3 -translate-y-1/2">
                        {icon}
                    </View>
                )}
                <RNPickerSelect
                    onValueChange={onValueChange}
                    items={options}
                    placeholder={placeholder}
                    value={value}
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{
                        style: {
                            fontSize: 12,
                            color: 'black',
                        },
                    }}
                    disabled={disabled}
                    Icon={() => {
                        return <DownArrowIcon />;
                    }}
                    style={{
                        inputAndroid: { color: 'black' },
                        iconContainer: {
                            top: 10, 
                            right: 12,
                        },
                    }}
                />
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


export default DropdownBox;
