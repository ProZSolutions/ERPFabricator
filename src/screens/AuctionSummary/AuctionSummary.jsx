import React from 'react'
import { Text, View } from 'react-native'
import CustomHeader from '../../component/Header/CustomHeader'
import Container from '../../component/Container/Container'
import { capitalizeFirstLetter, chitNameFormat, formatAmount } from '../../utils'
import ChitWonIcon from '../../assets/svg-component/ChitWonIcon'
import CustomFooter from '../../component/Footer/CustomFooter'

function AuctionSummary({ route }) {
    const { chit_name = '', chit_id, date, month, cumulative_amount, customerName } = route.params || {};
    console.log("AuctionSummary params:", JSON.stringify(route.params, null, 2));

    return (
        <View className="flex-1 bg-white">
            <CustomHeader name={`${chitNameFormat(chit_name, chit_id)} Auction`} isBackIcon={false} />
            <Container paddingBottom={80}>
                <View className="bg-white rounded-lg shadow-md px-2 border border-gray-200">
                    <View className="mb-4 mt-2">
                        <Text className="text-custom-red text-lg font-bold text-center">
                            AUCTION IS CLOSED!
                        </Text>
                    </View>
                    <View className="flex-row justify-between items-center mb-4 mt-2 px-2">
                        <View className="w-[34%]">
                            <Text className="text-xs text-custom-companytxt font-normal ">
                                Auction Date
                            </Text>
                            <Text className="text-xs text-custom-heading font-normal ">
                                {date}
                            </Text>
                        </View>

                        <View className="bg-custom-lightblue rounded-full px-4 py-2 w-[33%] items-center">
                            <Text className="text-custom-hyperlink text-xs font-medium">
                                {month || 0}ᵗʰ Month
                                {/* || confirmData?.data?.no_month */}
                            </Text>
                        </View>
                        <View className="w-[33%]">
                            <Text className="text-xs text-custom-companytxt font-normal text-right">
                                Auction Amount
                            </Text>
                            <Text className="text-custom-hyperlink text-sm font-medium text-right">
                                {formatAmount(cumulative_amount)}
                            </Text>
                        </View>

                    </View>
                    <View className="w-full h-[1px] bg-gray-200 my-2" />

                    <View className="flex-1 mt-10 mb-10">
                        <View className="h-[100%] flex justify-center items-center">
                            <ChitWonIcon />
                            <Text className="text-custom-companytxt text-center mt-4">Best wishes!!</Text>
                            <Text className="text-custom-companytxt text-center mt-1">
                                Chit for this month is provided to
                            </Text>
                            <Text className="text-custom-hyperlink text-lg font-bold text-center mt-1">
                                {capitalizeFirstLetter(customerName)}
                            </Text>
                        </View>
                    </View>
                </View>
            </Container>
            <CustomFooter />
        </View>
    )
}
export default AuctionSummary;