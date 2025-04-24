import React, { useEffect, useState } from 'react'
import { Alert, FlatList, Text, View } from 'react-native';
import CustomHeader from '../../component/Header/CustomHeader';
import Container from '../../component/Container/Container';
import CustomFooter from '../../component/Footer/CustomFooter';
import SearchInputBox from '../../component/SearchInputBox/SearchInputBox';
import PendingChitCard from './PendingChitCard';
import { postData } from '../../api/ApiService';
import handleError from '../../component/ErrorHandler/ErrorHandler';
import Spinner from '../../component/Spinner/Spinner';

function PendingList() {
    const [search, setSearch] = useState("");
    const [dataList, setDataList] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleInputSearchChange = (value) => {
        setSearch(value);
    };

    const fetchPendingList = async () => {
        setLoading(true);
        try {
            const response = await postData('pending-list', {
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
            fetchPendingList();
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [search])

    return (
        <View className="flex-1 bg-white">
            <CustomHeader name="Pending List" isBackIcon={true} />
            <SearchInputBox
                value={search}
                onChangeText={handleInputSearchChange}
            />
            <Container paddingBottom={80}>
                {/* {Array.from({ length: 20 }, (_, index) => (
                    <PendingChitCard key={index} />
                ))} */}
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
                                    <PendingChitCard item={item} />
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
export default PendingList;