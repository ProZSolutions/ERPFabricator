import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { postData } from '../../api/ApiService';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import handleError from '../../component/ErrorHandler/ErrorHandler';
import Spinner from '../../component/Spinner/Spinner';
import GreaterThanIcon from '../../assets/svg-component/GreaterThanIcon';
import DownArrowIcon from '../../assets/svg-component/DownArrowIcon';
import CustomButton from '../../component/Button/CustomButton';
import Collapsible from 'react-native-collapsible';
import LottUserIcon from '../../assets/svg-component/LottUserIcon';
import LottIcon from '../../assets/svg-component/LottIcon';
import { formatAmount } from '../../utils';

function MyChitPayment({ chitId, auctionMonth }) {
    const [auctionList, setAuctionList] = useState([]);
    const [previousCollapses, setPreviousCollapses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isNextCollapsed, setIsNextCollapsed] = useState(true);
    const [auctionReq, setAuctionReq] = useState('');
    const navigation = useNavigation();
    const [activeIndex, setActiveIndex] = useState(null);


    const togglePreviousCollapse = (index) => {
        setActiveIndex(prevIndex => (prevIndex === index ? null : index));

         setPreviousCollapses(prev => prev.map((collapsed, i) => (i === index ? !collapsed : collapsed)));
    };

    const fetchChitAuction = async () => {
        setLoading(true);
        try {
            console.log("mychitOD"," chit if "+chitId);
            const response = await postData('/my-invest-chit-payments', { chit_no: chitId });
            if (response && response.status === 'success') {
                setAuctionList(response.payment_data);
                //setAuctionReq(response.last_auction_data);
                // Initialize collapsible states to true for each auction
                setPreviousCollapses(new Array(response.payment_data.length).fill(true));
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

    useEffect(() => {
        fetchChitAuction();
    }, [chitId]);

    return (
        <View>
            {loading ? (
                <Spinner visible={loading} textContent="Loading..." />
            ) : (
                <View className="pt-4 bg-white">
                    {/* <TouchableOpacity
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

                            <View className="flex-row justify-end mt-2">
                                {auctionReq.auction_request === 0 ? (
                                    <CustomButton
                                        isActive={false}
                                        title={`Auction Requests`}
                                        onPress={() => { }} />
                                ) : (
                                    <CustomButton
                                        title={`${auctionReq.auction_request} Auction Requests`}
                                        onPress={() => navigation.navigate('AuctionReqList', { chitId, auctionMonth })} />
                                )}

                            </View>
                        </View>
                    </Collapsible> */}

                    {auctionList.map((auction, index) => (
                        <View key={index}>
                            <TouchableOpacity
                                onPress={() => togglePreviousCollapse(index)}
                                className={`flex-row justify-between items-center bg-white p-2 shadow-md mt-4 border border-gray-200 ${previousCollapses[index] ? 'rounded-lg' : 'rounded-tl-lg rounded-tr-lg'}`}
                            >

                                <View className="flex-1">
                                    <Text className="text-custom-hyperlink text-sm font-medium py-2">{auction.chit_month}ᵗʰ Month</Text>
                                </View>
                                {auction.auction_win_type == 'custom' ? <LottUserIcon /> : <LottIcon />}
                                {previousCollapses[index] ? <GreaterThanIcon /> : <DownArrowIcon />}
                            </TouchableOpacity>

                            <Collapsible collapsed={activeIndex !== index}>
                                <View className="bg-custom-lightblue p-2 rounded-bl-xl rounded-br-xl shadow-md mb-2">
                                    {[
                                        { label: "Auction Date", value: auction.auction_date },
                                        { label: "Auction Amount", value: formatAmount(auction.auction_amount) },
                                        { label: "Dividend Amount", value: formatAmount(auction.ps_amount) },
                                        { label: "Due Amount", value: formatAmount(auction.due_amount) },
                                        { label: "Paid Amount", value: formatAmount(auction.settled_amount) },
                                        { label: "Paid Date", value: auction.settled_date },
                                        { label: "Mode of Payment", value: auction.mode_of_payment },
                                        { label: "Transaction Details", value: auction.transaction_details },

                                    ].map((item, index) => (
                                        <View>
                                            <View key={index} className="flex-row justify-between items-center mb-2">
                                                <Text className="basis-[50%] text-custom-companytxt text-xs font-normal">{item.label}</Text>
                                                <Text className="basis-[5%] text-center">:</Text>
                                                <Text className="basis-[50%] text-custom-heading text-sm font-medium pl-2">{item.value}</Text>
                                            </View>
                                            {index === 3 && <View className="w-full h-[1px] bg-gray-300 my-2" />}
                                        </View>
                                    ))}


                                </View>


                            </Collapsible>
                        </View>
                    ))}
                    {!loading && auctionList.length === 0 && (
                        <View className="flex-1 justify-center items-center mt-12">
                            <Text className="text-sm text-custom-black font-semibold">No Data Found</Text>
                        </View>
                    )}
                </View>
            )}
        </View>

    );
}
export default MyChitPayment;