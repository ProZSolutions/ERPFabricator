import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const StyledCheckbox = styled(View);
const StyledLabel = styled(Text);

const CheckboxWithLabel = ({ label, value, onToggle }) => {
  return (
    <TouchableOpacity
      onPress={onToggle}
      className="flex-row items-center space-x-2 mb-2 mt-2"
    >
      <StyledCheckbox
        className={`w-5 h-5 rounded border border-gray-400 items-center justify-center mb-1`}
      >
        {value === 1 && (
          <FontAwesome name="check" size={12} color="#16a34a" /> // green tick
        )}
      </StyledCheckbox>
      <StyledLabel className="text-[12px] text-gray-700 items-center  justify-center">{label}</StyledLabel>
    </TouchableOpacity>
  );
};

export default CheckboxWithLabel;
