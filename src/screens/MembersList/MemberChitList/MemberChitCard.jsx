import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react'
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { styled } from 'nativewind';
import GreaterThanIcon from '../../../assets/svg-component/GreaterThanIcon';
import { chitNameFormat, formatAmount } from '../../../utils';
import MemberChitInfoItem from './MemberChitInfoItem';
import { postData } from '../../../api/ApiService';
import handleError from '../../../component/ErrorHandler/ErrorHandler';
import Spinner from '../../../component/Spinner/Spinner';

const StyledView = styled(View);

function MemberChitCard({ item ,name}) {
    const navigation = useNavigation();
    const [loadingChitInfo, setLoadingChitInfo] = useState(false);

    const gotoDetailsScreen = async (val) => {
        setLoadingChitInfo(true);
        try {
            const response = await postData('/live-chit-list', {
                type: "all",
                chit_id: val?.chit_id
            });
            if (response && response.status === 'success') {
                navigation.navigate("ChitDetails", { item: response?.data?.[0] })
            }
        } catch (error) {
            if (error?.response?.data?.status === "error") {
                Alert.alert(
                    "Error",
                    error?.response?.data?.error || "An error occurred."
                );
            } else {
                await handleError(error, false);
            }
        } finally {
            setLoadingChitInfo(false);
        }

    }

    return (
        <StyledView className="bg-white border border-gray-200 rounded-lg shadow-sm px-2 py-2 mb-4">
            <Spinner visible={loadingChitInfo} textContent="Loading..." />

            <StyledView className="flex-row justify-between items-center">
                <StyledView>
                    <Text className="text-sm text-custom-heading font-medium">{chitNameFormat(item?.chit_name, item?.chit_id)}</Text>
                    <Text className="text-custom-companytxt text-xs font-normal mt-2">{item?.chit_start_date}</Text>
                </StyledView>

                <StyledView className="items-end">
                    <TouchableOpacity onPress={() => navigation.navigate("MemberPaymentDetails", { item: item,name:name })} className="flex-row items-center space-x-1">
                        <Text className="text-custom-hyperlink text-xs font-normal">View</Text>
                        <GreaterThanIcon />
                    </TouchableOpacity>
                    <StyledView className="flex-row items-center">
                        <Text className="text-custom-heading font-medium text-sm mt-2">{formatAmount(item?.cumulative_amount)}</Text>
                    </StyledView>
                </StyledView>
            </StyledView>

            <StyledView className="w-full h-[1px] bg-gray-200 my-4" />

            <MemberChitInfoItem
                totalMembers={item?.total_member || 0}
                lastAuctionDate={item?.next_auction_date}
                dueAmount={item?.amount || 0}
                timePeriod={item?.total_time_period || 0}
                currentTimePeriod={item?.latest_auction_month || 0}
                item={item}
                name={name}
                gotoDetailsScreen={gotoDetailsScreen}
            />
        </StyledView>
    );
}
export default MemberChitCard;