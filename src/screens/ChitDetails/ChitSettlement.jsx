import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Text, View } from 'react-native';
import ChitSettlementItem from './ChitSettlementItem';
import handleError from '../../component/ErrorHandler/ErrorHandler';
import Spinner from '../../component/Spinner/Spinner';
import { postData } from '../../api/ApiService';
import ModalPopup from '../../component/ModalPopup/ModalPopup';





function ChitSettlement({ chitId, status }) {
    const [settlementList, setSettlementList] = useState([]);
    const [previousCollapses, setPreviousCollapses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [base64Image, setBase64Image] = useState("");
    const [expandedIndex, setExpandedIndex] = useState(null);  
    

    const toggleItem = (index) => {
        setExpandedIndex(prev => (prev === index ? null : index));
        setPreviousCollapses(prev => prev.map((collapsed, i) => (i === index ? !collapsed : collapsed)));
    };


    const fetchSettlement = async () => {
        setLoading(true);
        try {
            const response = await postData('/settlement-list', { chit_id: chitId });
            if (response && response.status === 'success') {
                setSettlementList(response.settlement_data);
                setPreviousCollapses(new Array(response.settlement_data.length).fill(true));
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
        if (status.toLowerCase() !== 'new') {
            fetchSettlement();
        }
    }, [chitId]);

    return (
        <View className="my-4">
            {loading ? (
                <Spinner visible={loading} textContent="Loading..." />
            ) : status.toLowerCase() !== 'new' ? (
                <FlatList
                    data={settlementList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <ChitSettlementItem
                            index={index}
                            item={item}
                            isExpanded={expandedIndex === index} 
                            onPress={(idx) => toggleItem(idx)} 
                                                       // isExpanded={previousCollapses[index]}
                             previewModal={(item) => {
                                setBase64Image(`data:image/png;base64,${item}`)
                                setModalVisible(true)

                            }}
                        />
                    )}
                />
            ) : (
                <View className="pt-4 bg-white flex-row justify-center items-center h-[60%]">
                    <Text className="text-lg font-medium text-center text-custom-red">Yet to be started...</Text>
                </View>
            )}

            {!loading && settlementList.length === 0 && status.toLowerCase() !== 'new' && (
                <View className="flex-1 justify-center items-center mt-10">
                    <Text className="text-sm text-custom-black font-semibold">
                        No Data Found
                    </Text>
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

export default ChitSettlement;
