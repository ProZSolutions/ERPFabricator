import React, { useEffect, useState,useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import Collapsible from 'react-native-collapsible';
import GreaterThanIcon from '../../assets/svg-component/GreaterThanIcon';
import DownArrowIcon from '../../assets/svg-component/DownArrowIcon';
import CustomButton from '../../component/Button/CustomButton';
import handleError from '../../component/ErrorHandler/ErrorHandler';
import { postData } from '../../api/ApiService';
import Spinner from '../../component/Spinner/Spinner';
import { formatAmount } from '../../utils';
import LottUserIcon from '../../assets/svg-component/LottUserIcon';
import LottIcon from '../../assets/svg-component/LottIcon';
import { useNavigation,useFocusEffect } from '@react-navigation/native';

const AuctionComponent = ({ chitId, auctionMonth, status }) => {
    const [auctionList, setAuctionList] = useState([]);
    const [previousCollapses, setPreviousCollapses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isNextCollapsed, setIsNextCollapsed] = useState(true);
    const [auctionReq, setAuctionReq] = useState('');
    const navigation = useNavigation();
    const [openPreviousIndex, setOpenPreviousIndex] = useState(null);


    const togglePreviousCollapse = (index) => {
        setOpenPreviousIndex(prevIndex => prevIndex === index ? null : index);

        setPreviousCollapses(prev => prev.map((collapsed, i) => (i === index ? !collapsed : collapsed)));
    };

    const fetchChitAuction = async () => {
        setLoading(true);
        try {
            const response = await postData('/collection-list', { chit_no: chitId });
            if (response && response.status === 'success') {
                setAuctionList(response.auctiondata);
                setAuctionReq(response.last_auction_data);
                // Initialize collapsible states to true for each auction
                setPreviousCollapses(new Array(response.auctiondata.length).fill(true));
            } else {
                setAuctionList([]);
                setPreviousCollapses([]);
                setAuctionReq('');
            }
        } catch (error) {
            if (error?.response?.data?.status === "error") {
                Alert.alert(
                    "Error",
                    error?.response?.data?.error || "An error occurred."
                );
            } else {
                await handleError(error, false);
            }
        } finally {
            setLoading(false);
        }
    };

    /*useEffect(() => {
        if (status.toLowerCase() !== 'new') {
            fetchChitAuction();
        }

    
    }, [chitId]); */
    useFocusEffect(
        useCallback(() => {
            if (status.toLowerCase() !== 'new') {
                fetchChitAuction();
            }
        }, [chitId])
    );

    const gotoPendingDetailsPage = (item) => {
        if (item?.pending_no_collection > 0) {
            navigation.navigate("PendingDetails", {
                item: {
                    ...item,
                    chit_month: item.auction_month
                }
            });
        }
    }

    return (
        <View>
            {loading ? (
                <Spinner visible={loading} textContent="Loading..." />
            ) : status.toLowerCase() !== 'new' ? (
                <View className="pt-4 bg-white">
                    <TouchableOpacity
                        onPress={() => setIsNextCollapsed(!isNextCollapsed)}
                        className={`flex-row items-center bg-white p-2 shadow-md border border-gray-200 ${isNextCollapsed ? 'rounded-lg' : 'rounded-tl-lg rounded-tr-lg'}`}
                    >
                        <View className="flex-1">
                            <Text className="text-custom-hyperlink text-sm font-medium py-2">{auctionReq?.auction_month}ᵗʰ Month</Text>
                        </View>
                        <View className="flex-shrink-0 w-2/10">
                            {isNextCollapsed ? <GreaterThanIcon /> : <DownArrowIcon />}
                        </View>
                    </TouchableOpacity>

                    <Collapsible collapsed={isNextCollapsed}>
                        <View className="bg-custom-lightgreen p-2 rounded-bl-xl rounded-br-xl shadow-md mb-2">
                            <View className="flex-row justify-between mb-4">
                                <Text className="w-1/2 text-custom-companytxt text-xs font-normal">Auction Date:
                                    <Text className="text-custom-heading text-sm font-medium">{auctionReq?.auction_date}</Text></Text>
                                <Text className="w-1/2 text-right text-custom-companytxt text-xs font-normal">Status:
                                    <Text className="text-custom-heading text-sm font-medium">{auctionReq?.status}</Text></Text>
                            </View>
                            {/* <Text className="text-custom-companytxt text-xs font-normal">Collection:
                                 <Text className="text-custom-heading text-sm font-medium">
                                    <Text className="text-custom-red">0</Text>/{auctionData?.no_members}
                                    </Text>
                                </Text> */}
                            <View className="flex-row justify-end mt-2">
                                {auctionReq?.auction_request === 0 ? (
                                    <CustomButton
                                        isActive={false}
                                        title={`Auction Requests`}
                                        onPress={() => { }} />
                                ) : (
                                    <CustomButton
                                        title={`${auctionReq?.auction_request} Auction Requests`}
                                        onPress={() => navigation.navigate('AuctionReqList', { chitId, auctionMonth })} />
                                )}

                            </View>
                        </View>
                    </Collapsible>

                    {auctionList?.map((auction, index) => (
                        <View key={index}>
                            <TouchableOpacity
                                onPress={() => togglePreviousCollapse(index)}
                                className={`flex-row justify-between items-center bg-white p-2 shadow-md mt-4 border border-gray-200 ${openPreviousIndex !== index ? 'rounded-lg' : 'rounded-tl-lg rounded-tr-lg'}`}
                            >
                                <View className="flex-1">
                                    <Text className="text-custom-hyperlink text-sm font-medium py-2">{auction.auction_month}ᵗʰ Month</Text>
                                </View>
                                {auction.auction_win_type === 'custom' ? <LottUserIcon /> : <LottIcon />}
                                {openPreviousIndex !== index ? <GreaterThanIcon /> : <DownArrowIcon />}
                            </TouchableOpacity>

                            <Collapsible collapsed={openPreviousIndex !== index}>
                                <View className="bg-custom-lightblue p-2 rounded-bl-xl rounded-br-xl shadow-md mb-2">
                                    {[ 
                                        { label: "Auction Date", value: auction.auction_date },
                                        { label: "Status", value: auction.status },
                                        { label: "Dividend Amount", value: formatAmount(auction.dividend_amount) },
                                        { label: "Auction Amount", value: formatAmount(auction.auction_win_amount) },
                                        { label: "Due Amount", value: formatAmount(auction.total_due_amount) },
                                        { label: "Total Pending Amount", value: formatAmount(auction.total_pending_amount) },
                                    ].map((item, idx) => (
                                        <View key={idx} className="flex-row justify-between items-center mb-2">
                                            <Text className="basis-[50%] text-custom-companytxt text-xs font-normal">{item.label}</Text>
                                            <Text className="basis-[5%] text-center">:</Text>
                                            <Text className="basis-[50%] text-custom-heading text-sm font-medium pl-2">{item.value}</Text>
                                        </View>
                                    ))}
                                    <View className="flex-row justify-between items-center bg-white px-4 py-2 mb-3">
                                        <View className="flex-row items-center">
                                            <Text className="text-custom-companytxt text-xs font-normal">Pending Collection</Text>
                                            <Text className="text-custom-companytxt text-xs font-normal mx-1">:</Text>
                                            <Text className="text-custom-heading text-sm font-medium">
                                                <Text className="text-custom-red">{auction.total_no_collection - auction.pending_no_collection}</Text>/ {auction.total_no_collection}
                                            </Text>
                                        </View>
                                        <TouchableOpacity onPress={() => gotoPendingDetailsPage(auction)}>
                                            <Text className="text-custom-heading px-4 py-2 rounded-1xl bg-custom-lightgreen text-sm font-medium">{auction.due_pending_status}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View className="flex-row justify-end items-center mb-2">
                                        <Text className="text-right text-custom-companytxt text-xs font-normal">Taken By:</Text>
                                        <Text className="text-custom-hyperlink text-sm font-medium ml-[3px]">{auction.winner_name}</Text>
                                    </View>
                                </View>
                            </Collapsible>
                        </View>
                    ))}
                </View>
            ) : (
                <View className="pt-4 bg-white flex-row justify-center items-center h-[60%]">
                    <Text className="text-lg font-medium text-center text-custom-red">Yet to be started...</Text>
                </View>
            )}
        </View>
    );
};


export default AuctionComponent;
