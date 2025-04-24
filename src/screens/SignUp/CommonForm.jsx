import React, { useState } from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import TextInputBox from '../../component/TextInputBox/TextInputBox';
import PasswordInputBox from '../../component/PasswordInputBox/PasswordInputBox';
import CustomButton from '../../component/Button/CustomButton';
import RightArrowIcon from '../../assets/svg-component/RightArrowIcon';
import SignUpFooterLinks from './SignUpFooterLink';
import DropdownBox from '../../component/DropdownBox/DropdownBox';
import CustomDatePicker from '../../component/DatePicker/CustomDatePicker';
import UserIcon from '../../assets/svg-component/UserIcon';
import PhoneIcon from '../../assets/svg-component/PhoneIcon';
import PasswordLockIcon from '../../assets/svg-component/PasswordLockIcon';
import GenderIcon from '../../assets/svg-component/GenderIcon';
import AddressIcon from '../../assets/svg-component/AddressIcon';
import CompanyIcon from '../../assets/svg-component/CompanyIcon';
import FilterIcon from '../../assets/svg-component/FilterIcon';
import RegistrationIcon from '../../assets/svg-component/RegistationIcon';
import UploadIcon from '../../assets/svg-component/UploadIcon';
import CityList from '../../component/CityList/CityList';
import ImageUploadTextBox from '../../component/ImageUploadTextBox/ImageUploadTextBox';
import Icon from 'react-native-vector-icons/Feather';
import CorrectTickIcon from '../../assets/svg-component/CorrectTickIcon';
import ModalPopup from '../../component/ModalPopup/ModalPopup';

