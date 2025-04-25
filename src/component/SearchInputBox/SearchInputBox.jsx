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
        <View className="px-4" style={{ marginTop: -10 }}>
        <View
          className="flex-row items-center px-2"
          style={{
            backgroundColor: '#fff',
            borderRadius: 0, // sharp corners
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 }, // shadow only at bottom
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 3, // Android shadow, mostly at bottom
          }}
        >
          <TextInput
            className="flex-1 text-sm text-custom-black py-2"
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#9B9B9B"
          />
          <SearchIcon />
        </View>
      </View>
      
      
    );
}

export default SearchInputBox;
