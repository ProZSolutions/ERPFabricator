
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
import SettlementDetailsCard from './SettlementDetailsCard';
import ModalPopup from '../../component/ModalPopup/ModalPopup';

function SettlementDetails({ route }) {
    const { item } = route.params || {};
    const [dataList, setDataList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [base64Image, setBase64Image] = useState("")

    // const [search, setSearch] = useState("");
    // const handleInputSearchChange = (value) => {
    //     setSearch(value);
    // };


    const fetchTransactionDetails = async () => {
        setLoading(true);
        try {
            const response = await postData('transaction-settlement-details', {
                debit_id: item?.debit_id
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
    }, [item?.debit_id])

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
                                    <SettlementDetailsCard
                                        item={item}
                                        previewModal={(item) => {
                                            setBase64Image(`data:image/png;base64,${item}`)
                                            setModalVisible(true)
                                        }}
                                    />
                                )}

                            />
                        )}
                    </View>
                )}
            </Container>
            {modalVisible && (
                <ModalPopup
                    base64Image={base64Image}
                    close={() => setModalVisible(false)}
                />
            )}

            <CustomFooter />
        </View>
    )
}
export default SettlementDetails;