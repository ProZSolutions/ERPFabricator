import React, { useEffect, useState } from 'react';
import { Alert, Pressable, Text, View, TouchableOpacity ,Dimensions,Switch,TextInput,ActivityIndicator,FlatList} from 'react-native';
import CustomHeader from '../../component/Header/CustomHeader';
import Container from '../../component/Container/Container';
import CustomFooter from '../../component/Footer/CustomFooter';
import DropdownPickerBox from '../../component/DropdownBox/DropdownPickerBox';
import TextInputBox from '../../component/TextInputBox/TextInputBox';
import CustomDateTimePicker from '../../component/DateTimePicker/CustomDateTimePicker';
import { getData, postData } from '../../api/ApiService';
import handleError from '../../component/ErrorHandler/ErrorHandler';
import Spinner from '../../component/Spinner/Spinner';
import UploadIcon from '../../assets/svg-component/UploadIcon';
import ImageUploadTextBox from '../../component/ImageUploadTextBox/ImageUploadTextBox';
 import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { BASE_URL_TESTING } from '../../api/Config';
import moment from 'moment';
import { styled } from 'nativewind';
 import  CheckboxWithLabel from '../../component/Checkbox/CheckboxWithLabel';
import MapView, { Marker,PROVIDER_GOOGLE } from 'react-native-maps';
import { PermissionsAndroid ,Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import ScheduleRowItem from './ScheduleRowItem';

 

function AddSchedule({ route }) {
  const { lead } = route.params || {}; // ✅ use the correct key: lead
      const [checkboxStatus, setCheckboxStatus] = useState(0); // 0 = unchecked, 1 = checked
 
     const [options, setOptions] = useState({ stage: [] });
     const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
     const [selectedMode, setSelectedMode] = useState(null); // Track selected mode

 
    const [formValues, setFormValues] = useState({
        date:'',
        update_status:'',
          details:'',
        uuid:lead?.uuid,
        file_url:''
    });

    const [errors, setErrors] = useState({});

   
    const handleChange = (field, value) => {
        setFormValues(prev => ({
          ...prev,
          [field]: value,
        }));
      };

    const handleUnitCheange = (val) => {
        setFormValues(prev => ({ ...prev, unit: val }));
      };
    const handleValueChange = (name, value) => {
        if (name === "file_url") {
            setFormValues((prevState) => ({
                ...prevState,
                 file_url: value.base64,
            }));
        } else {
            setFormValues((prev) => ({ ...prev, [name]: value }));
        }
      
    };

    const getPlaceholderText = (key, defaultText) => options[key].find((item) => item.value === formValues[key])?.label || defaultText;

    const validateForm = () => {
        const newErrors = {};
        if (!formValues.date) newErrors.date = 'Please select date.';
         if (!formValues.status) newErrors.status = 'Please select status.';
 
         setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handlePress = (id) => {
        setExpandedId((prev) => (prev === id ? null : id));
      };
    const handleSubmit = async () => {
        if (!validateForm()) {
             return;
        }

        setLoading(true);
        try {
            const requestPayload = {
                 uuid:lead.uuid,
                 details: formValues.notes,
                date: moment(formValues.date ? new Date(formValues.date) : new Date()).format("YYYY-MM-DD"),
                update_status: formValues.status,
                file_url: formValues.file_url   , // Replace with correct if different
            };

             console.log(JSON.stringify(requestPayload, null, 2));


            const response = await postData(`${BASE_URL_TESTING}crmtaskupdate-create`, requestPayload);
  
            if (response.status === "success") {
                Alert.alert(
                    "Success",
                    "Task Details Submitted Successfully!!!.",
                    [{ text: "OK", onPress: () => navigation.goBack() }],
                    { cancelable: false }
                );
            }
        } catch (error) {
            if (error?.response?.data?.status === "error") {
                Alert.alert("Error", error?.response?.data?.error || "An error occurred.");
            } else {
                await handleError(error, false);
            }
        } finally {
            setLoading(false);
        }
    };
  
    useEffect(() => {
        console.log("details","as "+JSON.stringify(lead));
         if (!formValues.date) {
            handleValueChange("date", new Date());
          }       
        
    }, [lead]);

    return (
        <View className="flex-1 bg-white">
            <CustomHeader name={" Update Assigned Task "} isBackIcon />
         
                <Container paddingBottom={110}>
                <View style={{ marginTop: -15 }}>
                    <Spinner visible={loading} textContent="Loading..." />

                    {/* Date Field */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 5 }}>
                        <FontAwesome name="calendar" size={13} color="#000" style={{ marginRight: 6 }} />
                        <Text style={{ color: '#000', fontSize: 12 }}> Date</Text>
                        <Text style={{ color: 'red', marginLeft: 3 }}>*</Text>
                    </View>
                    <CustomDateTimePicker
                        date={formValues.date || new Date()}
                        onChangeTxt={(value) => handleValueChange("date", value)}
                        placeholder="Select Date"
                        required={true}
                        editable={true}
                        rightIcon={true}
                        errorMessage={errors.date}
                    />

                    {/* Stage Dropdown */}
                    <DropdownPickerBox
                        label={
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <FontAwesome name="spinner" size={13} color="#000" style={{ marginRight: 6 }} />
                                <Text style={{ fontSize: 12, color: '#000' }}>Status</Text>
                                <Text style={{ color: 'red', marginLeft: 3 }}>*</Text>
                            </View>
                        }
                         options={[
                            { label: 'Inprogress', value: 'inprogress' },
                            { label: 'Pending', value: 'pending' },
                            { label: 'Completed', value: 'completed' },
                        ]}
                        onValueChange={(value) => handleValueChange('status', value)}
                        placeholder="Status"
                        value={formValues.status}
                    />
                    {errors.status && (
                        <Text className="text-red-500 font-normal text-[12px]">{errors.status}</Text>
                    )}
                  
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 5 }}>
                        <FontAwesome name="file-text" size={13} color="#000" style={{ marginRight: 6 }} />
                        <Text style={{ color: '#000', fontSize: 12 }}> Outcome/Details </Text>
                     </View>
                    <TextInputBox
                         placeholder="Outcome/Details"
                        value={formValues.notes}
                        onChangeText={(text) => handleValueChange('notes', text)}
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
                                label=" File (if any)"
                                value={formValues.file_url}
                                onChangeText={(text) => handleValueChange('file_url', text)}
                                errorMessage={errors.file_url}
                                mb="mb-1"
                            />
                            </View>

                    {/* Buttons */}
                    <View className="flex-row justify-between mt-4">
                        <TouchableOpacity className="bg-gray-400 px-6 py-2 rounded-md" onPress={() => navigation.goBack()}>
                            <Text className="text-white font-semibold text-sm">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-blue-600 px-6 py-2 rounded-md" onPress={handleSubmit}>
                            <Text className="text-white font-semibold text-sm">Update Task</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </Container>
       
          
            <CustomFooter isTask={true} />
        </View>
    );
}

export default AddSchedule;
