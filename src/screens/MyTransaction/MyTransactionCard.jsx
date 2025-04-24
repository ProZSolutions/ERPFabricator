import React from 'react'
import { Text, View } from 'react-native';
import { chitNameFormat, formatAmount } from '../../utils';

function MyTransactionCard({ item }) {
    return (
        <View className="bg-white rounded-lg shadow-sm p-2 border border-gray-200 mb-3">
            <View className="flex-row justify-between items-center p-1">
                <View className="flex-row items-center space-x-2">
                    {/* <Text className="text-custom-heading text-sm font-medium">Chit No : </Text> */}
                    <Text className="text-custom-heading text-sm font-medium">{chitNameFormat(item?.chit_name, item?.chit_id)}</Text>
                </View>
                <View className="flex-row items-center bg-custom-lightblue px-4 py-1 rounded-2xl" >
                    <Text className="text-custom-hyperlink text-sm font-medium">{item.chit_month}ᵗʰ Month </Text>
                </View>
            </View>

            <View className="border-b border-gray-200 my-2"></View>

            <View className="flex-row justify-between items-center pb-1">
                <View>
                    <Text className="text-custom-companytxt text-sm font-medium pb-1">Date</Text>
                    <Text className="text-custom-heading text-sm font-medium">{item?.payment_date}</Text>
                </View>
                {item.lable !== 'paid' && (
                    <View className="items-start">
                        <Text className="text-custom-companytxt text-sm font-medium pb-1">Pending</Text>
                        <Text className="text-custom-red text-xs font-medium">{formatAmount(item?.pending_amount)}</Text>
                    </View>
                )}
                <View className="items-start">
                    <Text className="text-custom-companytxt text-sm font-medium pb-1">{item.lable === 'paid' ? 'Paid Amount' : "Part-Paid"}</Text>
                    <Text className="text-custom-hyperlink text-base font-medium">{formatAmount(item?.amount)}</Text>
                </View>
            </View>
        </View>
    )
}
export default MyTransactionCard;