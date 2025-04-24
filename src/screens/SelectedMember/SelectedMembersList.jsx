import React, { useState } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import SearchInputBox from '../../component/SearchInputBox/SearchInputBox';
import CustomHeader from '../../component/Header/CustomHeader';
import CustomButton from '../../component/Button/CustomButton';
import Container from '../../component/Container/Container';
import SelectedMembersItemComp from './SelectedMembersInfo';
import CustomFooter from '../../component/Footer/CustomFooter';
import WarningIcon from '../../assets/svg-component/WarningIcon';
import RightArrowIcon from '../../assets/svg-component/RightArrowIcon';
import { postData } from '../../api/ApiService';
import handleError from '../../component/ErrorHandler/ErrorHandler';
import { useNavigation } from '@react-navigation/native';
import EditIcon from '../../assets/svg-component/EditIcon';
import Spinner from '../../component/Spinner/Spinner';

function SelectedMembersList({ route }) {
    const { selectedMembersItem,
        totalChitMember,
        addedMembers,
        chitId,
        isExistingChit,
        alreadySelectedMember = [],
        completedMonth } = route.params;
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

    const handleInputSearchChange = (value) => setSearch(value);

    const filteredMembersList = selectedMembersItem.filter(
        (member) =>
            member.name.toLowerCase().includes(search.toLowerCase()) ||
            member.contact.toString().includes(search)
    );

    const addMemberHandler = async (type) => {
        const chitType = selectedMembersItem.map((member) => (member.isFullChit ? 1 : 0));
        const selectedMembers = selectedMembersItem.map((member) => member.id);

        const requestData = {
            chit_id: chitId,
            members: selectedMembers,
            chit_type: chitType,
        };
        let isUpdate = false;
        let url = "/add-chit-customer"
        if (alreadySelectedMember.length > 0) {
            isUpdate = true;
            url = "/update-chit-customer"
        }
        try {
            setIsLoading(true);
            const response = await postData(url, requestData);

            if (response?.status === "success") {
                if (isUpdate) {
                    navigation.navigate("LiveChit", {
                        isUpdateNewChit: true
                    });
                } else if (isExistingChit && type === 'past') {

                    navigation.navigate("ExistingAddChit", {
                        chitId,
                        completedMonth
                    })

                    console.log("chitid","as "+chitId+" completed mont "+completedMonth);

                } else {
                    navigation.navigate("ChitSummary", { chitId })
                }
            } else {
                Alert.alert("Failed", "Failed to add chit members.");
            }
        } catch (error) {
            if (error?.response?.data?.status === "error") {
                Alert.alert("Error", error?.response?.data?.error || "An error occurred.");
            } else {
                await handleError(error, false);
            }
        } finally {
            setIsLoading(false);
        }
    };
    const remainingMembers = parseFloat(totalChitMember) - parseFloat(addedMembers);

    return (
        <View className="flex-1 bg-white">
            <CustomHeader name="Selected Member List" isBackIcon />
            <SearchInputBox value={search} onChangeText={handleInputSearchChange} />

            <View className={`flex-row  px-4 pt-2 ${remainingMembers === 0 ? "justify-end" : "justify-between"}`}>
                {remainingMembers > 0 && (
                    <View className="flex-row items-center space-x-1">
                        <WarningIcon />
                        <Text className="text-custom-companytxt text-xs">
                            Add {remainingMembers} More Members
                        </Text>
                    </View>
                )}
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <View className="flex-row items-center space-x-1 bg-custom-lightgreen px-2 py-1  rounded-3xl">
                        <Text className="text-custom-green text-xs font-medium">Edit / ADD List</Text>
                        <EditIcon />
                    </View>
                </TouchableOpacity>
            </View>


            <Container paddingBottom={10}>
                <Spinner visible={isLoading} textContent="Processing..." />
                {filteredMembersList.length === 0 ? (
                    <View className="flex-row justify-center items-center h-60">
                        <Text className="text-sm text-custom-heading">No Data Found</Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredMembersList}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <SelectedMembersItemComp member={item} />}
                    />
                )}
            </Container>


            <View style={{ marginBottom: 70 }}>
                {isExistingChit ? (
                    <View className="flex-row justify-between px-4">
                        <CustomButton
                            isLeftIcon={false}
                            gapClass="mr-2"
                            containerClass="px-5"
                             title={" Add Past Auction " }
                            onPress={() => addMemberHandler('past')}
                        />
                        <CustomButton
                            isLeftIcon={false}
                            gapClass="mr-2"
                            containerClass="px-5"
                             title={" Save "}
                            onPress={addMemberHandler}
                        />
                    </View>
                ) : (
                    <View className="flex-row px-4 justify-end">
                        <CustomButton
                            isLeftIcon={false}
                            gapClass="mr-2"
                            containerClass="px-5"
                             title={" Save "}
                            onPress={addMemberHandler}
                        />
                    </View>
                )}

            </View>
            <CustomFooter />
        </View>
    );
}

export default SelectedMembersList;
