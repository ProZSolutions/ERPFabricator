import React, { useEffect, useState } from 'react'
import CustomFooter from '../../../component/Footer/CustomFooter';
import { Alert, Text, View } from 'react-native';
import CustomHeader from '../../../component/Header/CustomHeader';
import Spinner from '../../../component/Spinner/Spinner';
import Container from '../../../component/Container/Container';
import MemberPaymentDetailsCard from './MemberPaymentDetailsCard';
import handleError from '../../../component/ErrorHandler/ErrorHandler';
import { postData } from '../../../api/ApiService';

function MemberPaymentDetails({ route }) {
    const { item ,name} = route.params || {};
    const [dataList, setDataList] = useState('');
    const [loading, setLoading] = useState(false);


    const fetchTransactionDetails = async () => {
        setLoading(true);
        try {
            const response = await postData('member-chit-details', {
                cus_id: item?.cus_id,
                chit_id: item?.chit_id
            });
            if (response?.status === 'success') {
                setDataList(response);
            } else {
                setDataList('');
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
        fetchTransactionDetails()
    }, [item?.cus_id, item?.chit_id])

    return (
        <View className="flex-1 bg-white">
            <CustomHeader name="Collection Details" isBackIcon={true} />
            <Container paddingBottom={80} >
                {loading ? (
                    <Spinner visible={loading} textContent="Loading..." />
                ) : (
                    
                    <View className="px-0">
                    <View className="items-center justify-center">
                        <Text className="text-base text-blue-600 font-semibold text-center">{name}</Text>
                    </View>                 
                        {(dataList?.data?.length === 0 || (dataList?.payment?.length === 0 && dataList?.settlement?.length === 0)) && (
                            <View className="flex-1 justify-center items-center" style={{ height: 300 }}>
                                <Text className="text-sm text-custom-black font-semibold">
                                    No Data Found
                                </Text>
                            </View>
                        )}
                        {(dataList?.payment?.length > 0 || dataList?.settlement?.length > 0) && (
                            <MemberPaymentDetailsCard obj={dataList} />
                        )}
                    </View>
                )}

            </Container>
            <CustomFooter />
        </View>
    )
}
export default MemberPaymentDetails;