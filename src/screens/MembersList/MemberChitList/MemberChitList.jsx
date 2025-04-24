import React, { useEffect, useState } from 'react'
import { FlatList, Text, View } from 'react-native';
import CustomHeader from '../../../component/Header/CustomHeader';
import Container from '../../../component/Container/Container';
import CustomFooter from '../../../component/Footer/CustomFooter';
import { postData } from '../../../api/ApiService';
import Spinner from '../../../component/Spinner/Spinner';
import MemberChitCard from './MemberChitCard';
import { capitalizeFirstLetter } from '../../../utils';

function MemberChitList({ route }) {
    const { cus_id, name  } = route.params || {};

    const [chits, setChits] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchChitList = async () => {
        setLoading(true);
        try {
            const response = await postData('/member-chit-list', { cus_id: cus_id });
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
        fetchChitList();
    }, []);


    return (
        <View className="flex-1 bg-white">
            <CustomHeader name={capitalizeFirstLetter(name)} isBackIcon={true} />

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
                        keyExtractor={(item , index) => index.toString()}
                        renderItem={({ item }) => (
                            <MemberChitCard item={item} name={capitalizeFirstLetter(name)} />
                        )}
                    />
                )}

            </Container>
            <CustomFooter />
        </View>
    )
}
export default MemberChitList;