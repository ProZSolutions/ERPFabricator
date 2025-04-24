import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import CustomButton from '../../component/Button/CustomButton';
import ChitMembersListItem from './ChitMembersListItem';
import handleError from '../../component/ErrorHandler/ErrorHandler';
import { postData } from '../../api/ApiService';
import Spinner from '../../component/Spinner/Spinner';
import WarningIcon from '../../assets/svg-component/WarningIcon';
import EditIcon from '../../assets/svg-component/EditIcon';
import { useNavigation } from '@react-navigation/native';

// Constants
const OPTIONS = ["All", "Taken", "Not Taken"];

const ChitMembersList = ({ chitId, chitMonth, status }) => {
    const navigation = useNavigation();
    const [activeButton, setActiveButton] = useState("All");
    const [loading, setLoading] = useState(false);
    const [memberList, setMemberList] = useState([]);
    const [addMoreMember, setAddMoreMember] = useState(0);
    const { width } = useWindowDimensions();
    const isLargeScreen = width > 360;

    const fetchChitMember = async () => {
        setLoading(true);
        try {
            const response = await postData('/chit-member-collection-list', {
                chit_no: chitId,
                chit_month: chitMonth,
                type: activeButton.replace(/\s+/g, '').toLowerCase(),
            });
            if (response?.status === 'success') {
                const responseData = response?.data || [];
                const takenEntries = responseData.filter(entry => entry.status === "taken");
                const maxMonth = Math.max(...takenEntries.map(entry => entry.auction_taken_month));

                responseData.forEach(entry => {
                    if (entry.auction_taken_month === maxMonth) {
                        entry.lastTaken = true;
                    } else {
                        entry.lastTaken = false;
                    }
                });
                setMemberList(responseData);
                setAddMoreMember(response?.add_more_member_count)
            } else {
                setMemberList([]);
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
        fetchChitMember();
    }, [chitId, chitMonth, activeButton]);


    const onPressEditMemberHandler = () => {
        navigation.navigate('SelectMembers', {
            chitId,
            alreadySelectedMember:memberList
        })
    }

    return (
        <View className="my-2">
            {/* Button Options */}
            {status?.toLowerCase() !== 'new' && (
                <View className="flex-row justify-center items-center mb-1 mt-1">
                    {OPTIONS.map((option) => (
                        <CustomButton
                            key={option}
                            title={option}
                            onPress={() => setActiveButton(option)}
                            isActive={activeButton === option}
                            containerClass="flex-1 mx-1 rounded-2xl"
                            gapClass={!isLargeScreen ? 'text-[12px]' : ''}
                        />
                    ))}
                </View>
            )}

            {status?.toLowerCase() === 'new' && (
                <View className="flex-row justify-between items-center py-2">
                {addMoreMember > 0 && (
                    <View className="flex-row justify-between items-center space-x-1">
                        <WarningIcon />
                        <Text className="text-custom-heading text-sm font-bold">Add {addMoreMember} more  Members</Text>
                    </View>
                )}
                    <TouchableOpacity
                        onPress={onPressEditMemberHandler}
                        className="flex-row justify-between items-center space-x-1 bg-custom-lightgreen px-4 py-2 rounded-full">
                        <Text className="text-custom-green text-sm font-normal">Add/Edit List</Text>
                        <EditIcon />
                    </TouchableOpacity>
                </View>
            )}

            <View className="w-full h-[1px] bg-gray-200 my-2 mb-2" />

            {/* Spinner */}
            {loading && <Spinner visible={true} textContent="Loading..." />}

            {/* Data List */}
            {!loading && memberList.length > 0 && (
                <FlatList
                    data={memberList}
                    keyExtractor={(item) => item.id?.toString() || `${Math.random()}`}
                    renderItem={({ item }) => (
                        <ChitMembersListItem
                            //  id={item.id}
                            name={item.name}
                            phone={item.contact}
                            month={item.auction_taken_month}
                            label={item.label}
                            isLastTaken={item.lastTaken}
                            status={item.status}
                        />
                    )}
                />
            )}

            {/* No Data View */}
            {!loading && memberList.length === 0 && (
                <View className="flex-1 justify-center items-center mt-10">
                    <Text className="text-sm text-custom-black font-semibold">
                        No Data Found
                    </Text>
                </View>
            )}
        </View>
    );
};

export default ChitMembersList;
