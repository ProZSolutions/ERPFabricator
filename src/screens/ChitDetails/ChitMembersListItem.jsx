import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native';
import { styled } from 'nativewind';
import { capitalizeFirstLetter } from '../../utils';

function ChitMembersListItem({ id = 0, name, phone, month = 0, label = null, isLastTaken, status }) {
    const StyledView = styled(View);
    const StyledText = styled(Text);
    const StyledTouchableOpacity = styled(TouchableOpacity);
    return (
        <StyledTouchableOpacity
            className={`${isLastTaken == true ? 'bg-custom-lightgreen' : status === 'taken' ? 'bg-custom-lightblue' : ""
                } flex flex-row items-center justify-between p-2 border mb-3 rounded-lg border-gray-200`}
        >
            <StyledView className="basis-[60%]">
                <StyledText className="text-custom-heading text-base font-medium">{capitalizeFirstLetter(name)} {label != null && ` (${label})`}</StyledText>
                <StyledText className={`${isLastTaken ? 'text-custom-green' : 'text-custom-hyperlink'
                    } text-xs font-light`}>{phone}</StyledText>
            </StyledView>
            {month > 0 && (
                <StyledView className="basis-[40%] flex-row justify-end items-center">
                    <StyledText className={`${isLastTaken ? 'text-custom-green' : 'text-custom-hyperlink'
                        } bg-white px-4 py-1 rounded-2xl`}>{month}ᵗʰ Month</StyledText>
                </StyledView>
            )}

        </StyledTouchableOpacity>

    )
}
export default ChitMembersListItem;