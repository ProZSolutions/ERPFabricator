import React, { useEffect, useState } from "react";
import { Alert, useWindowDimensions, View } from "react-native";
import CustomHeader from "../../component/Header/CustomHeader";
import Container from "../../component/Container/Container";
import CustomFooter from "../../component/Footer/CustomFooter";
import CustomButton from "../../component/Button/CustomButton";
import CommonForm from "../SignUp/CommonForm";
import UpdatePassword from "../UpdatePassword/UpdatePassword";
import useForm from "../SignUp/useForm";
import { getData, postData } from "../../api/ApiService";
import Spinner from "../../component/Spinner/Spinner";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getValue } from "../../component/AsyncStorage/AsyncStorage";

function Settings() {
    const [activeButton, setActiveButton] = useState("profile");
    const [isLoading, setIsLoading] = useState(false);
    const { width } = useWindowDimensions();
    const isLargeScreen = width > 360;
    const [userInfoData, setUserInfoData] = useState(null);


    const requiredFields = [
        "name",
        "mobileNumber",
        "dob",
        "gender",
        "address",
        "city",
    ];

    const initialFormData = {
        id: "",
        name: "",
        mobileNumber: "",
        dob: null,
        gender: "",
        address: "",
        city: "",
        companyName: "",
        registrationDetails: "",
        attachedDocuments: "",
        document: "",
    };

    const {
        formData,
        handleInputChange,
        formErrors,
        validateForm,
        setFormData,
    } = useForm(initialFormData, requiredFields);

    const getImageNameFromUrl = (url) => {
        if (url != '') {
            return url.substring(url.lastIndexOf('/') + 1);
        } else {
            return '';
        }

    };

    const getProfile = async () => {
        setIsLoading(true);
        try {
            const { data } = await getData("/user-profile");
            if (data) {
                setFormData({
                    id: data.id,
                    name: data.name || "",
                    mobileNumber: `${data.contact}` || "",
                    dob: new Date(moment(data.dob, "DD-MM-YYYY")) || null,
                    gender: data.gender || "",
                    address: data.address || "",
                    city: data.city_code || "",
                    companyName: data?.company_name || "",
                    registrationDetails: data?.company_reg || "",
                    attachedDocuments: getImageNameFromUrl(data?.image || '') || "",
                    document: data?.document || '',
                    role_name: data?.role_name || '',
                    agentType:data?.agent_type||'',
                    
                });
            }
        } catch (error) {
            console.error("Error loading profile data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    const onSaveHandler = async (type) => {
        if (validateForm()) {
            const requestData = {
                name: formData.name,
                contact: formData.mobileNumber,
                gender: formData.gender,
                dob: moment(new Date(formData.dob)).format("YYYY-MM-DD")|| '',
                city: formData.city,
                address: formData.address,
            };
            setIsLoading(true);

            try {
                let response = await postData("/user-profile-update", requestData);
                if (response.status === "success") {
                    Alert.alert(
                        "Success",
                        "Profile updated successfully",
                        [
                            {
                                text: "OK",
                                onPress: () => {
                                    getProfile();
                                },
                            },
                        ],
                        { cancelable: false }
                    );
                }
            } catch (error) {
                if (error?.response?.data?.status === "error") {
                    Alert.alert(
                        "Profile Error",
                        error?.response?.data?.error || "An error occurred."
                    );
                } else {
                    await handleError(error, false);
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

   useEffect(() => {
    
    const userInfoHandler = async () => {
        const userInfo = await getValue('userInfo');
        setUserInfoData(userInfo)
    }
    userInfoHandler()
   }, [])

    return (
        <View className="flex-1 bg-white">
            <Spinner visible={isLoading} textContent="Loading User Info..." />

            <CustomHeader name="Settings" isBackIcon={true} isLogout={true} />
            <View className="flex-row justify-center items-center mb-2 mx-2">
                <CustomButton
                    title="Profile Details"
                    onPress={() => setActiveButton("profile")}
                    isActive={activeButton === "profile"}
                    containerClass={`flex-1 mx-2 rounded-lg ${activeButton !== "profile" ? "bg-gray-200" : ""
                        }`}
                    gapClass={!isLargeScreen ? 'text-[12px]' : ''}
                />
                <CustomButton
                    title="Change Password"
                    onPress={() => setActiveButton("changePassword")}
                    isActive={activeButton === "changePassword"}
                    containerClass={`flex-1 mx-2 rounded-lg ${activeButton !== "changePassword" ? "bg-gray-200" : ""
                        }`}
                    gapClass={!isLargeScreen ? 'text-[12px]' : ''}

                />
            </View>
            <Container paddingBottom={80}>
                {!isLoading &&
                    (activeButton === "profile" ? (
                        <CommonForm
                            formData={formData}
                            handleInputChange={handleInputChange}
                            isAgent={userInfoData?.role_name === 'agent' ? true : false}
                            onSaveHandler={onSaveHandler}
                            formErrors={formErrors}
                            isUpdate={true}
                        />
                    ) : (
                        <UpdatePassword />
                    ))}
            </Container>
            <CustomFooter />
        </View>
    );
}

export default Settings;
