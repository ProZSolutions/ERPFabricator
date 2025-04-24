import React, { useState,useEffect } from 'react';
import { Alert, View } from 'react-native';
import ChitInfo from './ChitInfo';
import TabComponent from './TabComponent';
import AuctionComponent from './AuctionComponent';
import ChitMembersList from './ChitMembersList';
import ChitSettlement from './ChitSettlement';
import CustomHeader from '../../component/Header/CustomHeader';
import CustomFooter from '../../component/Footer/CustomFooter';
import Container from '../../component/Container/Container';
import CustomButton from '../../component/Button/CustomButton';
import DisolveIcon from '../../assets/svg-component/DisolveIcon';
import handleError from '../../component/ErrorHandler/ErrorHandler';
import Spinner from '../../component/Spinner/Spinner';
import { useNavigation } from '@react-navigation/native';
import { postData } from '../../api/ApiService';
import { chitNameFormat } from '../../utils';
import AddIcon from '../../assets/svg-component/AddIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';


function ChitDetails({ route }) {
    const { item } = route.params || {};
    const [activeTab, setActiveTab] = useState('Collections');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const handleTabChange = (newTab) => {
        setActiveTab(newTab);
    };
    useEffect(() => {
        const storeChitId = async () => {
            try {
                if (item?.id) {
                    await AsyncStorage.setItem('selectedChitId', item.id.toString());
                 } 
            } catch (error) {
             }
        };
    
        storeChitId();
    }, []);

    const confirmDisolveHanlder = async () => {
        setLoading(true);
        try {
            const response = await postData('/chit-group-delete', { chit_id: item.id });
            if (response && response.status === 'success') {
                navigation.navigate('Home')
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
    }

    const disolveHandler = async () => {
        Alert.alert(
            "",
            "Are you sure you want to dissolve this chit?",
            [
                {
                    text: "No",
                    onPress: () => console.log("Action Cancelled"),
                    style: "cancel",
                },
                {
                    text: "Yes",
                    onPress: () => confirmDisolveHanlder(),
                },
            ],
            { cancelable: false }
        );


    }

    const onEditChitInfo = (obj) => {
        navigation.navigate('AddChit', {
            isUpdate: true,
            updateChitId: obj.id
        })
    }

    const gotoAddPastDetails = (obj) => {
        navigation.navigate('ExistingAddChit', {
            chitId: obj.id,
            completedMonth:obj.existing_completed_month
        })
    }
    console.log("====> item", item)

    return (
        <View className="flex-1 bg-white">
            <CustomHeader name={chitNameFormat(item.chit_name, item.id)} isBackIcon={true} />
            <Container paddingBottom={110}>
                <Spinner visible={loading} textContent="Loading..." />
                <View style={{ marginTop: -15 }}>
                    <ChitInfo item={item} onEditChitInfo={onEditChitInfo} />
                    {item?.existing_chit === 1 && item?.past_auction == true && (
                        <View className="flex-row justify-end mb-4">
                            <CustomButton
                                title={`Add Past Details`}
                                icon={<AddIcon />}
                                isLeftIcon={true}
                                onPress={()=>gotoAddPastDetails(item)} />
                        </View>
                    )}
                    <TabComponent activeTab={activeTab} onTabChange={handleTabChange} />
                    {activeTab === "Collections" && (<AuctionComponent chitId={item.id} auctionMonth={item.current_time_period} status={item.newstatus} />)}
                    {activeTab === "Members" && (<ChitMembersList chitId={item.id} chitMonth={item.current_time_period} status={item.newstatus} />)}
                    {activeTab === "Settlement" && (<ChitSettlement chitId={item.id} status={item.newstatus} />)}
                </View>
                {item?.newstatus?.toLowerCase() === 'new' && (
                    <View className="flex-row justify-end items-center mb-1 mt-1">
                        <CustomButton
                            title={`Dissolve`}
                            icon={<DisolveIcon />}
                            onPress={disolveHandler} />
                    </View>
                )}

            </Container>
            <CustomFooter
                isAddCollection={activeTab === "Collections" ? true : false}
                isAddSettlement={activeTab === "Settlement" ? true : false}
                chitId={item.id}
                auctionMonth={item.current_time_period} />
        </View>
    );
}
export default ChitDetails;
