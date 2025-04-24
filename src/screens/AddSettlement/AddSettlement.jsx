import React, { useEffect, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
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
import UploadIcon from '../../assets/svg-component/UploadIcon';
import ImageUploadTextBox from '../../component/ImageUploadTextBox/ImageUploadTextBox';
import CommentsInputBox from '../../component/CommentsInputBox/CommentsInputBox';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

function AddSettlement({ route }) {
    const [mode,setMode]=useState(false);
    
    const { chitId, auctionMonth } = route.params || {};
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const [formValues, setFormValues] = useState({
        chitNo: null,
        auctionMonth: null,
        member: null,
        amountReceived: '',
        collectionDate: null,
        modeOfPayment: null,
        transactionDetails: '',
        attachedDocuments: '',
        document: "",
        comments: "",
        settlementType: ""
    });

    const [errors, setErrors] = useState({});
    const [options, setOptions] = useState({
        chitNo: [],
        auctionMonth: [],
        member: [],
        modeOfPayment: [],
        settlementType: [
            { label: "Full Payment", value: "full" },
            { label: "Half Payment", value: "half" }
        ]
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
        if (name === "attachedDocuments") {
            setFormValues((prevState) => ({
                ...prevState,
                attachedDocuments: value.name,
                document: value.base64,
            }));
        } else {
            setFormValues((prev) => ({ ...prev, [name]: value }));

        }
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
                        chitNo: value,
                        auctionMonth: null,
                        member: null,
                    }));
                
                    fetchOptions('/settlement-auction-dropdown', { chit_id: value }, 'auctionMonth', (item) => ({
                        label: `${item.chit_month}ᵗʰ month`,
                        value: item.chit_month,
                    }));
                }
                if (name === 'auctionMonth') {
                    // Reset dependent field
                    setFormValues((prev) => ({
                        ...prev,
                        auctionMonth: value,
                        member: null,
                    }));
                
                    fetchOptions('/settlement-member-dropdown', { chit_id: formValues.chitNo, auction_month: value }, 'member', (item) => ({
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
        if (!formValues.settlementType) newErrors.settlementType = 'Please select settlement type.';
        if (!formValues.amountReceived || isNaN(formValues.amountReceived))
            newErrors.amountReceived = 'Please enter a valid amount.';
        if (!formValues.collectionDate) newErrors.collectionDate = 'Please select a collection date.';
        if (!formValues.modeOfPayment) newErrors.modeOfPayment = 'Please select a mode of payment.';
        if (mode && !formValues.transactionDetails.trim()) newErrors.transactionDetails = 'Transaction details cannot be empty.';
       // if (mode && !formValues.attachedDocuments.trim()) newErrors.attachedDocuments = 'Upload the documents.';
       // if (!formValues.comments) newErrors.comments = 'Add the comments.';

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
                comments: formValues.comments,
                document: formValues.document,
                settlement_type: formValues.settlementType,

            };
            const response = await postData('/settlement-amount', requestPayload);
            if (response.status === "success") {
                Alert.alert(
                    "Success",
                    "Settlement Successfully Submitted!!!.",
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
        if (chitId && !formValues.chitNo) {
            handleValueChange('chitNo', chitId);
        }        

        fetchOptions('/settlement-chit-dropdown', null, 'chitNo', (item) => ({
            label: item.id,
            value: item.id,
        }));
        fetchOptions('/settlement-auction-dropdown', { chit_id: chitId }, 'auctionMonth', (item) => ({
            label: `${item.chit_month}ᵗʰ month`,
            value: item.chit_month,
        }));
        fetchOptions('/settlement-member-dropdown', { chit_id: chitId, auction_month: auctionMonth }, 'member', (item) => ({
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
            <CustomHeader name="Add Settlement" isBackIcon />
            <Container paddingBottom={110}>
                <View style={{ marginTop: -15 }}>
                    <Spinner visible={loading} textContent="Loading..." />

                    {[{ key: 'chitNo', label: 'Select Chit Number' },
                    { key: 'auctionMonth', label: 'Select Auction Month' },
                    { key: 'member', label: 'Select Chit Taken By' },
                    { key: 'settlementType', label: 'Select Settlement Type' },
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
                        placeholder="Settlement Amount"
                        label="Settlement Amount"
                        value={formValues.amountReceived}
                        onChangeText={(text) => handleValueChange('amountReceived', text)}
                        errorMessage={errors.amountReceived}
                        isCurrency
                    />

                    <CustomDatePicker
                        date={formValues.collectionDate}
                        onChangeTxt={(value) => handleValueChange("collectionDate", value)}
                        placeholder="Settlement Date"
                        label="Settlement Date"
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
                                onValueChange={(value) => handleValueChange(key, value)}
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
                    { mode && 
                    <View>
                        <ImageUploadTextBox
                            icon={<UploadIcon />}
                            leftIcon={false}
                            rightIcon={true}
                            required={false}
                            editable={false}
                            containerClass="bg-gray-200"
                            placeholder="Attached Documents"
                            label="Attached Documents"
                            value={formValues.attachedDocuments}
                            onChangeText={(text) => handleValueChange('attachedDocuments', text)}
                            errorMessage={errors.attachedDocuments}
                            mb="mb-1"
                        />
                        <View className="px-2 mb-4">
                            <Text className="text-custom-heading text-xs font-normal mb-1">
                                (You can upload different file types such as
                                <Text className="font-bold"> JPEG, PNG  </Text>
                                up to <Text className="font-bold">4MB</Text> per file.)
                            </Text>
                           
                        </View>
                    </View>
                    }

                    <CommentsInputBox
                         placeholder="Comments"
                        label="Comments"
                        value={formValues.comments}
                        onChangeText={(text) => handleValueChange('comments', text)}
                        errorMessage={errors.comments}
                    />

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
            <CustomFooter isAddSettlement = {true} chitId ={chitId} auctionMonth = {auctionMonth} />
        </View>
    );
}
export default AddSettlement;