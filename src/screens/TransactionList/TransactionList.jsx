import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../../component/Header/CustomHeader';
import SearchInputBox from '../../component/SearchInputBox/SearchInputBox';
import Container from '../../component/Container/Container';
import CustomFooter from '../../component/Footer/CustomFooter';
import CustomButton from '../../component/Button/CustomButton';
import TransactionCard from './TransactionCard';
import handleError from '../../component/ErrorHandler/ErrorHandler';
import Spinner from '../../component/Spinner/Spinner';
import { postData } from '../../api/ApiService';

function TransactionList() {
    const [search, setSearch] = useState('');
    const [dataList, setDataList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeBtn, setActiveBtn] = useState('collection');

    const handleInputSearchChange = (value) => setSearch(value);

    const fetchTransactionList = async (endpoint) => {
        console.log("transation"," seach "+search+" end point "+endpoint);

       
        setLoading(true);
        try {
            const response = await postData(endpoint, {
                chit_id: search
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
        const handler = setTimeout(() => {
            const endpoint =
                activeBtn === 'collection'
                    ? '/transaction-collection-list'
                    : '/transaction-settlement-list';
            fetchTransactionList(endpoint);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [search, activeBtn])

    return (
        <View className="flex-1 bg-white">
            <CustomHeader   name={activeBtn === 'collection' ? 'Collection List' : 'Settlement List'}
              isBackIcon={true} />
            <SearchInputBox value={search} onChangeText={handleInputSearchChange} />

            <View className="flex-row justify-center mt-4">
                {['collection', 'settlement'].map((type) => (
                    <CustomButton
                        key={type}
                        containerClass="px-5 mx-2.5"
                        title={type.charAt(0).toUpperCase() + type.slice(1)}
                        isActive={activeBtn === type}
                        onPress={() => setActiveBtn(type)}
                        gapClass={activeBtn === type ? '' : 'text-custom-hyperlink'}
                    />
                ))}
            </View>

            <Container paddingBottom={80} containerClass="mt-1">
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
                                    <TransactionCard activeItem={activeBtn} item={item} />
                                )}
                            />
                        )}
                    </View>
                )}
            </Container>

            <CustomFooter
                isAddCollection={activeBtn === "collection" ? true : false}
                isAddSettlement={activeBtn === "settlement" ? true : false}
               />       
               
         </View>
    );
}

export default TransactionList;
