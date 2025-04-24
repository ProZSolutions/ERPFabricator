import { styled } from 'nativewind';
import React from 'react';
import { Text, View } from 'react-native';

const StyledView = styled(View);
const StyledText = styled(Text);

function AuctionListMember({ index, name, phone = '' }) {
    return (
        <StyledView
            className={`${index === -1 ? 'bg-custom-lightgreen' : ''} flex flex-row items-center justify-between p-2 border mb-3 rounded-lg border-gray-200`}
        >
            <StyledView className="basis-[60%]">
                <StyledText className="text-custom-heading text-base font-medium">
                    {name}
                </StyledText>
                <StyledText
                    className={`${ index === -1 ? 'text-custom-green' : 'text-custom-hyperlink'} text-xs font-light`}
                >
                    {phone}
                </StyledText>
            </StyledView>
        </StyledView>
    );
}

export default AuctionListMember;
