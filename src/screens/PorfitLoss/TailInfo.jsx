import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native';
import ListIcon from '../../assets/svg-component/ListIcon';
import { styled } from 'nativewind';
import { formatAmount } from '../../utils';
import TotalAmountCollected from '../../assets/svg-component/TotalAmountCollected';
import SettlementIcon from '../../assets/svg-component/SettlementIcon';
import CommisionReceivedIcon from '../../assets/svg-component/CommisionReceivedIcon';
import LossIcon from '../../assets/svg-component/LossIcon';
import DownloadWhiteIcon from '../../assets/svg-component/DownloadWhiteIcon';



const StyledTouchableOpacity = styled(TouchableOpacity);

const BoxItem = ({ title = '', width, style, amount = 0, icon = null }) => {
    return (
        <StyledTouchableOpacity
            onPress={() => { }}
            style={[{ width }, style]}
            className="min-h-[120px] rounded-lg justify-center items-center border border-[#303D501A]"
        >

            <View className="flex-row w-full justify-between items-center space-x-1 px-2">
                <View className="w-[20%]">
                    {icon}
                </View>
                <Text className="w-[80%] text-custom-heading text-lg font-medium mb-1  text-left">{formatAmount(amount)}</Text>
            </View>
            <View className="mt-4 w-full px-2">
                <Text className="text-custom-companytxt text-sm font-medium">{title}</Text>
            </View>

        </StyledTouchableOpacity>
    );
};


function TailInfo({ summaryData }) {
    return (
        <View className="px-2 py-2">
         
             <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg text-custom-heading font-bold mb-4">Summary for</Text>
                <View className="flex-row space-x-2 items-center bg-custom-btnLightBlue py-2 px-2 rounded-lg">
                    <DownloadWhiteIcon />
                    <Text className="text-custom-hyperlink text-sm font-normal">Report</Text>
                </View>
            </View>
            <View className="flex-row flex-wrap justify-between">
                <BoxItem
                    title={"Total Amount Collected"}
                    width={"48%"}
                    style={{ marginBottom: 15 }}
                    amount={summaryData?.data?.total_amount_collected}
                    icon={<TotalAmountCollected/>}
                />
                <BoxItem
                    title={"Total Amount Settled"}
                    width={"48%"}
                    style={{ marginBottom: 15 }}
                    amount={summaryData?.data?.total_amount_settled}
                    icon={<SettlementIcon/>}
                />
                <BoxItem
                    title={"Commission Received"}
                    width={"48%"}
                    style={{ marginBottom: 15 }}
                    amount={summaryData?.data?.total_commission_amount}
                    icon={<CommisionReceivedIcon/>}
                />
                <BoxItem
                    title={summaryData?.data?.pl_label || "Profit/Loss"}
                    width={"48%"}
                    style={{ marginBottom: 15 }}
                    amount={summaryData?.data?.profit_loss_amount}
                    icon={<LossIcon/>}
                />
            </View>
        </View>
    )
}
export default TailInfo;