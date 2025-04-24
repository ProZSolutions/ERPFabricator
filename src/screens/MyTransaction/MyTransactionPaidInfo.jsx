import React, { useEffect, useState } from 'react'
import { Alert, FlatList, Text, View } from 'react-native';
import handleError from '../../component/ErrorHandler/ErrorHandler';
import { postData } from '../../api/ApiService';
import Spinner from '../../component/Spinner/Spinner';
import MyTransactionCard from './MyTransactionCard';

function MyTransactionPaidInfo({ search }) {
    const [paymentList, setPaymentList] = useState([]);
    const [loading, setLoading] = useState(false);
    const fetchPaymentList = async () => {
        setLoading(true);
        try {
            const response = await postData('/my-invest-transaction-payment', {
                chit_id: search
            });
            if (response && response.status === 'success') {
                setPaymentList(response.data);
            } else {
                setPaymentList([]);
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
        const handler = setTimeout(() => {
            fetchPaymentList();
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [search])

    return (
        <>
            {loading ? (
                <Spinner visible={loading} textContent="Loading..." />
            ) : (
                <FlatList
                    data={paymentList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <MyTransactionCard item={item} />
                    )}
                />
            )}
            {!loading && paymentList.length === 0 && (
                <View className="flex-1 justify-center items-center mt-12">
                    <Text className="text-sm text-custom-black font-semibold">No Data Found</Text>
                </View>
            )}


        </>
    )
}
export default MyTransactionPaidInfo;