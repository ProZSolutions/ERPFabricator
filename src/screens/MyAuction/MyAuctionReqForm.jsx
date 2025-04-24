import React, { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../../component/Header/CustomHeader';
import Container from '../../component/Container/Container';
import CustomFooter from '../../component/Footer/CustomFooter';
import TextInputBox from '../../component/TextInputBox/TextInputBox';
import CustomButton from '../../component/Button/CustomButton';
import RightArrowIcon from '../../assets/svg-component/RightArrowIcon';
import Spinner from '../../component/Spinner/Spinner';
import handleError from '../../component/ErrorHandler/ErrorHandler';
import { postData } from '../../api/ApiService';

function MyAuctionReqForm({ route }) {
    const { item } = route.params || {};
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [auctionAmt, setAuctionAmt] = useState([]);

    const chitDetails = {
        chitId: `Chit No: ${item.chit_id}`,
        chitMonth: `${item.auction_date} (${item.current_time_period}ᵗʰ Month)`
    };

    const updateSaveHandle = async () => {

        setLoading(true);
        try {
            const response = await postData('/request-auction-form', {
                ...auctionAmt[0]
            });

            if (response?.status === 'success') {
                Alert.alert(
                    "Success",
                    "Requested Successfully!",
                    [
                        { text: "OK", onPress: navigation.goBack },
                    ],
                    { cancelable: false }
                );
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
    }

    const handleSave = async () => {

        Alert.alert(
            "Would You Like to Participate in the Auction?",
            "",
            [
                { text: "NO", onPress: () => { } },
                { text: "CONFIRM", onPress: updateSaveHandle },
            ],
            { cancelable: true }
        );


    };

    const getAmountInfo = async () => {

        setLoading(true);
        try {
            console.log("=====> item", item)
            const response = await postData('/request-auction-form-dropdown', {
                chit_id: item.chit_id,
                chit_month: item.current_time_period
            });
            console.log("=====> response", response)
            if (response?.status === 'success') {
                setAuctionAmt(response.data)
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
    }

    useEffect(() => {
        getAmountInfo()
    }, [item.chit_id])


  
    return (
        <View className="flex-1 bg-white">
            <CustomHeader name="Auction Request" isBackIcon />
            <Spinner visible={loading} textContent="Loading..." />

            <Container paddingBottom={80}>
                <View className="mb-3">
                    <TextInputBox
                        label="Chit Number"
                        placeholder="Chit Number"
                        value={`${chitDetails.chitId}`}
                        editable={false}
                    />
                </View>

                <View className="mb-3">
                    <TextInputBox
                        label="Chit Month"
                        placeholder="Chit Month"
                        value={`${chitDetails.chitMonth}`}
                        editable={false}
                    />
                </View>
                {auctionAmt.length > 0 && (
                    <View className="mb-3">
                        <TextInputBox
                            label="Auction Amount"
                            placeholder="Auction Amount"
                            value={`${auctionAmt?.[0]?.amount || 0}`}
                            editable={false}
                        />
                    </View>
                )}

                    
                <View className="mx-auto pt-6">
                    <CustomButton
                        title="  REGISTER FOR AUCTION  "
                        onPress={handleSave}
                    />
                </View>
            </Container>

            <CustomFooter />
        </View>
    );
}

export default MyAuctionReqForm;
