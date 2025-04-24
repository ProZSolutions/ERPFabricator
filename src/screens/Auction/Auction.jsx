import React, { useEffect, useState } from 'react';
import { Alert, Text, View, Animated, TouchableOpacity } from 'react-native';
import CustomHeader from '../../component/Header/CustomHeader';
import Container from '../../component/Container/Container';
import CustomFooter from '../../component/Footer/CustomFooter';
import { postData } from '../../api/ApiService';
import handleError from '../../component/ErrorHandler/ErrorHandler';
import Spinner from '../../component/Spinner/Spinner';
import PlayWithRoundedIcon from '../../assets/svg-component/PlayWithRoundedIcon';
import CustomButton from '../../component/Button/CustomButton';
import RightArrowIcon from '../../assets/svg-component/RightArrowIcon';
import TextInputBox from '../../component/TextInputBox/TextInputBox';
import TimerIcon from '../../assets/svg-component/TimerIcon';
import DropdownPickerBox from '../../component/DropdownBox/DropdownPickerBox';
import { capitalizeFirstLetter, chitNameFormat, formatAmount } from '../../utils';
import { useNavigation } from '@react-navigation/native';
import PauseWithRoundedIcon from '../../assets/svg-component/PauseWithRoundedIcon';
import TimerComponent from './TimerComponent';

