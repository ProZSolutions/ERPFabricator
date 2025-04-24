import React, { useEffect, useState } from 'react'
import CustomHeader from '../../component/Header/CustomHeader';
import Container from '../../component/Container/Container';
import CustomFooter from '../../component/Footer/CustomFooter';
import { Alert, FlatList, Text, View } from 'react-native';
import FilterIcon from '../../assets/svg-component/FilterIcon';
import { styled } from 'nativewind';
import PendingDetailsCard from './PendingDetailsCard';
import { postData } from '../../api/ApiService';
import handleError from '../../component/ErrorHandler/ErrorHandler';
import Spinner from '../../component/Spinner/Spinner';
import { chitNameFormat, formatAmount } from '../../utils';
const StyledView = styled(View);
const StyledText = styled(Text);

function PendingDetails({ route }) {
    const { item } = route.params || {};
    const [dataList, setDataList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [customerData, setCustomerData] = useState([]);

    const fetchPendingDetails = async () => {
        setLoading(true);
        try {
            const response = await postData('pending-details', {
                chit_id: item.chit_id,
                chit_month: item.chit_month
            });
            if (response?.status === 'success') {
                setDataList(response.data);
                setCustomerData(response?.customer_data);
            } else {
                setDataList([]);
                setCustomerData([])
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

    useEffect(() => {
        fetchPendingDetails();
    }, [item?.chit_id, item?.chit_month]);

    return (
        <StyledView className="flex-1 bg-white">
            <CustomHeader name="Pending Details" isBackIcon={true} />


            <StyledView className="flex-row justify-between items-center px-2 pb-2" style={{ marginTop: -10 }}>
                <StyledView className="flex-row px-2">
                    <StyledText className="text-custom-heading text-xl font-semibold">Pending Collection:</StyledText>
                    <StyledText className="text-custom-red text-xl font-semibold"> {dataList?.[0]?.pending_count} </StyledText>
                    <StyledText className="text-custom-heading text-xl font-semibold">/{dataList?.[0]?.total_count}</StyledText>
                </StyledView>
                <StyledView className='px-2'>
                    <FilterIcon />
                </StyledView>
            </StyledView>
            <StyledView className="px-4">
                <StyledView className="w-full h-[1px] bg-gray-200" />
            </StyledView>
            <StyledView className="flex-row justify-between mx-4 mt-2">
                <StyledView className="pb-1">
                    <StyledText className="text-custom-heading text-sm font-medium">
                        {chitNameFormat(dataList?.[0]?.chit_name, dataList?.[0]?.chit_id)}
                    </StyledText>
                </StyledView>

                <StyledView className="items-end">
                    <StyledText className="text-custom-red text-sm font-medium">
                        {formatAmount(dataList?.[0]?.pending_amount)}
                    </StyledText>
                </StyledView>
            </StyledView>

            <StyledView className="flex-row justify-between mx-4">
                <StyledView>
                    <StyledText className="text-custom-companytxt text-xs font-normal">
                        Auction Date :
                        <StyledText className="text-custom-heading text-sm font-normal">
                            {" "}{dataList?.[0]?.auction_date}
                        </StyledText>
                    </StyledText>
                </StyledView>

                <StyledView className="items-end">
                    <StyledText className="text-custom-hyperlink text-xs font-medium">
                        {dataList?.[0]?.chit_month}ᵗʰ Month
                    </StyledText>
                </StyledView>
            </StyledView>

            <Container paddingBottom={80}>
                {loading ? (
                    <Spinner visible={loading} textContent="Loading..." />
                ) : (
                    <View className="px-0">
                        {customerData.length === 0 ? (
                            <View className="flex-1 justify-center items-center" style={{ height: 300 }}>
                                <Text className="text-sm text-custom-black font-semibold">
                                    No Data Found
                                </Text>
                            </View>
                        ) : (
                            <FlatList
                                data={customerData}
                                keyExtractor={(_, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <PendingDetailsCard item={item} />
                                )}
                            />
                        )}
                    </View>
                )}
            </Container>
            <CustomFooter />
        </StyledView>
    )
}
export default PendingDetails;