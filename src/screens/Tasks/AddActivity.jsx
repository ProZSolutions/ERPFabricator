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
 

 
    const [formValues, setFormValues] = useState({
        date:'',
        lead_id:'',
        mode_communication:'',
        pipeline_id:'',
        notes:''
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

    const getPlaceholderText = (key, defaultText) => options[key].find((item) => item.value === formValues[key])?.label || defaultText;

    const validateForm = () => {
        const newErrors = {};
        if (!formValues.date) newErrors.date = 'Please select date.';
         if (!formValues.stage) newErrors.stage = 'Please select purpose.';
         if (!formValues.mode) newErrors.mode = 'Please select Mode of Communication.';

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
                 lead_id:lead.id,
                 notes: formValues.notes,
                date: moment(formValues.date ? new Date(formValues.date) : new Date()).format("YYYY-MM-DD HH:mm:ss"),
                mode_communication: selectedMode?.id,
                pipeline_id: formValues.stage   , // Replace with correct if different
            };

             console.log(JSON.stringify(requestPayload, null, 2));


            const response = await postData(`${BASE_URL_TESTING}schedule-store`, requestPayload);
  
            if (response.status === "success") {
                Alert.alert(
                    "Success",
                    "Activity Details Submitted Successfully!!!.",
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
    const handleInquiryChange = async (value) => {
        setSelectedInquiry(value);
        setSelectedReply(null); // reset reply dropdown
        try {
            const res = await postData(`${BASE_URL_TESTING}activityreplydropdown-list`, { query_id: value });
            if (res?.status === 'success') {
                const formatted = res.data.map(item => ({
                    label: item.name,
                    value: item.id
                }));
                setReplyOptions(formatted);
            }
        } catch (err) {
            await handleError(err);
        }
    };
      const getCurrentLocation = async () => {
     
        if (Platform.OS === 'android') {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
    
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
     
              Geolocation.getCurrentPosition(
                (position) => {
                   setSelectedLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                  });  
                },
                (error) => {
                  console.error('Location error:', error);
                  Alert.alert('Error', 'Unable to fetch location');
                },
                {
                  enableHighAccuracy: true,
                  timeout: 15000,
                  maximumAge: 10000,
                  forceRequestLocation: true,   // Important for Android
                  showLocationDialog: true,     // Ask GPS to turn on
                }
              );
            } else {
              Alert.alert('Permission Denied', 'Location permission is required');
            }
          } catch (err) {
            console.warn(err);
          }
        } else {
          // iOS
          Geolocation.requestAuthorization('whenInUse').then((result) => {
            if (result === 'granted') {
              Geolocation.getCurrentPosition(
                (position) => {
                   setLatitude(position.coords.latitude);
                  setLongitude(position.coords.longitude);
                },
                (error) => {
                  console.error('Location error:', error);
                  Alert.alert('Error', 'Unable to fetch location');
                },
                {
                  enableHighAccuracy: true,
                  timeout: 15000,
                  maximumAge: 10000,
                }
              );
            } else {
              Alert.alert('Permission Denied', 'Location permission is required');
            }
          });
        }
      };

    useEffect(() => {
        console.log("details","as "+JSON.stringify(lead));
         if (!formValues.date) {
            handleValueChange("date", new Date());
          }
        getCurrentLocation();
        const fetchUploadStatusOptions = async () => {
            try {
                const response = await postData(`${BASE_URL_TESTING}leadstage`, {});
                if (response?.status === 'success' && Array.isArray(response.data)) {
                    const formattedOptions = response.data
                        .filter(item => item.name !== 'New')
                        .map(item => ({
                            label: item.name,
                            value: item.id,
                            meta: { id: item.uuid },
                        }));
                    setOptions(prev => ({ ...prev, stage: formattedOptions }));

                    // Set default stage value after options are loaded
                    if (lead?.stages_id) {
  
                        const matchedOption = formattedOptions.find(opt => opt.meta?.id === 1);
                        if (matchedOption) {
 
                            setFormValues(prev => ({
                                ...prev,
                                stage: matchedOption.value,
                            }));
                        }
                    } else {
                        console.warn("No matched stage option found for stages_id:", 1);
                      }
                }
            } catch (error) {
                console.error('Error loading dropdown:', error);
                await handleError(error);
            }
        };
        fetchUploadStatusOptions();
        const fetchModeCommunication = async () => {
            try {
                const response = await postData(`${BASE_URL_TESTING}leadsource`, {});
                if (response?.status === 'success' && Array.isArray(response.data)) {
                    const filteredModes = response.data.filter(item => item.name !== 'New');
                    setModes(filteredModes);
                }
            } catch (error) {
                console.error('Error loading dropdown:', error);
                await handleError(error);
            }
        };
        fetchModeCommunication();
        const fetchInquiries = async () => {
            try {
                const res = await postData(`${BASE_URL_TESTING}activityquerydropdown-list?type=query`, {});
                if (res?.status === 'success') {
                    const formatted = res.data.map(item => ({
                        label: item.name,
                        value: item.id,
                        uuid:item.uuid
                    }));
                    setInquiryOptions(formatted);
                }
            } catch (err) {
                await handleError(err);
            }
        };
    
        fetchInquiries();
        const fetchUnits = async () => {
            try {
              const data = await getData(`${BASE_URL_TESTING}unit_master?name=&price=`); // Already parsed JSON
               const activeUnits = data.data
                    .filter(unit => unit.is_active === 1)
                    .map(unit => ({ label: unit.unit_name, value: unit.id }));

                 setUnitOptions(activeUnits);

                 if (!hasSetDefaultUnit && activeUnits.length > 0) {
                    setFormValues(prev => ({ ...prev, unit: activeUnits[0].value }));
                    setHasSetDefaultUnit(true);
                  }
            } catch (error) {
              console.error('Failed to fetch units:', error);
            } finally {
              setLoadingUnits(false);
            }
          };
      
          fetchUnits();
        
    }, [lead]);

    return (
        <View className="flex-1 bg-white">
            <CustomHeader name={" Add Schedule "} isBackIcon />
         
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
                                <Text style={{ fontSize: 12, color: '#000' }}>Purpose</Text>
                                <Text style={{ color: 'red', marginLeft: 3 }}>*</Text>
                            </View>
                        }
                        options={options.stage || []}
                        onValueChange={(value) => handleValueChange('stage', value)}
                        placeholder="Purpose"
                        value={formValues.stage}
                    />
                    {errors.stage && (
                        <Text className="text-red-500 font-normal text-[12px]">{errors.stage}</Text>
                    )}
                    {/* Mode Dropdown */}
