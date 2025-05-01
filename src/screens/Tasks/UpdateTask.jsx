import React, { useEffect, useState } from 'react';
import { Alert, Pressable, Text, View,TouchableOpacity } from 'react-native';
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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { BASE_URL_TESTING } from '../../api/Config';

import moment from 'moment';

function AddSettlement({ route }) {
    const [mode,setMode]=useState(false);
    
    const { details } = route.params || {};
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const shouldShowForm = details?.is_update === 1 && details?.is_completed === 0;

    const [formValues, setFormValues] = useState({
        uuid: null,
        update_status: null,
        date: null,
        details: '',
        file_url: ''
       
    });

    const [errors, setErrors] = useState({});
    const [options, setOptions] = useState({
        update_status: [
            { label: "Pending", value: "pending" },
            { label: "Completed", value: "completed" }
        ]
    });

    useEffect(() => {
      if (details) {
        console.log("details",details+" date value as "+details.date);

          setFormValues((prev) => ({
              ...prev,
              uuid: details.uuid || null,
              update_status: details.is_completed === 1 ? 'pending' : 'completed',
              date: details.date ? new Date(details.date) : new Date(),
              details: details.latest_update || '',
              file_url: details.file_url || '',


          }));
      }
  }, [details]);
  
 
    const handleValueChange = (name, value) => {
        if (name === "file_url") {
            setFormValues((prevState) => ({
                ...prevState,
                file_url: value.name,
                file_url: value.base64,
            }));
        } else {
            setFormValues((prev) => ({ ...prev, [name]: value }));

        }
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
 
        if (name === 'update_status') {
                    // Reset dependent fields
                    setFormValues((prev) => ({
                        ...prev,
                        update_status: value
                    }));                
       }
 

    };

    const getPlaceholderText = (key, defaultText) => options[key].find((item) => item.value === formValues[key])?.label || defaultText;

    const validateForm = () => {
        const newErrors = {};
        if (!formValues.date) newErrors.date = 'Please select date.';
        if (!formValues.update_status) newErrors.update_status = 'Please select status.';
        if (!formValues.details) newErrors.details = 'Please enter description.';
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
                uuid:details.uuid,
                file_url: formValues.file_url,
                update_status: formValues.update_status,
                details: formValues.details,
                date: moment(formValues.date ? new Date(formValues.date) : new Date()).format("YYYY-MM-DD"),


            };
            const response = await postData('/crm/crmtaskupdate-create', requestPayload);
            console.log("API Response:", response);

            if (response.status === "success") {
                Alert.alert(
                    "Success",
                    "Task Details Submitted Successfully!!!.",
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
        
    }, [ ]);

    return (
        <View className="flex-1 bg-white">
            <CustomHeader name="Task Details" isBackIcon />
            <Container paddingBottom={110}>
            {shouldShowForm ? (
                <View style={{ marginTop: -15 }}>
                    <Spinner visible={loading} textContent="Loading..." />
 
                    <View style={{ flexDirection: 'row', alignItems: 'center',marginLeft:5 }}>
                                <FontAwesome name="calendar" size={13} color="#000" style={{ marginRight: 6 }} />
                                <Text style={{ color: '#000',fontSize:12 }}> Date</Text>
                                <Text style={{color:'red',marginLeft:3}}>*</Text>
                    </View>
                    <CustomDatePicker
                        date={formValues.date}
                        onChangeTxt={(value) => handleValueChange("date", value)}
                        placeholder="Select Date"
                         required={true}
                        editable={true}
                        rightIcon={true}
                        errorMessage={errors.date}
                    />
                    
                    {[{ key: 'update_status', label: 'Status' }].map(({ key, label }) => (
                        <View key={key} className="mb-4">
                            <DropdownPickerBox
                                 
                                label={
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <FontAwesome name="spinner" size={13} color="#000" style={{ marginRight: 6 }} />
                                        <Text style={{ fontSize: 12, color: '#000' }}>{label}</Text>
                                        <Text style={{ color: 'red', marginLeft: 3 }}>*</Text>
                                    </View>
                                }
                                options={options[key]}
                                onValueChange={(value) => handleValueChange(key, value)}
                                placeholder={getPlaceholderText(key, label)}
                                value={formValues[key]}
                                mb='mb-0'
                            />
                            {errors[key] && <Text className="text-red-500 font-normal text-[12px]">{errors[key]}</Text>}
                        </View>
                    ))}

                    <View style={{ flexDirection: 'row', alignItems: 'center',marginLeft:5 }}>
                                <FontAwesome name="file-text" size={13} color="#000" style={{ marginRight: 6 }} />
                                <Text style={{ color: '#000',fontSize:12 }}> Task Description </Text>
                                <Text style={{color:'red',marginLeft:3}}>*</Text>
                    </View>
                    <TextInputBox
                        required
                        placeholder="Details"
                         value={formValues.details}
                        onChangeText={(text) => handleValueChange('details', text)}
                        errorMessage={errors.details}
                        multiline={true}
                        numberOfLines={5}
                        textAlignVertical="top"
                    />
                    
                     
                    <View>
                        <ImageUploadTextBox
                            icon={<UploadIcon />}
                            leftIcon={false}
                            rightIcon={true}
                            required={false}
                            editable={false}
                            containerClass="bg-gray-200"
                            placeholder="Attached Documents"
                            label="Work Attachment File (if any)"
                            value={formValues.file_url}
                            onChangeText={(text) => handleValueChange('file_url', text)}
                            errorMessage={errors.file_url}
                            mb="mb-1"
                        />
                         
                    </View>
                     

                    <View className="flex-row justify-between mt-4">
                      <TouchableOpacity className="bg-gray-400 px-6 py-2 rounded-md"   onPress={() => navigation.navigate('TaskList')}>
                        <Text className="text-white font-semibold text-sm">Cancel</Text>
                      </TouchableOpacity>

                      <TouchableOpacity className="bg-blue-600 px-6 py-2 rounded-md" onPress={handleSubmit}>
                        <Text className="text-white font-semibold text-sm">Update</Text>
                      </TouchableOpacity>
                  </View>

                </View>
            ) : (
                <View className="flex-1 justify-center items-center mt-10">
                    <Text className="text-gray-500 text-base text-center">
                    This task is already completed or cannot be updated.
                    </Text>
                </View>
             )}
            </Container>
            <CustomFooter  />
            </View>
    );
}
export default AddSettlement;