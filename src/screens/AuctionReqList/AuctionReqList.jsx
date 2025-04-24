import React, { useEffect, useState } from 'react'
import { Alert, FlatList, Text, View } from 'react-native';
import CustomHeader from '../../component/Header/CustomHeader';
import Container from '../../component/Container/Container';
import CustomFooter from '../../component/Footer/CustomFooter';
import { postData } from '../../api/ApiService';
import handleError from '../../component/ErrorHandler/ErrorHandler';
import Spinner from '../../component/Spinner/Spinner';
import AuctionListMember from './AuctionListMember';

function AuctionReqList( { route }) {
    const { chitId, auctionMonth } = route.params || {};
    const [loading, setLoading] = useState(false);
    const [memberList, setMemberList] = useState([]);
    const [memberData, setMemberData] = useState(null);

    const fetchChitReqMember = async () => {
        setLoading(true);
        try {
            const response = await postData('/auction-request-collection-list', {
                chit_no: chitId,
                chit_month: auctionMonth
            });
            if (response?.status === 'success') {
                setMemberList(response?.member_data || []);
                setMemberData(response?.data || null)
            } else {
                setMemberList([]);
                setMemberData(null)
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.error || "An error occurred.";
            if (error?.response?.data?.status === "error") {
                Alert.alert("Error", errorMessage);
            } else {
                await handleError(error, false);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChitReqMember();
    }, [chitId, auctionMonth]);

    return (
        <View className="flex-1 bg-white">
            <CustomHeader name="Auction Request List" isBackIcon={true} />
            <Container paddingBottom={110}>
                <View style={{ marginTop: -15 }}>
                    {loading ? <Spinner visible={true} textContent="Loading..." /> : (
                        <View className="flex-row justify-between items-center mb-4">
                            <View className="w-1/2 flex-row items-center space-x-1">
                                <Text className="text-custom-companytxt text-xs font-normal">
                                    Auction Date:
                                </Text>
                                <Text className="text-custom-heading text-sm font-medium">{memberData?.auction_date}</Text>
                            </View>
                            <View className="w-1/2 flex-row items-center justify-end space-x-1">
                                <Text className="text-right text-custom-companytxt text-xs font-normal">
                                    Request Members:
                                </Text>
                                <Text className="text-custom-heading text-sm font-medium">{memberData?.request_count}</Text>
                            </View>
                        </View>
                    )}
                </View>
                {!loading && memberList.length > 0 && (
                    <FlatList
                        data={memberList}
                        keyExtractor={(item, index) => index?.toString()}
                        renderItem={({ item, index }) => (
                            <AuctionListMember
                                index={index}
                                name={item.name}
                                phone={item.contact}
                            />
                        )}
                    />
                )}

            </Container>
            <CustomFooter
                isAddCollection={true}
                chitId={chitId}
                auctionMonth={auctionMonth} />
        </View>
    )
}
export default AuctionReqList;