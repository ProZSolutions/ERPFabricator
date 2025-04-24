import React, { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import CustomHeader from '../../component/Header/CustomHeader';
import Container from '../../component/Container/Container';
import CustomFooter from '../../component/Footer/CustomFooter';
import { postData } from '../../api/ApiService';
import handleError from '../../component/ErrorHandler/ErrorHandler';
import Spinner from '../../component/Spinner/Spinner';
import CustomButton from '../../component/Button/CustomButton';
import RightArrowIcon from '../../assets/svg-component/RightArrowIcon';
import TextInputBox from '../../component/TextInputBox/TextInputBox';
import { capitalizeFirstLetter, chitNameFormat, formatAmount } from '../../utils';
import TimerComponent from '../Auction/TimerComponent';

function MyAuctionDetails({ route }) {
    const { chit_id, chit_month, info = null } = route.params || {};
    const [loading, setLoading] = useState(false);
    const [auctionData, setAuctionData] = useState('');
    const [startTimer, setStartTimer] = useState(null);


    const submitAuction = async () => {
        try {
            setLoading(true);
            const response = await postData('/auction-request-member', {
                chit_id: chit_id,
                chit_month: chit_month,
            });
             if (response?.status === 'success') {
                liveAuction();
            }
        } catch (error) {
            if (error?.response?.data?.status === 'error') {
                Alert.alert('Error', error?.response?.data?.error || 'An error occurred.');
            } else {
                await handleError(error, false);
            }
        } finally {
            setLoading(false);
        }
    };

    const liveAuction = async () => {
        try {
            const response = await postData('/start-member-auction', {
                chit_id: chit_id,
                chit_month: chit_month,
            });
            console.log("chit details "," chit id "+chit_id+" month "+chit_month);

            if (response?.status === 'success') {
                setAuctionData(response);
                setStartTimer(response?.data?.auction_start_time);
            }
        } catch (error) {
            if (error?.response?.data?.status === 'error') {
                Alert.alert('Error', error?.response?.data?.error || 'An error occurred.');
            } else {
                await handleError(error, false);
            }
        }
    }

    useEffect(() => {
        liveAuction()
        let intervalId = null;
        if (intervalId) {
            clearInterval(intervalId);
        }
        intervalId = setInterval(() => {
            liveAuction(false);
        }, 5000);
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, []);

    let amt = parseFloat(auctionData?.data?.auction_amount || 0);
    if(amt <= 0){
        amt = parseFloat(auctionData?.data?.start_auction_amount || 0);
    }

    return (
        <View className="flex-1 bg-white">
            <CustomHeader name={`${chitNameFormat(info?.chit_name, chit_id)} Auction`} isBackIcon />
            <Container paddingBottom={80}>

                <Spinner visible={loading} textContent="Loading..." />
                {auctionData?.data?.auction_amount && (
                    <View>

                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-xs text-custom-companytxt font-normal w-[40%]">
                                {auctionData?.data?.auction_date}
                            </Text>
                            <View className="bg-custom-lightblue rounded-full px-4 py-2 w-[30%] items-center">
                                <Text className="text-custom-hyperlink text-xs font-medium">
                                    {auctionData?.data?.month || 0}ᵗʰ Month
                                </Text>
                            </View>
                            <Text className="text-custom-heading text-sm font-medium text-right w-[30%]">
                                {formatAmount(auctionData?.data?.cumulative_amount)}
                            </Text>
                        </View>
                        <View className="w-full h-[1px] bg-gray-300 my-2 mb-4" />
                        <View>
                            <View className="flex-row justify-between items-center">
                                <View className="w-[60%]">
                                    <TextInputBox
                                        placeholder="Auction Amount"
                                        label="Auction Amount"
                                        value={`${formatAmount(amt)}`}
                                        editable={false}
                                    />
                                </View>
                                <View className="w-[40%]">
                                    <TimerComponent startTimer={startTimer} />
                                </View>
                            </View>
                            {auctionData?.data?.submit_button === 1 && (

                            <View className="w-full">
                                <View className="ml-auto">
                                    <CustomButton
                                        containerClass="px-5"
                                         title=" Submit "
                                        onPress={submitAuction}
                                    />
                                </View>
                            </View> 
                            )}

                            <View className="bg-white rounded-lg shadow-md p-2 border border-gray-200 mt-4">
                                <View className="flex-row justify-between mb-1">
                                    <Text className="text-gray-500">Starts From</Text>
                                    <Text className="text-custom-red font-bold">{formatAmount(auctionData?.data?.start_auction_amount)}</Text>
                                </View>
                                
                                <View className="w-full h-[1px] bg-gray-300 my-2" />
                                {auctionData?.auction_list?.length === 0 && (
                                    <View className="py-10">
                                        <Text className="text-custom-red text-center text-sm font-bold">No Data Found</Text>
                                    </View>
                                )}
                                {auctionData?.auction_list?.map((item, index) => (
                                    <View key={index} className="flex-row justify-between mb-2">
                                        <Text
                                            className={
                                                index === 0
                                                    ? 'text-sm font-medium text-custom-hyperlink'
                                                    : 'text-sm font-medium text-custom-heading'
                                            }
                                        >
                                            {capitalizeFirstLetter(item.name)}
                                        </Text>
                                        <Text
                                            className={
                                                index === 0
                                                    ? 'text-xs font-normal text-custom-red'
                                                    : 'text-xs font-normal text-custom-heading'
                                            }
                                        >
                                            {formatAmount(item.amount)}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>


                    </View>
                )}
                {auctionData?.data?.length === 0 && (
                    <View className="flex justify-center items-center h-[300]">
                        <Text className="text-custom-red text-lg font-semibold">Auction is closed !!!</Text>
                    </View>
                )}


            </Container>
            <CustomFooter />
        </View>
    );
}
export default MyAuctionDetails;