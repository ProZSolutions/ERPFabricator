import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import GreaterThanIcon from '../../assets/svg-component/GreaterThanIcon';
import { useNavigation } from '@react-navigation/native';
import { chitNameFormat, formatAmount } from '../../utils';
import YetToStartCard from './YetToStartCard';

const StyledView = styled(View);

function MyAuctionClosedCard({ item }) {
    const navigation = useNavigation();
    return (
        <StyledView className="bg-white border border-gray-200 rounded-lg shadow-sm px-2 py-2 mb-4">
            <StyledView className="flex-row justify-between">
                <StyledView>
                    <Text className="text-base text-custom-heading font-medium">
                        {chitNameFormat(item.chit_name, item.chit_id)}
                    </Text>
                    <Text className="text-custom-companytxt text-xs font-normal mt-2">
                        {item.chit_start_date}
                    </Text>
                </StyledView>

                <StyledView className="items-end">
                    <TouchableOpacity 
                        onPress={() => navigation.navigate("MyAuctionSummary", {auctionId:item?.auction_id, chitId:item?.chit_id, chitName:item?.chit_name})} 
                        className="flex-row items-center space-x-1"
                    >
                        <Text className="text-custom-hyperlink text-xs font-normal">View</Text>
                        <GreaterThanIcon />
                    </TouchableOpacity>

                    <StyledView className="flex-row items-center">
                        <Text className="text-custom-heading font-medium text-base mt-2">
                            {formatAmount(item.cumulative_amount)}
                        </Text>
                    </StyledView>
                </StyledView>
            </StyledView>

            <StyledView className="w-full h-[1px] bg-gray-300 my-4" />

            <YetToStartCard
                totalMembers={item.total_member}
                timePeriod={item.total_time_period}
                currentTimePeriod={item.settlement_time_period}
                lastAuctionDate={item?.auction_date}
                dueAmount={item?.auction_amount}
                isClosed={true}
            />
        </StyledView>
    );
}

export default MyAuctionClosedCard;
