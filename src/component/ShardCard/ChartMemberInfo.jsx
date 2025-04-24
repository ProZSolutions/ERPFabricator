import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import CircularProgress from '../Chart/CircularProgress';
import { formatAmount } from '../../utils';
import DownloadIcon from '../../assets/svg-component/DownloadIcon';

const ChartMemberInfo = ({ totalMembers,
    lastAuctionDate = null,
    dueAmount = 0,
    timePeriod = 0, 
    currentTimePeriod = 0,
    status = "old"
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
                     <Text className="text-custom-heading text-xs font-medium  mt-1 pl-1">{totalMembers}</Text>
             </View>

            <View>
                <Text className="text-custom-companytxt text-xs font-normal">Last Auction Date</Text>
                <Text className={`text-custom-heading text-xs font-medium mt-1 ${lastAuctionDate ? '' : "text-center"}`}>{lastAuctionDate ? lastAuctionDate : '-'}</Text>
            </View>

            <View>
                {status === 'new' ? (
                    <View>
                        <DownloadIcon />
                    </View>
                ) : (
                    <View>
                        <Text className="text-custom-companytxt text-xs font-normal">Due Amount</Text>
                        <Text className="text-custom-red text-base font-medium">{formatAmount(dueAmount)}</Text>
                    </View>
                )}

            </View>
        </View>
    );
};

export default ChartMemberInfo;
