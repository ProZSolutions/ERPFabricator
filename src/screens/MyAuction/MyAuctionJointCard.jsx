import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import { chitNameFormat, formatAmount } from '../../utils';
import YetToStartCard from './YetToStartCard';
import GreaterThanIcon from '../../assets/svg-component/GreaterThanIcon';
import LiveIndicator from '../UpcomingAuction/LiveIndicator';

const StyledView = styled(View);

function MyAuctionJointCard({ item }) {
    const navigation = useNavigation();

    return (
        <StyledView className="bg-white border border-gray-200 rounded-lg shadow-sm px-2 py-2 mb-4">
            <StyledView className="flex-row justify-between">
                <StyledView>
                    <Text className="text-base text-custom-heading font-medium">
                        {chitNameFormat(item.chit_name, item.chit_id)}
                    </Text>
                    <View className="flex-row items-center space-x-1 mt-2">
                        <Text className="text-custom-heading text-xs font-normal py-1 rounded-xl">
                            Requested
                        </Text>
                    </View>
                </StyledView>

                <StyledView className="flex-row items-center">
                    <Text className="text-custom-red text-xs font-semibold">LIVE</Text>
                    <StyledView className="">
                        <LiveIndicator />
                    </StyledView>
                </StyledView>

                <StyledView className="items-end">
                    <TouchableOpacity
                        onPress={() => navigation.navigate("MyAuctionDetails", { 
                            chit_id: item?.chit_id, 
                            chit_month: item?.chit_month, 
                            info: item })}
                        className="flex-row items-center space-x-1"
                    >
                        <Text className="text-custom-hyperlink text-sm font-normal">
                            Join Auction
                        </Text>
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
                totalMembers={item.no_members}
                timePeriod={item.time_period}
                currentTimePeriod={item.current_time_period}
                lastAuctionDate={item?.auction_date}
                dueAmount={item?.start_from}
            />
        </StyledView>
    );
}

export default MyAuctionJointCard;