<DropdownPickerBox
  label={
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <FontAwesome name="exchange" size={13} color="#000" style={{ marginRight: 6 }} />
      <Text style={{ fontSize: 12, color: '#000' }}>Mode of communication</Text>
      <Text style={{ color: 'red', marginLeft: 3 }}>*</Text>
    </View>
  }
  options={
    modes.map((item) => ({
      label: item.name,
      value: item.uuid,
    }))
  }
  onValueChange={(value) => {
    const selected = modes.find((item) => item.uuid === value);
    setSelectedMode(selected);
    handleValueChange('mode', value); // optional: update formValues if needed
  }}
  placeholder="Select Mode"
  value={selectedMode?.uuid}
/>

{errors.mode && (
  <Text className="text-red-500 font-normal text-[12px]">{errors.mode}</Text>
)}

                  

                   

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 5 }}>
                        <FontAwesome name="file-text" size={13} color="#000" style={{ marginRight: 6 }} />
                        <Text style={{ color: '#000', fontSize: 12 }}> Notes </Text>
                     </View>
                    <TextInputBox
                         placeholder="Notes"
                        value={formValues.notes}
                        onChangeText={(text) => handleValueChange('notes', text)}
                        errorMessage={errors.details}
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
                            <Text className="text-white font-semibold text-sm">Add Schedule</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </Container>
       
          
            <CustomFooter isTask={true} />
        </View>
    );
}

export default AddSchedule;
