import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import GreaterThanIcon from '../../assets/svg-component/GreaterThanIcon';
import { useNavigation } from '@react-navigation/native';
import ChartMemberInfo from '../../component/ShardCard/ChartMemberInfo';
import { capitalizeFirstLetter, chitNameFormat, formatAmount } from '../../utils';

const StyledView = styled(View);

const ChitCard = ({ item }) => {
    const navigation = useNavigation();
    return (
        <StyledView className="bg-white border border-gray-200 rounded-lg shadow-sm px-2 py-2 mb-4">
            <StyledView className="flex-row justify-between items-center">
                <StyledView>
                    <Text className="text-sm text-custom-heading font-medium">{chitNameFormat(item?.chit_name, item?.id)}</Text>
                    <Text className="text-custom-companytxt text-xs font-normal mt-2">{item?.start_month}</Text>
                </StyledView>

                <StyledView className="items-end">
                    <TouchableOpacity onPress={() => navigation.navigate("ChitDetails", {item:item})} className="flex-row items-center space-x-1">
                        <Text className="text-custom-hyperlink text-xs font-normal">View</Text>
                        <GreaterThanIcon />
                    </TouchableOpacity>
                    <StyledView className="flex-row items-center">
                        <Text className="text-custom-heading font-medium text-sm mt-2">{formatAmount(item?.cumulative_amount)}</Text>
                    </StyledView>
                </StyledView>
            </StyledView>

            <StyledView className="w-full h-[1px] bg-gray-200 my-4" />

            <ChartMemberInfo
                totalMembers={item?.no_members || 0}
                lastAuctionDate={item?.last_auction_date}
                dueAmount={item?.due_amount || 0}
                timePeriod={item?.time_period || 0}
                currentTimePeriod={item?.current_time_period || 0}
            />
        </StyledView>
    );
};

export default ChitCard;
