import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import Container from '../../component/Container/Container';
import CustomFooter from '../../component/Footer/CustomFooter';
import SearchInputBox from '../../component/SearchInputBox/SearchInputBox';
import MyAuctionCard from './MyAuctionCard';
import { postData } from '../../api/ApiService';
import handleError from '../../component/ErrorHandler/ErrorHandler';
import Spinner from '../../component/Spinner/Spinner';
import MyAuctionJointCard from './MyAuctionJointCard';
import MyAuctionClosedCard from './MyAuctionClosedCard';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import CustomHeader from '../../component/Header/CustomHeader';

function MyAuction() {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState(1);
    const [chits, setChits] = useState([]);
    const [loading, setLoading] = useState(false);

    const options = [
        { id: 1, label: "Yet to Start", endpoint: "/member-auction-yet" },
        { id: 2, label: "Join Auction", endpoint: "/member-auction-join-list" },
        { id: 3, label: "Closed", endpoint: "/auction-settlement-member-list" }
    ];

    const handleInputSearchChange = (value) => {
        setSearch(value);
    };

    const fetchChitList = async (isLoadingStatus = true) => {
        if (isLoadingStatus) {
            setLoading(true);
        }
        try {
            const selectedOption = options.find(option => option.id === selected);
             const response = await postData(selectedOption.endpoint, { chit_id: search });

            if (response && response.status === 'success') {
                setChits(response.data);
            } else {
                setChits([]);
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



    useFocusEffect(
        React.useCallback(() => {
            let intervalId = null;
            const debounceFetch = setTimeout(() => {
                fetchChitList();
            }, 600);
            if (intervalId) {
                clearInterval(intervalId);
            }
            if (selected === 2) {
                intervalId = setInterval(() => {
                    fetchChitList(false);
                }, 5000);
            }
            return () => {
                clearTimeout(debounceFetch);
                if (intervalId) {
                    clearInterval(intervalId);
                }
            };

        }, [selected, search])
    );

    useEffect(() => {
        fetchChitList();
        setChits([]);
    }, [selected])

    const updateCancelHandle = async (item) => {
        setLoading(true);
        try {
             const response = await postData('/auction-cancel-request-member', {
                chit_id: item.chit_id,
                chit_month: item?.chit_month
            });

            if (response && response.status === 'success') {
                fetchChitList();
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

    return (
        <View className="flex-1 bg-white">
            <CustomHeader name="Auction List" isBackIcon={true} />
            <SearchInputBox
                value={search}
                onChangeText={handleInputSearchChange}
            />

            <View className="flex-row justify-around mt-4 bg-white p-2 rounded-full shadow">
                {options.map((option) => (
                    <TouchableOpacity
                        key={option.id}
                        className={`flex-1 items-center justify-center py-2 mx-1 rounded-full ${selected === option.id ? 'bg-custom-hyperlink' : 'bg-custom-lightblue'}`}
                        onPress={() => setSelected(option.id)}
                    >
                        <Text
                            className={`text-xs font-semibold ${selected === option.id ? 'text-white' : 'text-black'}`}
                        >
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {!loading && chits.length === 0 && (
                <View className="flex-1 justify-center items-center">
                    <Text className="text-sm text-custom-black font-semibold">No Data Found</Text>
                </View>
            )}

            <Container paddingBottom={80}>
                {loading ? (
                    <Spinner visible={loading} textContent="Loading..." />
                ) : (
                    <FlatList
                        data={chits}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => {
                            if (selected === 1) {
                                return <MyAuctionCard item={item} updateCancelHandle={updateCancelHandle} />;
                            } else if (selected === 2) {
                                return <MyAuctionJointCard item={item} />;
                            } else {
                                return <MyAuctionClosedCard item={item} />;
                            }
                        }}
                    />
                )}
            </Container>

            <CustomFooter />
        </View>
    );
}

export default MyAuction;
