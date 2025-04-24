import React from 'react';
import { TextInput, View } from 'react-native';
import SearchIcon from '../../assets/svg-component/SearchIcon';

function SearchInputBox({
    placeholder = 'Search ...',
    containerClass = '',
    onChangeText = () => { },
    value = '',
}) {
    return (
        <View className="px-4" style={{marginTop:-20}}>
            <View className={`flex-row items-center border-b border-gray-300 px-2 ${containerClass}`}>
                <TextInput
                    className="flex-1 text-lg text-custom-black"
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#9B9B9B"  
                />
                <SearchIcon/>
            </View>
        </View>
    );
}

export default SearchInputBox;
