import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { formatAmount } from '../../utils';
import CircularProgress from '../../component/Chart/CircularProgress';


function YetToStartCard({
    totalMembers,
    lastAuctionDate = null,
    dueAmount = 0,
    timePeriod = 0,
    currentTimePeriod = 0,
    isClosed = false }) {
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
                <TouchableOpacity>
                    <Text className="text-custom-heading text-xs font-medium  mt-1 pl-1">{totalMembers}</Text>
                </TouchableOpacity>
            </View>

            <View>
                <Text className="text-custom-companytxt text-xs font-normal">Auction Date</Text>
                <Text className="text-custom-heading text-xs font-medium mt-1">{lastAuctionDate}</Text>
            </View>

            <View>
                <Text className="text-custom-companytxt text-xs font-normal">{isClosed ? "Auction Amount" : "Start From"}</Text>
                <Text className={`${isClosed ? "text-custom-hyperlink" : "text-custom-red"} text-base font-medium`}>{formatAmount(dueAmount)}</Text>
            </View>
        </View>
    );

}

export default YetToStartCard;