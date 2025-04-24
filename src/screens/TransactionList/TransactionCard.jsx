import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native';
import GreaterThanIcon from '../../assets/svg-component/GreaterThanIcon';
import { useNavigation } from '@react-navigation/native';
import { capitalizeFirstLetter, chitNameFormat, formatAmount } from '../../utils';

function TransactionCard({ item, activeItem }) {
    const navigation = useNavigation();
    const onPressView = (obj, btn) => {
        const targetScreen = btn === 'collection' ? 'TransactionDetails' : 'SettlementDetails';
        navigation.navigate(targetScreen, { item });
    };
    
    return (
        <View className="bg-white rounded-lg shadow-sm p-2 border border-gray-200 mb-3">
            <View className="flex-row justify-between items-center">
                <View>
                    <Text className="text-custom-heading text-sm font-medium pb-1">{capitalizeFirstLetter(item?.name)}</Text>
                    <Text className="text-custom-hyperlink text-xs font-light">{item?.contact}</Text>
                </View>
                <TouchableOpacity className="flex-row items-center space-x-1" onPress={() => onPressView(item, activeItem)}>
                    <Text className="text-custom-hyperlink text-xs font-normal">View</Text>
                    <GreaterThanIcon />
                </TouchableOpacity>
            </View>

            <View className="border-b border-gray-200 my-2"></View>

            <View className="flex-row justify-between items-center">
                <View>
                    <Text className="text-custom-companytxt text-xs font-normal pb-1">Chit Name :</Text>
                    <Text className="text-custom-heading text-xs font-medium">{chitNameFormat(item?.chit_name, item?.chit_id)}</Text>
                </View>

                <View className="items-start">
                    <Text className="text-custom-hyperlink text-xs font-medium pb-1">{item.chit_month}ᵗʰ Month</Text>
                    <Text className="text-custom-companytxt text-xs font-medium">{item.payment_date}</Text>
                </View>

                <View className="items-start">
                    <Text className="text-custom-companytxt text-xs font-medium pb-1">{activeItem === "collection" ? "Amount Received" : "Settled Amount"}</Text>
                    <Text className="text-custom-hyperlink text-sm font-medium">{formatAmount(item.amount)}</Text>
                </View>
            </View>
        </View>
    )
}


export default TransactionCard;