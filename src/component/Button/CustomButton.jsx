import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const CustomButton = ({ 
    isActive = true, 
    title, 
    onPress, 
    icon = null, 
    containerClass = '',
    isLeftIcon = false,
    gapClass = "mr-2"
}) => {
    return (
        <TouchableOpacity
            className={`${isActive === true ? 'bg-primary' : 'bg-custom-lightblue'} 
           py-2 flex-row items-center justify-center rounded-[10px] ${containerClass}`}
            onPress={onPress}
        >
             {isLeftIcon && icon && icon}
            <Text  style={{   textAlign: 'center' }}
              className={`${isActive === true ? 'text-white font-bold' : 'text-custom-heading font-normal'}  text-center text-[16px] leading-[22px] ${gapClass} uppercase`}>
                {title}
            </Text>
            {!isLeftIcon && icon && icon}
        </TouchableOpacity>
    );
};

export default CustomButton;
