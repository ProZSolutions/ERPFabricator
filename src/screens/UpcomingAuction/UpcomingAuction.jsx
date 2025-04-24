import React, { useEffect, useState } from 'react'
import CustomHeader from '../../component/Header/CustomHeader';
import { Alert, Text, TouchableOpacity, View, FlatList } from 'react-native';
import Container from '../../component/Container/Container';
import CustomFooter from '../../component/Footer/CustomFooter';
import SearchInputBox from '../../component/SearchInputBox/SearchInputBox';
import UpcomingAuctionCard from './UpcomingAuctionCard';
import { postData } from '../../api/ApiService';
import handleError from '../../component/ErrorHandler/ErrorHandler';
import Spinner from '../../component/Spinner/Spinner';
import { useNavigation } from '@react-navigation/native';

function UpcomingAuction() {
    const [search, setSearch] = useState("");
    const options = ["Yet to Start", "In Progress", "Closed"];
    const [selected, setSelected] = useState("Yet to Start");
    const [loading, setLoading] = useState(false);
    const [chits, setChits] = useState([]);
    const navigation = useNavigation();
    const [loadingChitInfo, setLoadingChitInfo] = useState(false);
    const fetchChitList = async (isLoadingStatus = true) => {
        if (isLoadingStatus) {
            setLoading(true);
        }

        try {
            const removeSpaceTxt = selected.replace(/\s+/g, "");
            const response = await postData('/auction-list', {
                type: removeSpaceTxt.toLowerCase(),
                chit_id: search
            });
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



    useEffect(() => {
        let intervalId = null;
        const handler = setTimeout(() => {
            fetchChitList(false);
        }, 500);


        if (intervalId) {
            clearInterval(intervalId);
        }

        if (selected === 'In Progress') {
            intervalId = setInterval(() => {
                fetchChitList(false);
            }, 5000);
        }

        return () => {
            clearTimeout(handler);
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [selected, search]);

    useEffect(()=>{
        fetchChitList();
        setChits([]);
    }, [selected])

    const handleInputSearchChange = (value) => {
        setSearch(value);
    };


    const goToChitDetailsPage = async (val) => {

        setLoadingChitInfo(true);
        try {
            const response = await postData('/live-chit-list', {
                type: "all",
                chit_id: val?.chit_id
            });
            if (response && response.status === 'success') {
                navigation.navigate("ChitDetails", { item: response?.data?.[0] })
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
            setLoadingChitInfo(false);
        }
    }

    const gotoAuctionSummary = async (val) => {
        navigation.navigate("MyAuctionSummary", {auctionId:val.id, chitId:val.chit_id})
    }



    return (
        <View className="flex-1 bg-white">
            <CustomHeader name={`Auction List`} isBackIcon={true} />
            <SearchInputBox
                value={search}
                onChangeText={handleInputSearchChange}
            />
            <View className="flex-row justify-around mt-4 bg-white p-2 rounded-full shadow">
                {options.map((option) => (
                    <TouchableOpacity
                        key={option}
                        className={`flex-1 items-center justify-center py-2 mx-1 rounded-full ${selected === option ? 'bg-custom-hyperlink' : 'bg-custom-lightblue'
                            }`}
                        onPress={() => setSelected(option)}
                    >
                        <Text
                            className={`text-xs font-semibold ${selected === option ? 'text-white' : 'text-black'
                                }`}
                        >
                            {option}
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
                <Spinner visible={loadingChitInfo} textContent="Loading..." />
                {loading ? (
                    <Spinner visible={loading} textContent="Loading..." />
                ) : (
                    <View>

                        <FlatList
                            data={chits}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <UpcomingAuctionCard
                                    item={item}
                                    activeItem={selected.replace(/\s+/g, "").toLowerCase()}
                                    goToChitDetailsPage={goToChitDetailsPage}
                                    gotoAuctionSummary={gotoAuctionSummary} />
                            )}
                        />
                    </View>
                )}
            </Container>
            <CustomFooter />
        </View>
    );
}

export default UpcomingAuction;