const Auction = ({ route }) => {
    const { chit_id, chit_month, info } = route.params || {};
    const [selectMember, setSelectMember] = useState(null);
    const [memberOptions, setMemberOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState({
        auction_list: []
    });
    const [error, setError] = useState({});
    const navigation = useNavigation();
    const [auctionStatus, setAuctionStatus] = useState(null);
    const [startTimer, setStartTimer] = useState(null);
    const [ongoingTime, setOngoingTime] = useState(null)
    
    const fetchAuctionStatus = async () => {
        try {
             setLoading(true);
            const { data } = await postData("/auction-status", {
                chit_id: chit_id,
                chit_month: chit_month
            });
            if (data?.status_code === 1) {
                setAuctionStatus(null);
            } else if (data?.status_code === 2) {
                setAuctionStatus("started");
                liveAuction();
                onClickStartHandler(false);
            } else if (data?.status_code === 3) {
                setAuctionStatus("paused");
                liveAuction();
                onClickStartHandler(false);
            } else if (data?.status_code === 3) {
                onClickStartHandler();
                setAuctionStatus("closed");
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
    }


    useEffect(() => {
        fetchAuctionStatus();
    }, [])

    useEffect(() => {
        if (auctionStatus === 'started' || auctionStatus === 'restarted') {
          liveAuction(); // Initial call
          const intervalId = setInterval(() => {
            liveAuction();
          }, 5000);
      
          return () => {
            clearInterval(intervalId); // Clear the interval on cleanup
          };
        }
      }, [auctionStatus]);
    


    const getSelectedMemberText = () => {
        const member = memberOptions.find((item) => item.value === selectMember);
        return member?.label || 'Select';
    };


    const validateForm = () => {
        const errors = {};
        if (!selectMember) errors.selectMember = 'Select a Member';
        setError(errors);
        return Object.keys(errors).length === 0;
    };

    const submitAuction = async () => {
        if (!['started', 'restarted'].includes(auctionStatus)) {
            Alert.alert(`Auction is ${auctionStatus}`)
            return false;
        }

        if (validateForm()) {
            const req = {
                chit_id: chit_id,
                chit_month: chit_month,
                cus_id: selectMember?.toString(),
            };
            setLoading(true);
            try {
                const response = await postData('/auction-request-agent', req);
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
        }
    };

    const liveAuction = async () => {
        try {
            const response = await postData('/live-auction-socket', {
                chit_id: chit_id,
                chit_month: chit_month,
            });
            if (response?.status === 'success') {
                setState((prevState)=>({
                    ...prevState,
                    auction_list: [...response.auction_list]
                }))
                setOngoingTime(response?.ongoing_time)
            }
        } catch (error) {
            if (error?.response?.data?.status === 'error') {
                Alert.alert('Error', error?.response?.data?.error || 'An error occurred.');
            } else {
                await handleError(error, false);
            }
        }
    }

    const confirmCloseAuction = async () => {
        const req = {
            chit_id: chit_id,
            chit_month: chit_month,
        };
        setLoading(true);
        try {
            const response = await postData('/close-auction', req);
            if (response?.status === 'success') {
                navigation.navigate("AuctionConfirm", { confirmData: response })
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
    }

    const closeActionHandler = async () => {
        if (auctionStatus === null) {
            Alert.alert("Auction not yet started");
            return false;
        }
        Alert.alert(
            'Confirmation', // Title of the alert
            'Are you sure you want to close the Auction?', // Message
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel', // Preferred styling for cancel action
                },
                {
                    text: 'OK',
                    onPress: confirmCloseAuction,
                },
            ],
            { cancelable: false } // Prevent alert from being dismissed by tapping outside
        );

    }

    const onClickStartHandler = async (update = true) => {
        setLoading(true);
        try {
            const response = await postData('/start-auction', {
                chit_id: chit_id,
                chit_month: chit_month,
            });
            if (response?.status === 'success' && Object.keys(response?.data).length > 0) {
                if (update) {
                    setAuctionStatus(response?.auction_status)
                }
                setState(response);
                setStartTimer(response?.start_timer);
                const options = response?.customer_dropdown.map((item) => ({
                    ...item,
                    label: item.name,
                    value: item.cus_id,
                }));
                setMemberOptions(options);
            } else {
                setState({
                    auction_list: []
                });
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
    }

    const onClickPassHandler = async () => {
        setLoading(true);
        try {
            const response = await postData('/pause-auction', {
                chit_id: chit_id,
                chit_month: chit_month,
            });
            if (response?.status === 'success') {
                setAuctionStatus(response?.auction_status)
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

    const onClickResumeHandler = async () => {
        setLoading(true);
        try {
            const response = await postData('/restart-auction', {
                chit_id: chit_id,
                chit_month: chit_month,
            });
            if (response?.status === 'success') {
                setAuctionStatus(response?.auction_status)
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
    const amt = state?.auction_list?.[0]?.amount || state?.data?.start_auction_amount || 0;
    return (
        <View className="flex-1 bg-white">
            <CustomHeader name={`${chitNameFormat(info.chit_name, info.chit_id)} Auction`} isBackIcon />
            <Container paddingBottom={80}>

                <Spinner visible={loading} textContent="Loading..." />

                <View>
                    <View className="flex-row justify-between mb-4">
                        {auctionStatus === null && (
                            <TouchableOpacity onPress={onClickStartHandler}>
                                <View className="flex-row items-center space-x-1">
                                    <PlayWithRoundedIcon />
                                    <Text className="text-custom-heading text-sm font-medium">Start</Text>
                                </View>
                            </TouchableOpacity>
                        )}


                        {(auctionStatus === 'started' || auctionStatus === 'restarted') && (
                            <TouchableOpacity onPress={onClickPassHandler}>
                                <View className="flex-row items-center space-x-1">
                                    <PauseWithRoundedIcon />
                                    <Text className="text-custom-heading text-sm font-medium">Pause</Text>
                                </View>
                            </TouchableOpacity>
                        )}

                        {auctionStatus === 'paused' && (
                            <TouchableOpacity onPress={onClickResumeHandler}>
                                <View className="flex-row items-center space-x-1">
                                    <PlayWithRoundedIcon />
                                    <Text className="text-custom-heading text-sm font-medium">Restart</Text>
                                </View>
                            </TouchableOpacity>
                        )}

                        <CustomButton
                            containerClass="px-5"
                             title=" Close "
                            onPress={closeActionHandler}
                        />
                    </View>
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-xs text-custom-companytxt font-normal w-[40%]">
                            {info?.date}
                        </Text>
                        <View className="bg-custom-lightblue rounded-full px-4 py-2 w-[30%] items-center">
                            <Text className="text-custom-hyperlink text-xs font-medium">
                                {info?.no_month || 0}ᵗʰ Month
                            </Text>
                        </View>
                        <Text className="text-custom-heading text-sm font-medium text-right w-[30%]">
                            {formatAmount(info.cumulative_amount)}
                        </Text>
                    </View>
                    <View className="w-full h-[1px] bg-gray-300 my-2 mb-4" />
                    {auctionStatus != null && (
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
                                    <TimerComponent startTimer={startTimer} ongoingTime={ongoingTime} />
                                </View>
                            </View>
                            <View className="mb-4">
                                <DropdownPickerBox
                                    required
                                    label="Select Member"
                                    options={memberOptions}
                                    onValueChange={setSelectMember}
                                    placeholder={getSelectedMemberText()}
                                    value={selectMember}
                                    mb="mb-0"
                                />
                                {error.selectMember && (
                                    <View className="flex-row w-[100%]">
                                        <Text className="text-red-500 font-normal text-[12px]">
                                            {error.selectMember}
                                        </Text>
                                    </View>
                                )}
                            </View>
                            <View className="w-full">
                                <View className="ml-auto">
                                    <CustomButton
                                        containerClass="px-5"
                                         title=" Submit "
                                        onPress={submitAuction}
                                    />
                                </View>
                            </View>

                            <View className="bg-white rounded-lg shadow-md p-2 border border-gray-200 mt-4">

                            <View className="flex-row justify-between mb-1">
                                {/* Left aligned label */}
                                <Text className="text-gray-500">Starts From</Text>

                                {/* Right aligned amount */}
                                <Text className="text-custom-red font-bold">
                                    {formatAmount(state?.data?.default_auction_amount)}
                                </Text>
                                </View>

                                
                                <View className="w-full h-[1px] bg-gray-300 my-2" />
                                {state?.auction_list?.length === 0 && (
                                    <View className="py-10">
                                        <Text className="text-custom-red text-center text-sm font-bold">No Data Found</Text>
                                    </View>
                                )}
                                {state?.auction_list?.map((item, index) => (
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
                    )}

                </View>

            </Container>
            <CustomFooter />
        </View>
    );
};

export default Auction;
