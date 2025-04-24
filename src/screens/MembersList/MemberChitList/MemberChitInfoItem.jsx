import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import CircularProgress from '../../../component/Chart/CircularProgress';
import { formatAmount } from '../../../utils';


const MemberChitInfoItem = ({
    totalMembers,
    lastAuctionDate = null,
    dueAmount = 0,
    timePeriod = 0,
    currentTimePeriod = 0,
    item = null,
    gotoDetailsScreen = () => {}
}) => {
    const progress = (currentTimePeriod / timePeriod) * 100;

    return (
        <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
                <CircularProgress
                    size={50}
                    progress={progress}
                    color="#285FE7"
                    total={timePeriod}
                    added={currentTimePeriod}
                />
            </View>

            <View>
                <Text className="text-custom-companytxt text-xs font-normal">Members</Text>
                <TouchableOpacity onPress={() => gotoDetailsScreen(item)}>
                    <Text className="text-custom-hyperlink text-xs font-medium underline mt-1 pl-1">{totalMembers}</Text>
                </TouchableOpacity>
            </View>

            <View>
                <Text className="text-custom-companytxt text-xs font-normal">Next Auction Date</Text>
                <Text className="text-custom-heading text-xs font-medium mt-1">{lastAuctionDate}</Text>
            </View>

            <View>
                <Text className="text-custom-companytxt text-xs font-normal">Amount Paid</Text>
                <Text className="text-custom-red text-base font-medium">{formatAmount(dueAmount)}</Text>
            </View>
        </View>
    );
};

export default MemberChitInfoItem;
