import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Collapsible from "react-native-collapsible";
import GreaterThanIcon from "../../assets/svg-component/GreaterThanIcon";
import DownArrowIcon from "../../assets/svg-component/DownArrowIcon";
import CustomButton from "../../component/Button/CustomButton";

const MyChitAuctionComponent = () => {
    const [isNextCollapsed, setIsNextCollapsed] = useState(true);
    const [previousCollapses, setPreviousCollapses] = useState([
        true,
        true,
        true,
        true,
        true,
    ]);

    const previousAuctions = [
        {
            date: "Jul 20, 2024",
            status: "Pending",
            dividendAmount: "₹500.00",
            dueAmount: "₹4,000.00",
            totalPendingAmount: "₹22,000.00",
            auctionAmount: "₹80,000.00",
            collection: "06/20",
            requester: "John Doe 1",
        },
        {
            date: "Jun 15, 2024",
            status: "Completed",
            dividendAmount: "₹600.00",
            dueAmount: "₹0.00",
            totalPendingAmount: "₹0.00",
            auctionAmount: "₹75,000.00",
            collection: "20/20",
            requester: "John Doe 2",
        },
        {
            date: "May 10, 2024",
            status: "Cancelled",
            dividendAmount: "₹0.00",
            dueAmount: "₹4,000.00",
            totalPendingAmount: "₹4,000.00",
            auctionAmount: "₹80,000.00",
            collection: "0/20",
            requester: "Jane Doe",
        },
        {
            date: "Apr 05, 2024",
            status: "Pending",
            dividendAmount: "₹400.00",
            dueAmount: "₹2,000.00",
            totalPendingAmount: "₹10,000.00",
            auctionAmount: "₹70,000.00",
            collection: "10/20",
            requester: "Alice Smith",
        },
        {
            date: "Mar 01, 2024",
            status: "Completed",
            dividendAmount: "₹700.00",
            dueAmount: "₹0.00",
            totalPendingAmount: "₹0.00",
            auctionAmount: "₹90,000.00",
            collection: "20/20",
            requester: "Bob Johnson",
        },
    ];

    const togglePreviousCollapse = (index) => {
        setPreviousCollapses((prev) =>
            prev.map((collapsed, i) => (i === index ? !collapsed : collapsed))
        );
    };

    return (
        <View className="pt-4 bg-white">
            {previousAuctions.map((auction, index) => (
                <View key={index}
                    className={`border border-gray-200 rounded-lg mb-3`}>
                    <TouchableOpacity
                        onPress={() => togglePreviousCollapse(index)}
                        className={`flex-row justify-between items-center p-2`}
                    >
                        <View className="flex-1">
                            <Text className="text-custom-heading text-base font-medium">
                                Previous Auction
                            </Text>
                        </View>
                        <View className="mr-1">
                            <Text className="bg-custom-lightblue text-custom-hyperlink text-xs font-medium p-2 px-3 rounded-2xl">
                                5th Month
                            </Text>
                        </View>
                        {previousCollapses[index] ? <GreaterThanIcon /> : <DownArrowIcon />}
                    </TouchableOpacity>
                    {!previousCollapses[index] && (<View className="w-full h-[1px] bg-gray-200 mb-3"></View>)}
                    <Collapsible collapsed={previousCollapses[index]}>
                        <View className="bg-white px-2 rounded-bl-xl rounded-br-xl shadow-md mb-2">
                            <View className="flex-row justify-between mb-2">
                                <View className="w-[80%] flex-row items-center">
                                    <Text className="text-custom-companytxt text-xs font-normal w-[40%]">
                                        Auction Date
                                    </Text>
                                    <Text className="text-custom-companytxt text-center w-[20%]">:</Text>
                                    <Text className="text-custom-heading text-sm font-medium w-[40%]">
                                        {auction.date}
                                    </Text>
                                </View>

                                <View className="w-[20%] flex-row items-center justify-end">
                                    <Text className="text-right text-custom-companytxt text-xs font-normal">
                                        Chit
                                    </Text>
                                    <Text className="text-custom-companytxt text-xs font-normal px-1">:</Text>
                                    <Text className="text-custom-hyperlink text-xs font-bold">Taken</Text>
                                </View>
                            </View>

                            <View className="w-[80%] flex-row items-center mb-2">
                                <Text className="text-custom-companytxt text-xs font-normal w-[40%]">
                                    Auction Amount
                                </Text>
                                <Text className="text-custom-companytxt text-center w-[20%]">:</Text>
                                <Text className="text-custom-heading text-sm font-medium w-[40%]">
                                    ₹84,000.00
                                </Text>
                            </View>

                            <View className="w-[80%] flex-row items-center mb-2">
                                <Text className="text-custom-companytxt text-xs font-normal w-[40%]">
                                    Dividend Amount
                                </Text>
                                <Text className="text-custom-companytxt text-center w-[20%]">:</Text>
                                <Text className="text-custom-heading text-sm font-medium w-[40%]">
                                    {auction.dividendAmount}
                                </Text>
                            </View>

                            <View className="w-[80%] flex-row items-center">
                                <Text className="text-custom-companytxt text-xs font-normal w-[40%]">
                                    Due Amount
                                </Text>
                                <Text className="text-custom-companytxt text-center w-[20%]">:</Text>
                                <Text className="text-custom-heading text-sm font-medium w-[40%]">
                                    {auction.dueAmount}
                                </Text>
                            </View>
                        </View>
                        {!previousCollapses[index] && (<View className="w-full h-[1px] bg-gray-200 my-3"></View>)}
                        <View className="bg-white px-2 rounded-bl-xl rounded-br-xl shadow-md">
                            <View className="flex-row justify-between mb-2">
                                <View className="w-[100%] flex-row items-center">
                                    <Text className="text-custom-companytxt text-xs font-normal w-[40%]">
                                    Settled Amount
                                    </Text>
                                    <Text className="text-custom-companytxt text-center w-[20%]">:</Text>
                                    <Text className="text-custom-heading text-sm font-medium w-[40%]">
                                    ₹84,000.00
                                    </Text>
                                </View>

                               
                            </View>

                            <View className="w-[100%] flex-row items-center mb-2">
                                <Text className="text-custom-companytxt text-xs font-normal w-[40%]">
                                Settlement Date 
                                </Text>
                                <Text className="text-custom-companytxt text-center w-[20%]">:</Text>
                                <Text className="text-custom-heading text-sm font-medium w-[40%]">
                                Aug 21, 2024
                                </Text>
                            </View>

                            <View className="w-[100%] flex-row items-center mb-2">
                                <Text className="text-custom-companytxt text-xs font-normal w-[40%]">
                                Mode of Payment 
                                </Text>
                                <Text className="text-custom-companytxt text-center w-[20%]">:</Text>
                                <Text className="text-custom-heading text-sm font-medium w-[40%]">
                                   UPI
                                </Text>
                            </View>

                            <View className="w-[100%] flex-row items-center mb-2">
                                <Text className="text-custom-companytxt text-xs font-normal w-[40%]">
                                Transaction Details  
                                </Text>
                                <Text className="text-custom-companytxt text-center w-[20%]">:</Text>
                                <Text className="text-custom-heading text-sm font-medium w-[40%]">
                                UPI63XXXX42
                                </Text>
                            </View>
                            <View className="w-[100%] flex-row items-center mb-4">
                                <Text className="text-custom-companytxt text-xs font-normal w-[40%]">
                                Attached Documents  
                                </Text>
                                <Text className="text-custom-companytxt text-center w-[20%]">:</Text>
                                <Text className="text-custom-hyperlink underline text-sm font-medium w-[40%]">
                                Preview
                                </Text>
                            </View>
                        </View>
                    </Collapsible>

                </View>
            ))}
        </View>
    );
};

export default MyChitAuctionComponent;
