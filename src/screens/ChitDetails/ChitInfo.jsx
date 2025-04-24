import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DownloadIcon from '../../assets/svg-component/DownloadIcon';
import ChartMemberInfo from '../../component/ShardCard/ChartMemberInfo';
import { formatAmount } from '../../utils';
import EditIconWithBlueBG from '../../assets/svg-component/EditIconWithBlueBG';

const ChitInfo = ({ 
    item,
    onEditChitInfo = () => {}
}) => {
    return (
        <View className="bg-white p-2 rounded-lg shadow-md border border-gray-200 mb-4">
            <View className="flex-row justify-between items-center">
                <View>
                    <Text className="text-custom-companytxt text-xs font-normal">Start Date</Text>
                    <Text className="text-custom-heading text-sm font-medium">{item?.start_month}</Text>
                </View>
                <View>
                    <Text className="text-custom-companytxt text-xs font-normal">Chit Value</Text>
                    <Text className="text-custom-heading text-sm font-medium">{formatAmount(item?.cumulative_amount)}</Text>
                </View>

                {item?.newstatus?.toLowerCase() === 'new' ?
                    (
                        <TouchableOpacity onPress={()=>onEditChitInfo(item)}>
                            <EditIconWithBlueBG />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity>
                            <DownloadIcon />
                        </TouchableOpacity>
                    )
                }


            </View>

            <View className="w-full h-[1px] bg-gray-300 my-4" />

            <ChartMemberInfo
                totalMembers={item?.no_members || 0}
                lastAuctionDate={item?.last_auction_date}
                dueAmount={item?.due_amount || 0}
                timePeriod={item?.time_period || 0}
                currentTimePeriod={item?.current_time_period || 0}
                status={item?.newstatus?.toLowerCase() || 'old'}
            />
        </View>
    );
};

export default ChitInfo;
