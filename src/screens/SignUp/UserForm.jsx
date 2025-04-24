import React, { useState } from 'react';
import CommonForm from './CommonForm';
import { View } from 'react-native';
import Spinner from '../../component/Spinner/Spinner';
import OtpPopup from '../OTP/OtpPopup';
import { submitForm } from './submitForm';
import useForm from './useForm';
import moment from 'moment';

const UserForm = () => {
    const initialFormData = {
        name: '',
        mobileNumber: '',
        password: '',
        confirmPassword: '',
        dob: '',
        gender: '',
        address: '',
        city: '',
    };
    const requiredFields = ['name', 'mobileNumber', 'password', 'confirmPassword', 'dob', 'gender', 'address', 'city'];

    const { formData, handleInputChange, formErrors, validateForm } = useForm(initialFormData, requiredFields);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [fromRes, setFormRes] = useState('');

    const onSaveHandler = async () => {
        if (validateForm()) {
            const requestData = {
                ...formData,
                type: 'user',
                contact: formData.mobileNumber,
                confirm_password: formData.confirmPassword,
                dob:moment(new Date(formData.dob)).format("YYYY-MM-DD")
            };
            await submitForm(requestData, setIsLoading, setModalVisible, setFormRes);
        }
    };

    return (
        <View>
            <Spinner visible={isLoading} textContent="Registration in-progress..." />
            <CommonForm
                formData={formData}
                handleInputChange={handleInputChange}
                isAgent={false}
                onSaveHandler={onSaveHandler}
                formErrors={formErrors}
            />
            {isModalVisible && (
                <OtpPopup
                data={fromRes}
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)} />
            )}
            
        </View>
    );
};

export default UserForm;

