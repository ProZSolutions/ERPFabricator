import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { formatAmount } from '../../utils';



const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const PendingDetailsCard = ({ item }) => (
    <StyledView className='mb-4'>
        <StyledTouchableOpacity
            onPress={()=>{}}
            className={`${item?.lable == 'Paid' ? 'bg-custom-lightgreen' : 'bg-white'
                    }  flex flex-row items-center justify-between p-2 border  border-gray-200 rounded-lg`}
        >
            <StyledView className="basis-[35%]">
                <StyledText className="text-custom-heading text-base font-medium">{item.name}</StyledText>
                <StyledText className={`${item?.lable == 'Paid' ? 'text-custom-green' : 'text-custom-hyperlink'
                    } text-xs font-light`}>{item?.contact}</StyledText>
            </StyledView>
            <StyledView className="basis-[35%] flex-row justify-end items-end">
                <StyledText 
                className={`${item?.lable == 'Paid' ? 'text-custom-green' : 'text-custom-red'
                    }  text-left text-sm font-medium`}>
                 {formatAmount(item?.amount)}</StyledText>

            </StyledView>

            <StyledView className="basis-[30%] flex-row justify-end">
                <StyledView className="bg-white  px-4 py-1 border border-custom-lightgreen rounded-3xl">
                    <StyledText className={`${item?.lable == 'Paid' ? 'text-custom-green' : 'text-custom-hyperlink'
                    }  text-xs font-medium`}>
                        {item?.lable}
                    </StyledText>
                </StyledView>
            </StyledView>


        </StyledTouchableOpacity>

    </StyledView>
);

export default PendingDetailsCard;