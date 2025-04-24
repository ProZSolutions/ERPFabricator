import React, { useCallback, useEffect, useState } from 'react'
import { Alert, BackHandler, FlatList, Text, TouchableOpacity, View } from 'react-native'
import CustomHeader from '../../component/Header/CustomHeader';
import Container from '../../component/Container/Container';
import CustomFooter from '../../component/Footer/CustomFooter';
import handleError from '../../component/ErrorHandler/ErrorHandler';
import Spinner from '../../component/Spinner/Spinner';
import { postData } from '../../api/ApiService';
import { capitalizeFirstLetter, chitNameFormat, formatAmount } from '../../utils';
import CheckBox from '@react-native-community/checkbox';
import RightArrowIcon from '../../assets/svg-component/RightArrowIcon';
import CustomButton from '../../component/Button/CustomButton';
import LottIcon from '../../assets/svg-component/LottIcon';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

export default function AuctionConfirm({ route }) {
    const { confirmData } = route.params || {};
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isSelectAll, setIsSelectAll] = useState(false);
    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            const backAction = () => {
                return true;
            };

            const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                backAction
            );

            return () => backHandler.remove();
        }, [])
    );

    const handleSelectAll = () => {
        setIsSelectAll(!isSelectAll);
        if (!isSelectAll) {
            setSelectedItems(confirmData?.final_customer?.map((item) => item.id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelection = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter((item) => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    useEffect(() => {
        if (selectedItems.length === confirmData?.final_customer.length && isSelectAll === false) {
            setIsSelectAll(true);
        } else if (selectedItems.length !== confirmData?.final_customer.length && isSelectAll) {
            setIsSelectAll(false);
        }
    }, [selectedItems])

    const submitLottHandler = async () => {
        // Filter data by selected ID
        let filteredData = confirmData?.final_customer?.filter(item => selectedItems.includes(item.id));
       
        // Extract unique amounts
        let amounts = [...new Set(filteredData.map(item => item.amount))];
      
        // Extract unique IDs
        let ids = [...new Set(filteredData.map(item => item.id))];
      
        const req = {
            chit_id: confirmData?.data?.chit_id,
            chit_month: confirmData?.data?.no_month,
            cus_id: ids,
            amount: amounts,
        };
        console.log("request:", req);

        setLoading(true);
        try {
            const response = await postData('/auction-lott-complete', req);
            if (response?.status === 'success') {
                const params = {
                    chit_id:confirmData?.data?.chit_id,
                    date:confirmData?.data?.date,
                    customerName: response?.data?.name || '',
                    month:confirmData?.data?.no_month,
                    cumulative_amount:confirmData?.data?.cumulative_amount
                };
                console.log("params:", params);

                navigation.navigate("AuctionSummary", params)
            } else {
                Alert.alert('Error', 'An unexpected response was received.');
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.error || 'An error occurred.';
            if (error?.response?.data?.status === 'error') {
                Alert.alert('Error', errorMessage);
            } else {
                await handleError(error, false);
            }
        } finally {
            setLoading(false);
        }
    }

    const handleConfirm = async () => {
        if (!selectedItems.length) {
            return Alert.alert('Selection Required', 'Please select at least one member.');
        }

        const findCusId = confirmData?.final_customer.find(item => item.id === selectedItems[0]);

        if (!findCusId) {
            return Alert.alert('Error', 'Selected member not found.');
        }

        const req = {
            chit_id: confirmData?.data?.chit_id,
            chit_month: confirmData?.data?.no_month,
            cus_id: findCusId.id,
            amount: findCusId.amount,
        };


        setLoading(true);
        try {
            const response = await postData('/auction-complete', req);
            if (response?.status === 'success') {
                const params = {
                    chit_id:confirmData?.data?.chit_id,
                    chit_name:confirmData?.data?.chit_name,
                    date:confirmData?.data?.date,
                    customerName: findCusId.name || '',
                    month:confirmData?.data?.no_month,
                    cumulative_amount:confirmData?.data?.cumulative_amount
                };
                navigation.navigate("AuctionSummary", params)
            } else {
                Alert.alert('Error', 'An unexpected response was received.');
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.error || 'An error occurred.';
            if (error?.response?.data?.status === 'error') {
                Alert.alert('Error', errorMessage);
            } else {
                await handleError(error, false);
            }
        } finally {
            setLoading(false);
        }
    };


    const renderItem = ({ item }) => (
        <View className="flex-row justify-between items-center mb-2">

            <CheckBox
                value={selectedItems.includes(item.id)}
                onValueChange={() => handleSelection(item.id)}
                tintColors={{ true: '#285FE7', false: 'rgb(209 213 219)' }}
            />
            <Text className="flex-1 text-custom-companytxt text-sm font-normal">{capitalizeFirstLetter(item.name)}</Text>
            <Text className="text-gray-800 text-sm font-bold">{formatAmount(item.amount)}</Text>
        </View>
    );

    return (
        <View className="flex-1 bg-white">
            <CustomHeader name={`${chitNameFormat(confirmData?.data?.chit_name, confirmData?.data?.chit_id) } Auction`} isBackIcon={false} />
            <Container paddingBottom={80} marginTop={-10}>
                <Spinner visible={loading} textContent="Loading..." />
                <View className="bg-white rounded-lg shadow-md px-2 border border-gray-200">
                    <View className="flex-row justify-between items-center mb-2 mt-2 px-2">
                        <Text className="text-xs text-custom-companytxt font-normal w-[34%]">
                            {confirmData?.data?.date}
                        </Text>
                        <View className="bg-custom-lightblue rounded-full px-4 py-2 w-[33%] items-center">
                            <Text className="text-custom-hyperlink text-xs font-medium">
                                {confirmData?.data?.month || confirmData?.data?.no_month || 0}ᵗʰ  Month
                            </Text>
                        </View>
                        <Text className="text-custom-heading text-sm font-medium text-right w-[33%]">
                            {formatAmount(confirmData?.data?.cumulative_amount)}
                        </Text>
                    </View>
                    <View className="w-full h-[1px] bg-gray-300 my-2 mx-2 mb-4" />
                    <View className="flex-row justify-between mb-1">
                        <Text className="text-gray-500">Auction Date</Text>
                        <Text className="text-gray-500">Starts From</Text>
                    </View>
                    <View className="flex-row justify-between mb-1">
                        <Text className="text-custom-heading font-bold">{confirmData?.data?.date}</Text>
                        <Text className="text-custom-red font-bold">{formatAmount(confirmData?.data?.starts_from)}</Text>
                    </View>
                    <View className="w-full h-[1px] bg-gray-300 my-2" />

                    <View>
                        <FlatList
                            data={confirmData?.final_customer}
                            keyExtractor={(item) => item.id.toString()}
                            ListHeaderComponent={
                                <View className="flex-row justify-between items-center my-2 p-0">

                                    <CheckBox
                                        value={isSelectAll}
                                        onValueChange={() => handleSelectAll()}
                                        tintColors={{ true: '#285FE7', false: 'rgb(209 213 219)' }}
                                    />
                                    <Text className="flex-1 text-custom-companytxt text-sm font-normal">Select All</Text>
                                </View>
                            }
                            renderItem={renderItem}
                        />
                        <View className="mb-4 ml-auto">
                            {selectedItems.length > 1 ? (<CustomButton
                                isActive={false}
                                isLeftIcon={true}
                                 containerClass="px-5 bg-blue-100"
                                 icon={<LottIcon color="#FFFFFF"/>}
                                title="Lott"
                                onPress={submitLottHandler}
                                gapClass='font-bold text-primary pl-2'
                            />
                            ) : (
                                <CustomButton
                                    containerClass="px-5"
                                     title=" Confirm "
                                    onPress={handleConfirm}
                                />

                            )}


                        </View>
                    </View>
                </View>
            </Container>
            <CustomFooter />

        </View>
    )
}
