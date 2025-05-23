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



function AddNotes({ route }) {
  const { lead } = route.params || {}; // ✅ use the correct key: lead

    const [selectedLocation, setSelectedLocation] = useState({
        latitude: 11.2284893,
        longitude: 78.1450853,
      });
    const [mode, setMode] = useState(false);
    const [options, setOptions] = useState({ stage: [] });
     const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const [modes, setModes] = useState([]);
    const [selectedMode, setSelectedMode] = useState(null); // Track selected mode

     const [expandedId, setExpandedId] = useState(null);
        const [tasks, setTasks] = useState([]);

    const [checkboxStatus, setCheckboxStatus] = useState(0); // 0 = unchecked, 1 = checked
    const [inquiryOptions, setInquiryOptions] = useState([]);
    const [replyOptions, setReplyOptions] = useState([]);

    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [selectedReply, setSelectedReply] = useState(null);
    const [messurement, setMessurement] = useState(0);
    const [unitOptions, setUnitOptions] = useState([]);
    const [loadingUnits, setLoadingUnits] = useState(true);
    const [selectedUnit,setSelectedUnit]=useState(null);
    const [hasSetDefaultUnit, setHasSetDefaultUnit] = useState(false);
    const [modeOptions,setModeOptions] = useState([]);
 

 
    const [formValues, setFormValues] = useState({
        uuid: null,
        notes:'',
    });

    const [errors, setErrors] = useState({});

   
    const handleChange = (field, value) => {
        setFormValues(prev => ({
          ...prev,
          [field]: value,
        }));
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
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }

        if (name === 'stage') {
            setFormValues((prev) => ({
                ...prev,
                pipeline_id: value
            }));
        }
    };
    const validateForm = () => {
        const newErrors = {};
        if (!formValues.notes) newErrors.notes = 'Please Enter Notes.';
        
          setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = async () => {
        if (!validateForm()) {
             return;
        }

        setLoading(true);
        try {
            const requestPayload = {
                uuid: lead.uuid,  // Assuming this holds stage ID
                notes: formValues.notes,
            };

             console.log(JSON.stringify(requestPayload, null, 2));


            const response = await postData(`${BASE_URL_TESTING}activity-followupupdate`, requestPayload);
  
            if (response.status === "success") {
                Alert.alert(
                    "Success",
                    "Notes Submitted Successfully!!!.",
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
     
 

    return (
        <View className="flex-1 bg-white">
            <CustomHeader name={" Add Notes "} isBackIcon />
         
                <Container paddingBottom={110}>
                <View style={{ marginTop: -15 }}>
                    <Spinner visible={loading} textContent="Loading..." />

    
                 

                    
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 5 }}>
                        <FontAwesome name="file-text" size={13} color="#000" style={{ marginRight: 6 }} />
                        <Text style={{ color: '#000', fontSize: 12 }}> Notes </Text>
                        <Text style={{ color: 'red', marginLeft: 3 }}>*</Text>
                     </View>
                    <TextInputBox
                         placeholder="Notes"
                        value={formValues.notes}
                        onChangeText={(text) => handleValueChange('notes', text)}
                        errorMessage={errors.notes}
                        multiline={true}
                        numberOfLines={5}
                        textAlignVertical="top"
                     />                     

                    {/* Buttons */}
                    <View className="flex-row justify-between mt-4">
                        <TouchableOpacity className="bg-gray-400 px-6 py-2 rounded-md" onPress={() => navigation.goBack()}>
                            <Text className="text-white font-semibold text-sm">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-blue-600 px-6 py-2 rounded-md" onPress={handleSubmit}>
                            <Text className="text-white font-semibold text-sm">Add Notes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </Container>
       
          
            <CustomFooter isTask={true} />
        </View>
    );
}

export default AddNotes;
