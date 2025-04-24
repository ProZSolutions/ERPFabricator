import React from 'react';
import { View, Text } from 'react-native';
import { chitNameFormat, formatAmount } from '../../utils';

const TransactionDetailsCard = ({ item }) => {
    return (
        <View className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 mb-3 pb-3">
            <View className="flex-row pt-1 pb-2">
                {/* <Text className="text-custom-companytxt text-xs font-normal pr-1">Chit No :</Text> */}
                <Text className="text-custom-heading text-xs font-medium">{chitNameFormat(item.chit_name, item.chit_id)}</Text>
            </View>

            <View className="border-b border-gray-200 mb-2"></View>

            <View className="flex-row justify-between items-center mb-2">
                <Text className="text-custom-hyperlink text-xs font-medium">{item?.chit_month}ᵗʰ Month</Text>
            </View>


            <View className="flex-row justify-between items-center mb-2">
                <Text className="text-custom-companytxt text-xs font-normal w-[40%]">Amount Received</Text>
                <Text className="text-custom-companytxt text-center w-[20%]">:</Text>
                <Text className="text-custom-hyperlink text-sm font-medium w-[40%]">{formatAmount(item.amount)}</Text>
            </View>

            <View className="flex-row justify-between mb-2">
                <Text className="text-custom-companytxt text-xs font-normal w-[40%]">Received Date</Text>
                <Text className="text-custom-companytxt text-center w-[20%]">:</Text>
                <Text className="text-custom-heading text-sm font-medium w-[40%]">{item?.payment_date}</Text>
            </View>

            <View className="flex-row justify-between mb-2">
                <Text className="text-custom-companytxt text-xs font-normal w-[40%]">Mode of Payment</Text>
                <Text className="text-custom-companytxt text-center w-[20%]">:</Text>
                <Text className="text-custom-heading text-sm font-medium w-[40%]">{item?.mode_of_payment}</Text>
            </View>

            <View className="flex-row justify-between">
                <Text className="text-custom-companytxt text-xs font-normal w-[40%]">Transaction Details</Text>
                <Text className="text-custom-companytxt text-center w-[20%]">:</Text>
                <Text className="text-custom-heading text-sm font-medium w-[40%]">{item?.transaction_details || '-'}</Text>
            </View>


        </View>
    );
};

export default TransactionDetailsCard;
