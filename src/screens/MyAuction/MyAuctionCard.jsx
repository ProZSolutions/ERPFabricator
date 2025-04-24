import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { styled } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import { chitNameFormat, formatAmount } from '../../utils';
import YetToStartCard from './YetToStartCard';
import AsyncStorage from '@react-native-async-storage/async-storage';


const StyledView = styled(View);

const MyAuctionCard = ({ item, updateCancelHandle = () => { } }) => {
    const navigation = useNavigation();
    console.log("myaution item:", JSON.stringify(item, null, 2));

     
    const canlcelReqHandler = async (item) => {
        Alert.alert(
            "Are you sure to Cancel Request?",
            "",
            [
                { text: "NO", onPress: () => { } },
                { text: "Yes", onPress: () => updateCancelHandle(item) },
            ],
            { cancelable: true }
        );
    }
  
      
    return (
        <StyledView className="bg-white border border-gray-200 rounded-lg shadow-sm px-2 py-2 mb-4">
            <StyledView className="flex-row justify-between">
                <StyledView>
                    <Text className="text-base text-custom-heading font-medium">
                        {chitNameFormat(item.chit_name, item.chit_id)}
                    </Text>
                    <Text className="text-custom-companytxt text-xs font-normal mt-2">
                        {item.start_month}
                    </Text>
                </StyledView>

                <StyledView className="items-end">
                    {item.request_button_flag === 0 && (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("MyAuctionReqForm", { item: item })}
                            className="flex-row items-center space-x-1"
                        >
                            <Text className="text-custom-hyperlink text-xs font-normal bg-custom-lightblue px-3 py-1 rounded-xl">
                                Request Auction
                            </Text>
                        </TouchableOpacity>
                    )}
                    {item.request_button_flag === 1 && (
                        <TouchableOpacity
                            onPress={() => canlcelReqHandler(item)}
                            className="flex-row items-center space-x-1"
                        >
                            <Text className="text-custom-hyperlink text-xs font-normal bg-custom-lightblue px-3 py-1 rounded-xl">
                                Cancel Request
                            </Text>
                        </TouchableOpacity>
                    )}

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
};

export default MyAuctionCard;
