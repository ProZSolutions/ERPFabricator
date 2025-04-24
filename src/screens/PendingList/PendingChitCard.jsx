import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import GreaterThanIcon from '../../assets/svg-component/GreaterThanIcon';
import { useNavigation } from '@react-navigation/native';
import { chitNameFormat, formatAmount } from '../../utils';

const StyledView = styled(View);
const StyledText = styled(Text);

const PendingChitCard = ({item}) => {
    const navigation = useNavigation(); 

    return (
        <StyledView className="bg-white border border-gray-200 rounded-lg shadow-sm p-2 mb-4">
            <StyledView className="flex-row justify-between items-center">
                <StyledText className="text-base text-custom-heading font-medium">{chitNameFormat(item?.chit_name, item?.chit_id)}</StyledText>
                <StyledView className="bg-custom-lightblue px-4 py-2 rounded-xl">
                    <StyledText className="text-xs text-custom-hyperlink font-medium">{item.chit_month}ᵗʰ Month</StyledText>
                </StyledView>
                <TouchableOpacity onPress={() => {navigation.navigate('PendingDetails', {item})}} className="flex-row items-center space-x-1">
                    <StyledText className="text-custom-hyperlink text-xs font-normal">View</StyledText>
                    <GreaterThanIcon />
                </TouchableOpacity>
            </StyledView>

            <StyledView className="w-full h-[1px] bg-gray-200 my-3" />

            <StyledView className="flex-row justify-between">
                <StyledView>
                    <StyledText className="text-custom-companytxt text-xs">Pending</StyledText>
                         <StyledText className="text-custom-heading text-xs font-medium mt-1">{item.pending_count} Parties</StyledText>
                 </StyledView>

                <StyledView>
                    <StyledText className="text-custom-companytxt text-xs">Auction Date</StyledText>
                    <StyledText className="text-custom-heading text-xs font-medium mt-1">{item?.auction_date}</StyledText>
                </StyledView>

                <StyledView>
                    <StyledText className="text-custom-companytxt text-xs">Total pending Amount</StyledText>
                    <StyledText className="text-custom-red text-base font-medium mt-1">{formatAmount(item.pending_amount)}</StyledText>
                </StyledView>
            </StyledView>
        </StyledView>
    );
};

export default PendingChitCard;
