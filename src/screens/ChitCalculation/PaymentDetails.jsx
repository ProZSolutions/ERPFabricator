import { View, Text, TouchableOpacity } from 'react-native';
import DownloadIcon from '../../assets/svg-component/DownloadIcon';
import ShareIcon from '../../assets/svg-component/ShareIcon';
import { formatAmount } from '../../utils';

const PaymentDetails = ({item}) => {
    return (
        <View className="p-4 bg-blue-50 rounded-md my-4">
            <View className="mb-4">
                <View className="flex-row items-center">
                    <Text className="flex-[0.5] text-custom-companytxt text-xs font-normal">Auction Amount</Text>
                    <Text className="flex-[0.2] text-custom-companytxt text-center">:</Text>
                    <Text className="flex-[0.3] text-custom-heading text-sm font-medium text-right">{formatAmount(item.auctionAmount)}</Text>
                </View>
                <View className="flex-row items-center mt-2">
                    <Text className="flex-[0.5] text-custom-companytxt text-xs font-normal">Agent Commission</Text>
                    <Text className="flex-[0.2] text-custom-companytxt text-center">:</Text>
                    <Text className="flex-[0.3] text-custom-heading text-sm font-medium text-right">{formatAmount(item.agentCommision)}</Text>
                </View>
                <View className="flex-row items-center mt-4 bg-white p-2 rounded-md">
                    <Text className="flex-[0.5] text-custom-heading text-xs font-semibold">Total Amount Payable</Text>
                    <Text className="flex-[0.2] text-gray-500 text-center">:</Text>
                    <Text className="flex-[0.3] text-custom-hyperlink text-sm font-medium text-right">{formatAmount(item.totalAmtPayable)}</Text>
                </View>
            </View>

            <View className="w-full h-[1px] bg-gray-300 mb-4" />

            <View className="mb-4">
                <View className="flex-row items-center">
                    <Text className="flex-[0.5] text-custom-companytxt text-xs font-normal">Dividend Per Member</Text>
                    <Text className="flex-[0.2] text-custom-companytxt text-center">:</Text>
                    <Text className="flex-[0.3] text-custom-heading text-sm font-medium text-right">{formatAmount(item.dividendPerMember)}</Text>
                </View>
                <View className="flex-row items-center mt-2 bg-white p-2 rounded-md">
                    <Text className="flex-[0.5] text-custom-companytxt text-xs font-normal">Payable Amount Per Person</Text>
                    <Text className="flex-[0.2] text-custom-companytxt text-center">:</Text>
                    <Text className="flex-[0.3] text-custom-heading text-sm font-medium text-right">{formatAmount(item.payableAmtPerPersion)}</Text>
                </View>
            </View>

            <View className="flex-row justify-end space-x-4">
                <TouchableOpacity className="bg-black p-2 rounded-full">
                     <DownloadIcon/> 
                </TouchableOpacity>
                <TouchableOpacity className="bg-blue-500 p-2 rounded-full">
                    <ShareIcon/>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default PaymentDetails;
