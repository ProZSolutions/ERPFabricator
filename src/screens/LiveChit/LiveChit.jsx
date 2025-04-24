
import React, { useCallback, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, FlatList, Alert } from 'react-native';
import CustomHeader from '../../component/Header/CustomHeader';
import SearchInputBox from '../../component/SearchInputBox/SearchInputBox';
import ChitCard from './ChitCard';
import Container from '../../component/Container/Container';
import CustomFooter from '../../component/Footer/CustomFooter';
import { postData } from '../../api/ApiService';
import handleError from '../../component/ErrorHandler/ErrorHandler';
import Spinner from '../../component/Spinner/Spinner';
import { useFocusEffect } from '@react-navigation/native';

function LiveChit({ route }) {
    const { isUpdateNewChit = false } = route.params || {};

    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState("All");
    const [chits, setChits] = useState([]);
    const [loading, setLoading] = useState(false);
    const options = ["All", "Active", "New", "Closed"];

    const fetchChitList = async () => {
        setLoading(true);
        try {
            const response = await postData('/live-chit-list', {
                type: selected.toLowerCase(),
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

    useFocusEffect(
        useCallback(() => {
            const handler = setTimeout(() => {
                fetchChitList();
            }, 300);
    
            return () => {
                clearTimeout(handler);
            };
          return () => console.log('Cleaning up on blur...');
        }, [selected, search, isUpdateNewChit])
      );


    const handleInputSearchChange = (value) => {
        setSearch(value);
    };

    return (
        <View className="flex-1 bg-white">
            <CustomHeader name="Live Chit" isBackIcon={true} />
            <SearchInputBox value={search} onChangeText={handleInputSearchChange} />
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
                {loading ? (
                    <Spinner visible={loading} textContent="Loading..." />
                ) : (
                    <FlatList
                        data={chits}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <ChitCard item={item} />
                        )}
                    />
                )}

            </Container>
            <CustomFooter />
        </View>
    );
}

export default LiveChit;
