import React, { useEffect, useState } from 'react'
import { postData } from '../../api/ApiService';
import { Alert, FlatList, Text, View } from 'react-native';
import handleError from '../../component/ErrorHandler/ErrorHandler';
import Spinner from '../../component/Spinner/Spinner';
import ModalPopup from '../../component/ModalPopup/ModalPopup';
import MyChitSettlementItem from './MyChitSettlementItem';

function MyChitSettlement({ chitId }) {
    const [settlementList, setSettlementList] = useState([]);
    const [previousCollapses, setPreviousCollapses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [base64Image, setBase64Image] = useState("")

    const toggleItem = (index) => {
        setPreviousCollapses(prev => prev.map((collapsed, i) => (i === index ? !collapsed : collapsed)));
    };


    const fetchSettlement = async () => {
        setLoading(true);
        try {
            const response = await postData('/my-invest-chit-settlement', { chit_no: chitId });
            
            if (response && response.status === 'success') {
                setSettlementList(response.payment_data);
                setPreviousCollapses(new Array(response.payment_data.length).fill(true));
            } else {
                setSettlementList([]);
                setPreviousCollapses([]);
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
        fetchSettlement();
    }, [chitId]);

    return (
        <View className="my-4">
            {loading ? (
                <Spinner visible={loading} textContent="Loading..." />
            ) : (
                <FlatList
                    data={settlementList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <MyChitSettlementItem
                            index={index}
                            item={item}
                            isExpanded={previousCollapses[index]}
                            onPress={(index) => toggleItem(index)}
                            previewModal={(item) => {
                                setBase64Image(`data:image/png;base64,${item}`)
                                setModalVisible(true)
                            }}
                        />
                    )}
                />
            )}
            {!loading && settlementList.length === 0 && (
                <View className="flex-1 justify-center items-center mt-12">
                    <Text className="text-sm text-custom-black font-semibold">No Data Found</Text>
                </View>
            )}
            {modalVisible && (
                <ModalPopup
                    base64Image={base64Image}
                    close={() => setModalVisible(false)}
                />
            )}

        </View>
    );
}
export default MyChitSettlement;