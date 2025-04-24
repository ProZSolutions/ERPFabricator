import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import CustomHeader from '../../component/Header/CustomHeader';
import Container from '../../component/Container/Container';
import TextInputBox from '../../component/TextInputBox/TextInputBox';
import UserIcon from '../../assets/svg-component/UserIcon';
import PhoneIcon from '../../assets/svg-component/PhoneIcon';
import CustomButton from '../../component/Button/CustomButton';
import RightArrowIcon from '../../assets/svg-component/RightArrowIcon';
import CustomFooter from '../../component/Footer/CustomFooter';
import AddressIcon from '../../assets/svg-component/AddressIcon';
import CityList from '../../component/CityList/CityList';
import Spinner from '../../component/Spinner/Spinner';
import { postData } from '../../api/ApiService';
import handleError from '../../component/ErrorHandler/ErrorHandler';
import { useNavigation } from '@react-navigation/native';

function AddMembers({ route }) {
    const { onGoBack } = route.params || {};
    const navigation = useNavigation();
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        mobileNumber: '',
        address: '',
        city: '',
        referrerName: '',
        referrerMobileNo: '',
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData((prevState) => ({
            ...prevState,
            [field]: value,
        }));
        setErrors((prevErrors) => ({ ...prevErrors, [field]: '' })); // Clear the error on input change
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = "Member name is required.";
        if (!formData.surname.trim()) newErrors.surname = "Surname is required.";
        if (!formData.mobileNumber) {
            newErrors.mobileNumber = "Mobile number is required.";
        } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
            newErrors.mobileNumber = "Invalid mobile number format.";
        }
        if (!formData.address.trim()) newErrors.address = "Address is required.";
        if (!formData.city) newErrors.city = "City is required.";
        if (!formData.referrerName.trim()) newErrors.referrerName = "Reference name is required.";
        if (!formData.referrerMobileNo) {
            newErrors.referrerMobileNo = "Reference mobile number is required.";
        } else if (!/^\d{10}$/.test(formData.referrerMobileNo)) {
            newErrors.referrerMobileNo = "Invalid reference mobile number format.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const requestData = {
            member_name: formData.name,
            sur_name: formData.surname,
            mobile_number: parseInt(formData.mobileNumber, 10),
            address: formData.address,
            city_code: formData.city,
            reference_name: formData.referrerName,
            reference_mobile_number: parseInt(formData.referrerMobileNo, 10),
        };

        try {
            setIsLoading(true);
            const response = await postData("/add-store-member", requestData);

            if (response?.status === "success") {
                Alert.alert("Success", "Member added successfully.", [
                    { text: "OK", onPress: handleBack},
                ]);
            } else {
                Alert.alert("Failed", response?.message || "Failed to add member.");
            }
        } catch (error) {
            if (error?.response?.data?.status === 'error') {
                Alert.alert('Registration Error', error?.response?.data?.error || 'An error occurred.');
              } else {
                await handleError(error, false);
              }
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        if (onGoBack) onGoBack(); 
        navigation.goBack(); 
    };

    return (
        <View className="flex-1 bg-white">
            <CustomHeader name="Add Member" isBackIcon />
            <Container paddingBottom={80}>
                <Spinner visible={isLoading} textContent="Processing..." />
                <View className="px-2 mb-4">
                    <TextInputBox
                        label="Member Name"
                        icon={<UserIcon />}
                        required
                        placeholder="Member Name"
                        value={formData.name}
                        onChangeText={(text) => handleInputChange("name", text)}
                        errorMessage={errors.name}
                    />
                    <TextInputBox
                        label="Surname"
                        icon={<UserIcon />}
                        required
                        placeholder="Surname"
                        value={formData.surname}
                        onChangeText={(text) => handleInputChange("surname", text)}
                        errorMessage={errors.surname}
                    />
                    <TextInputBox
                        label="Mobile Number"
                        icon={<PhoneIcon />}
                        required
                        placeholder="Mobile Number"
                        value={formData.mobileNumber}
                        onChangeText={(text) => handleInputChange("mobileNumber", text)}
                        errorMessage={errors.mobileNumber}
                    />
                    <TextInputBox
                        label="Address"
                        icon={<AddressIcon />}
                        required
                        placeholder="Address"
                        value={formData.address}
                        onChangeText={(text) => handleInputChange("address", text)}
                        errorMessage={errors.address}
                    />
                    <CityList
                        required
                        placeholder="City"
                        label="City"
                        value={formData.city}
                        onValueChange={(value) => handleInputChange("city", value)}
                        disabled={false}
                        errorMessage={errors.city}
                    />
                   
                    <Text className="text-custom-companytxt font-normal text-sm leading-6 mb-4">
                        Reference
                    </Text>
                    <TextInputBox
                        label="Referrering Partner"
                        icon={<UserIcon />}
                        required
                        placeholder="Referrering Partner"
                        value={formData.referrerName}
                        onChangeText={(text) => handleInputChange("referrerName", text)}
                        errorMessage={errors.referrerName}
                    />
                    <TextInputBox
                        label="Mobile Number"
                        icon={<PhoneIcon />}
                        required
                        placeholder="Mobile Number"
                        value={formData.referrerMobileNo}
                        onChangeText={(text) => handleInputChange("referrerMobileNo", text)}
                        errorMessage={errors.referrerMobileNo}
                    />
                    <View className="w-full mb-4">
                        <View className="ml-auto">
                            <CustomButton
                                containerClass="px-5"
                                 title="Save"
                                onPress={handleSubmit}
                            />
                        </View>
                    </View>
                </View>
            </Container>
            <CustomFooter />
        </View>
    );
}

export default AddMembers;
