import { styled } from 'nativewind';
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { formatAmount } from '../../utils';
import DownArrowIcon from '../../assets/svg-component/DownArrowIcon';
import LottUserIcon from '../../assets/svg-component/LottUserIcon';
import LottIcon from '../../assets/svg-component/LottIcon';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
function MyChitSettlementItem({ index, item, isExpanded, onPress, previewModal = () => { } }) {
    
    return (
        <StyledView className='mb-4'>
            <StyledTouchableOpacity
                onPress={() => onPress(index)}
                className={`${index == 1 ? 'bg-custom-lightgreen' : ''
                    } flex flex-row items-center justify-between p-2 border  border-gray-200
            ${!isExpanded ? 'rounded-tl-lg rounded-tr-lg' : 'rounded-lg'} `}
            >

                <StyledView className="basis-[30%] flex-row justify-start items-end">
                    <StyledText className={'text-custom-companytxt text-sm font-medium'}>
                        Auction
                    </StyledText>
                </StyledView>

                {/* <StyledView className="basis-[40%] flex-row justify-center items-center">
                    <StyledView className="flex-col justify-center items-center">
                        <StyledText className="text-center text-custom-companytxt text-xs font-normal">Status</StyledText>
                        <StyledText className="text-center text-custom-heading text-sm font-medium">{item?.new_status}</StyledText>
                    </StyledView>
                </StyledView> */}
                <StyledView className="basis-[30%] flex-row justify-end items-center space-x-2">
                     <StyledText className={'text-custom-hyperlink text-xs font-medium'}>
                        {item?.chit_month}ᵗʰ Month
                    </StyledText>
                    <DownArrowIcon />
                </StyledView>
            </StyledTouchableOpacity>
            <Collapsible collapsed={isExpanded}>
                <View className="py-2 rounded-bl-xl rounded-br-xl shadow-md mb-2 border border-gray-200">
                    <StyledView className="px-2">
                        <StyledView className="flex-row justify-between items-center mb-4">
                            <StyledText className="basis-[50%] text-custom-companytxt text-xs font-normal">Settled Amount</StyledText>
                            <StyledText className="basis-[5%] text-center">:</StyledText>
                            <StyledText className="basis-[50%] text-custom-hyperlink text-sm font-medium pl-2">{formatAmount(item.settlement_amount)}</StyledText>
                        </StyledView>

                        <StyledView className="flex-row justify-between items-center mb-4">
                            <StyledText className="basis-[50%] text-custom-companytxt text-xs font-normal">Settlement Date</StyledText>
                            <StyledText className="basis-[5%] text-center">:</StyledText>
                            <StyledText className="basis-[50%] text-custom-heading text-sm font-medium pl-2">{item?.payment_details?.[0]?.payment_date}</StyledText>
                        </StyledView>

                        <StyledView className="flex-row justify-between items-center mb-4">
                            <StyledText className="basis-[50%] text-custom-companytxt text-xs font-normal">Mode of Payment</StyledText>
                            <StyledText className="basis-[5%] text-center">:</StyledText>
                            <StyledText className="basis-[50%] text-custom-heading text-sm font-medium pl-2">{item?.payment_details?.[0]?.mode_payment}</StyledText>
                        </StyledView>

                        <StyledView className="flex-row justify-between items-center mb-4">
                            <StyledText className="basis-[50%] text-custom-companytxt text-xs font-normal">Transaction Details</StyledText>
                            <StyledText className="basis-[5%] text-center">:</StyledText>
                            <StyledText className="basis-[50%] text-custom-heading text-sm font-medium pl-2">UPI63XXXX42</StyledText>
                        </StyledView>

                        <StyledView className="flex-row justify-between items-center">
                            <StyledText className="basis-[50%] text-custom-companytxt text-xs font-normal">Attached Documents</StyledText>
                            <StyledText className="basis-[5%] text-center">:</StyledText>
                            <StyledTouchableOpacity className="basis-[50%]" onPress={() => previewModal(item?.payment_details?.[0]?.document)}>
                                <StyledText className="text-custom-hyperlink text-sm font-medium underline pl-2">Preview</StyledText>
                            </StyledTouchableOpacity>
                        </StyledView>
                    </StyledView>

                </View>
            </Collapsible>
        </StyledView>
    )
}
export default MyChitSettlementItem;