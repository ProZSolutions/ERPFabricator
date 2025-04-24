import React from 'react';
import { Text, View } from 'react-native';

const CustomHeading = ({ title, subTitle = '' }) => {
    return (
        <View style={{ marginTop: -10 }} className="px-5 pb-4">
            <Text className="text-[20px] text-custom-heading font-semibold leading-[30px]">
                {title}
            </Text>
            {subTitle && (
                <Text className="pt-2 text-[14px] text-custom-companytxt font-normal leading-[19px]">
                    {subTitle}
                </Text>
            )}
        </View>
    );
};



export default CustomHeading;
