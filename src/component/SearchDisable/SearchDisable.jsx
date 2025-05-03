import React from 'react';
import { TextInput, View, TouchableOpacity } from 'react-native';
import SearchIcon from '../../assets/svg-component/SearchIcon';

function SearchInputBox({
  placeholder = 'Search ...',
  containerClass = '',
  onChangeText = () => {},
  value = '',
  onPress = () => {}, // <- Add this prop
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="px-4" style={{ marginTop: -10 }}>
        <View
          className="flex-row items-center px-2"
          style={{
            backgroundColor: '#fff',
            borderRadius: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 3,
          }}
        >
          <TextInput
            className="flex-1 text-sm text-custom-black py-2"
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#9B9B9B"
            editable={false} // <- Disable direct input
            pointerEvents="none" // <- Prevent focus interaction
          />
          <SearchIcon />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default SearchInputBox;