function CommonForm({
    formData,
    handleInputChange,
    isAgent,
    onSaveHandler = () => { },
    formErrors = {},
    isUpdate = false,

}) {

    const [isBasicUpdate, setIsBasicUpdate] = useState(isUpdate ? false : true);
    const [isCmpyUpdate, setIsCmpyUpdate] = useState(isUpdate ? false : true);
    const [modalVisible, setModalVisible] = useState(false);

    const onEdit = () => {
        setIsBasicUpdate(true);
    }

    const onCmpyEdit = () => {
        setIsCmpyUpdate(true);

    }

    const today = new Date();
    const minAgeDate = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
    );

    return (
        <View>
            {isUpdate && (
                <View className="flex-row justify-between items-center pb-4">
                    <Text className="text-xs text-custom-heading font-normal">Basic Details</Text>
                    {!isBasicUpdate && (
                        <TouchableOpacity
                            onPress={onEdit}
                            className="flex-row items-center bg-custom-lightgreen px-4 py-2 rounded-full"
                        >
                            <Text className="text-xs text-custom-green mr-2">Edit Info</Text>
                            <Icon name="edit-2" size={10} color="#34D399" />
                        </TouchableOpacity>
                    )}
                    {isBasicUpdate && (
                        <TouchableOpacity
                            onPress={() => onSaveHandler('profile')}
                            className="flex-row items-center bg-custom-lightblue px-4 py-2 rounded-full"
                        >
                            <Text className="text-xs text-custom-hyperlink mr-2">Save</Text>
                            <CorrectTickIcon />
                        </TouchableOpacity>
                    )}

                </View>
            )}
            {isAgent  && 
            <DropdownBox
                label={"Agent Type"}
                required={true} 
                icon={<FilterIcon />}
                options={[
                    { label: 'Finance', value: 'finance' },
                    { label: 'Individual', value: 'individual' },
                ]}
                onValueChange={(value) => handleInputChange('agentType', value)}
                placeholder={{ label: 'Select Agent Type', value: null }}
                errorMessage={formErrors.agentType}
                disabled={!isCmpyUpdate}
                value={formData.agentType}
                />
            }


            <TextInputBox
                icon={<UserIcon />}
                required={true}
                placeholder={
                    formData.agentType === 'finance' 
                        ? 'Financial Name' 
                        : 'Name'
                }
                label={
                    formData.agentType === 'finance' 
                        ? 'Financial Name' 
                        : 'Name'
                }
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
                errorMessage={formErrors.name}
                editable={isBasicUpdate}
            />
            <TextInputBox
                icon={<PhoneIcon />}
                required={true}
                placeholder="Mobile Number"
                label="Mobile Number"
                value={formData.mobileNumber}
                onChangeText={(text) => handleInputChange('mobileNumber', text)}
                errorMessage={formErrors.mobileNumber}
                editable={isBasicUpdate}

            />

         
            {!isUpdate && (
                <PasswordInputBox
                    lockIcon={<PasswordLockIcon />}
                    required={true}
                    placeholder="Password"
                    label="Password"
                    value={formData.password}
                    onChangeText={(text) => handleInputChange('password', text)}
                    errorMessage={formErrors.password}
                />
            )}
            {!isUpdate && (
                <PasswordInputBox
                    lockIcon={<PasswordLockIcon />}
                    required={true}
                    placeholder="Confirm Password"
                    label="Confirm Password"
                    value={formData.confirmPassword}
                    onChangeText={(text) => handleInputChange('confirmPassword', text)}
                    errorMessage={formErrors.confirmPassword}
                />)}
            <CustomDatePicker
                date={formData.dob}
                onChangeTxt={(text) => handleInputChange('dob', text)}
                placeholder="D.O.B"
                label="D.O.B"
                required={true}
                errorMessage={formErrors.dob}
                editable={isBasicUpdate}
                maxDate={minAgeDate}
            />
            <DropdownBox
                label={"Gender"}
                required={true}
                icon={<GenderIcon />}
                options={[
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' },
                ]}
                onValueChange={(value) => handleInputChange('gender', value)}
                placeholder={{ label: 'Gender', value: null }}
                errorMessage={formErrors.gender}
                disabled={!isBasicUpdate}
                value={formData.gender}

            />

            <TextInputBox
                icon={<AddressIcon />}
                required={true}
                placeholder="Address"
                label="Address"
                value={formData.address}
                onChangeText={(text) => handleInputChange('address', text)}
                errorMessage={formErrors.address}
                editable={isBasicUpdate}

            />

            <CityList
                required={true}
                errorMessage={formErrors.city}
                placeholder="City"
                label="City"
                value={formData.city}
                onValueChange={(value) => handleInputChange('city', value)}
                disabled={!isBasicUpdate}
            />

            {isAgent  && formData.agentType === 'finance' && (
                <>

                    <Text className="text-custom-companytxt font-normal text-xs leading-6 mb-4">
                        Company Need Info
                    </Text>
                    

                    <TextInputBox
                        icon={<CompanyIcon />}
                        required={true}
                        placeholder="Company Name"
                        label="Company Name"
                        value={formData.companyName}
                        onChangeText={(text) => handleInputChange('companyName', text)}
                        errorMessage={formErrors.companyName}
                        editable={isCmpyUpdate}
                    />
                    <TextInputBox
                        icon={<RegistrationIcon />}
                        required={true}
                        placeholder="Registration Details"
                        label="Registration Details"
                        value={formData.registrationDetails}
                        onChangeText={(text) => handleInputChange('registrationDetails', text)}
                        errorMessage={formErrors.registrationDetails}
                        editable={isCmpyUpdate}
                    />
                    <ImageUploadTextBox
                        icon={<UploadIcon />}
                        required={false}
                        editable={false}
                        containerClass="bg-gray-200"
                        placeholder="Attached Documents"
                        label="Attached Documents"
                        value={formData.attachedDocuments}
                        onChangeText={(text) => {
                            handleInputChange('attachedDocuments', text)
                        }}
                        errorMessage={formErrors.attachedDocuments}
                        disabled={!isCmpyUpdate}
                        mb="mb-0"
                    />
                </>
            )}
            {isAgent  && formData.agentType === 'finance' && (
                <View className="px-2 py-2 mb-4">
                    <Text className="text-custom-heading text-xs font-normal mb-1">
                        (You can upload different file types such as
                        <Text className="font-bold"> JPEG, PNG  </Text>
                        up to <Text className="font-bold">2MB</Text> per file.)
                    </Text>
                    <View className="flex-row items-center mt-2">
                        <Text className="text-custom-heading text-xs">
                            Attached Documents :
                        </Text>
                        <Pressable onPress={() => setModalVisible(true)}>
                            <Text className="text-custom-hyperlink  text-xs underline ml-1">
                                Preview
                            </Text>
                        </Pressable>
                    </View>
                </View>
            )}
            {!isUpdate && (
                <View>
                    <View className="w-1/2 mx-auto pt-5">
                        <CustomButton
                             title=" NEXT "
                            onPress={onSaveHandler} />
                    </View>
                    <SignUpFooterLinks />
                </View>
            )}
            {modalVisible && (
                <ModalPopup
                    base64Image={`data:image/png;base64,${formData?.document}`}
                    close={() => setModalVisible(false)}
                />
            )}

        </View>
    );
}

export default CommonForm;
