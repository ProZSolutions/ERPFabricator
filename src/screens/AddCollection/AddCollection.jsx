import React, { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import CustomHeader from '../../component/Header/CustomHeader';
import Container from '../../component/Container/Container';
import CustomFooter from '../../component/Footer/CustomFooter';
import DropdownPickerBox from '../../component/DropdownBox/DropdownPickerBox';
import TextInputBox from '../../component/TextInputBox/TextInputBox';
import CustomDatePicker from '../../component/DatePicker/CustomDatePicker';
import RightArrowIcon from '../../assets/svg-component/RightArrowIcon';
import CustomButton from '../../component/Button/CustomButton';
import { getData, postData } from '../../api/ApiService';
import { capitalizeFirstLetter } from '../../utils';
import handleError from '../../component/ErrorHandler/ErrorHandler';
import Spinner from '../../component/Spinner/Spinner';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';


const AddCollection = ({ route }) => {
    const { chitId, auctionMonth } = route.params || {};
    const [loading, setLoading] = useState(false);
    const [mode,setMode]=useState(false);
    const navigation = useNavigation();

    const [formValues, setFormValues] = useState({
        chitNo: null,
        auctionMonth: null,
        member: null,
        amountReceived: '',
        collectionDate: null,
        modeOfPayment: null,
        transactionDetails: '',
    });

    const [errors, setErrors] = useState({});
    const [options, setOptions] = useState({
        chitNo: [],
        auctionMonth: [],
        member: [],
        modeOfPayment: [],
    });

    const fetchOptions = async (endpoint, params, key, mapFn) => {
        try {
            const response = await (params ? postData(endpoint, params) : getData(endpoint));
            if (response?.status === 'success') {
                setOptions((prev) => ({
                    ...prev,
                    [key]: response.data.map(mapFn),
                }));
            } else {
                setOptions((prev) => ({ ...prev, [key]: [] }));
            }
        } catch (error) {
          handleApiError(error);
        }
    };

    const handleApiError = (error) => {
        const message = error?.response?.data?.error || 'An error occurred.';
        const message1 = message.replace(/\s/g, '').trim();
          if(message1!=='NeedChitId' && message1!=='NeedChitNo'){
            Alert.alert('Error', message);
         }
    };

    const handleValueChange = (name, value) => {
         setFormValues((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
        if (name === 'modeOfPayment') {
            setMode(value === 1);
        }
        if (name === 'chitNo') {
            // Reset dependent fields
            setFormValues((prev) => ({
                ...prev,
                auctionMonth: null,
                member: null,
            }));
    
            // Fetch auctionMonth for new chitNo
            fetchOptions('/live-auction-list-collection', { chit_id: value }, 'auctionMonth', (item) => ({
                label: `${item.chit_month}ᵗʰ month`,
                value: item.chit_month,
            }));
        }
        if (name === 'auctionMonth') {
            // Reset dependent field
            setFormValues((prev) => ({
                ...prev,
                member: null,
            }));
    
            // Fetch member list for selected chit and auctionMonth
            fetchOptions('/live-auction-list-member', {
                chit_id: formValues.chitNo,
                auction_month: value,
            }, 'member', (item) => ({
                label: capitalizeFirstLetter(item.name),
                value: item.cus_id,
            }));
        }
    };

    const getPlaceholderText = (key, defaultText) => options[key].find((item) => item.value === formValues[key])?.label || defaultText;

    const validateForm = () => {
        const newErrors = {};
        if (!formValues.chitNo) newErrors.chitNo = 'Please select a chit number.';
        if (!formValues.auctionMonth) newErrors.auctionMonth = 'Please select an auction month.';
        if (!formValues.member) newErrors.member = 'Please select a member.';
        if (!formValues.amountReceived || isNaN(formValues.amountReceived))
            newErrors.amountReceived = 'Please enter a valid amount.';
        if (!formValues.collectionDate) newErrors.collectionDate = 'Please select a collection date.';
        if (!formValues.modeOfPayment) newErrors.modeOfPayment = 'Please select a mode of payment.';
        if (mode && !formValues.transactionDetails.trim()) newErrors.transactionDetails = 'Transaction details cannot be empty.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            console.log('Validation errors:', errors);
            return;
        }

        setLoading(true);
        try {
            const requestPayload = {
                chit_id: chitId,
                auction_month: formValues.auctionMonth,
                cus_id: formValues.member,
                amount: formValues.amountReceived,
                date: moment(new Date(formValues.collectionDate)).format("YYYY-MM-DD"),
                pay_type_id: formValues.modeOfPayment,
                trans_details: formValues.transactionDetails,
            };
            const response = await postData('/add-collection-amount', requestPayload);
           if (response.status === "success") {
                Alert.alert(
                    "Success",
                    "Collections Successfully Submitted!!!.",
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                navigation.goBack()
                            },
                        },
                    ],
                    { cancelable: false }
                );
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
        console.log(" chit no "+chitId);
        if (chitId && !formValues.chitNo) {
            handleValueChange('chitNo', chitId);
        }        

        fetchOptions('/live-chit-list-collection', null, 'chitNo', (item) => ({
            label: item.id,
            value: item.id,
        }));
        fetchOptions('/live-auction-list-collection', { chit_id: chitId }, 'auctionMonth', (item) => ({
            label: `${item.chit_month}ᵗʰ month`,
            value: item.chit_month,
        }));
        fetchOptions('/live-auction-list-member', { chit_id: chitId, auction_month: auctionMonth }, 'member', (item) => ({
            label: capitalizeFirstLetter(item.name),
            value: item.cus_id,
        }));
        fetchOptions('/payment-type-list', null, 'modeOfPayment', (item) => ({
            label: item.payment_type,
            value: item.pay_type_id,
        }));
    }, [chitId, auctionMonth]);

    return (
        <View className="flex-1 bg-white">
            <CustomHeader name="Add Collection" isBackIcon />
            <Container paddingBottom={110}>
                <View style={{ marginTop: -15 }}>
                    <Spinner visible={loading} textContent="Loading..." />

                    {[{ key: 'chitNo', label: 'Select Chit Number' },
                    { key: 'auctionMonth', label: 'Select Auction Month' },
                    { key: 'member', label: 'Select Member' },
                    ].map(({ key, label }) => (
                        <View key={key} className="mb-4">
                            <DropdownPickerBox
                                required
                                label={label}
                                options={options[key]}
                                onValueChange={(value) => handleValueChange(key, value)}
                                placeholder={getPlaceholderText(key, label)}
                                value={formValues[key]}
                                mb="mb-0"
                            />
                            {errors[key] && <Text className="text-red-500 font-normal text-[12px]">{errors[key]}</Text>}
                        </View>
                    ))}
                    <TextInputBox
                        required
                        placeholder="Amount Received"
                        label="Amount Received"
                        value={formValues.amountReceived}
                        onChangeText={(text) => handleValueChange('amountReceived', text)}
                        errorMessage={errors.amountReceived}
                        isCurrency
                    />

                    <CustomDatePicker
                        date={formValues.collectionDate}
                        onChangeTxt={(value) => handleValueChange("collectionDate", value)}
                        placeholder="Collection Date"
                        label="Collection Date"
                        required={true}
                        editable={true}
                        rightIcon={true}
                        errorMessage={errors.collectionDate}

                    />
                    {[{ key: 'modeOfPayment', label: 'Select Mode of Payment' }].map(({ key, label }) => (
                        <View key={key} className="mb-4">
                            <DropdownPickerBox
                                required
                                label={label}
                                options={options[key]}
                                onValueChange={(value) => 
                                    handleValueChange(key, value)}
                                placeholder={getPlaceholderText(key, label)}
                                value={formValues[key]}
                                mb='mb-0'
                            />
                            {errors[key] && <Text className="text-red-500 font-normal text-[12px]">{errors[key]}</Text>}
                        </View>
                    ))}

                    {mode && 
                    <TextInputBox
                        required
                        placeholder="Transaction Details"
                        label="Transaction Details"
                        value={formValues.transactionDetails}
                        onChangeText={(text) => handleValueChange('transactionDetails', text)}
                        errorMessage={errors.transactionDetails}
                    />
                    }
                    <View className="w-full mt-5">
                        <View className="ml-auto">
                            <CustomButton
                                containerClass="px-5"
                                 title=" Submit "
                                onPress={handleSubmit}
                            />
                        </View>
                    </View>
                </View>
            </Container>
            <CustomFooter isAddCollection={true} chitId={chitId} auctionMonth={auctionMonth} />
        </View>
    );
};

export default AddCollection;

