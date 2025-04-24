import React, { useEffect, useState } from 'react'
import { Alert, FlatList, Text, View } from 'react-native';
import CustomHeader from '../../component/Header/CustomHeader';
import SearchInputBox from '../../component/SearchInputBox/SearchInputBox';
import CustomFooter from '../../component/Footer/CustomFooter';
import Container from '../../component/Container/Container';
import TransactionDetailsCard from './TransactionDetailsCard';
import { postData } from '../../api/ApiService';
import handleError from '../../component/ErrorHandler/ErrorHandler';
import { capitalizeFirstLetter } from '../../utils';
import Spinner from '../../component/Spinner/Spinner';

function TransactionDetails({ route }) {
    const { item } = route.params || {};
    
    const [dataList, setDataList] = useState([]);
    const [loading, setLoading] = useState(false);

    // const [search, setSearch] = useState("");
    // const handleInputSearchChange = (value) => {
    //     setSearch(value);
    // };

    
    const fetchTransactionDetails = async () => {
        setLoading(true);
        try {
            const response = await postData('transaction-collection-details', {
                credit_id: item?.credit_id
            });
            if (response?.status === 'success') {
                setDataList(response.data);
            } else {
                setDataList([]);
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
    }, [item?.credit_id])
   
    return (
        <View className="flex-1 bg-white">
            <CustomHeader name="Collection Details" isBackIcon={true} />
            {/* <SearchInputBox
                value={search}
                onChangeText={handleInputSearchChange}
            /> */}
            <View className="mt-2 px-4">
                <Text className="text-custom-heading text-base font-medium pb-1">{capitalizeFirstLetter(item.name)}</Text>
                <Text className="text-custom-hyperlink text-xs font-light">{item.contact}</Text>
            </View>
            <Container paddingBottom={80} >
               
                 {loading ? (
                    <Spinner visible={loading} textContent="Loading..." />
                ) : (
                    <View className="px-0">
                        {dataList.length === 0 ? (
                            <View className="flex-1 justify-center items-center" style={{ height: 300 }}>
                                <Text className="text-sm text-custom-black font-semibold">
                                    No Data Found
                                </Text>
                            </View>
                        ) : (
                            <FlatList
                                data={dataList}
                                keyExtractor={(_, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <TransactionDetailsCard item={item} />
                                )}
                            />
                        )}
                    </View>
                )}
            </Container>
            <CustomFooter />
        </View>
    )
}
export default TransactionDetails;