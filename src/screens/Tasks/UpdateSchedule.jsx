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



function AddSettlement({ route }) {
    const [selectedLocation, setSelectedLocation] = useState({
        latitude: 11.2284893,
        longitude: 78.1450853,
      });
    const [mode, setMode] = useState(false);
    const [options, setOptions] = useState({ stage: [] });
    const { details } = route.params || {};
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
    const[shouldShowForm,setShouldShowForm] = useState(false);


 
    const [formValues, setFormValues] = useState({
        uuid: null,
        stage: null,
        date: null,
        details: '',
         length: '',
        width: '',
        height: '',
        unit: '',
        lead_id:'',
        mode_communication:'',
        pipeline_id:'',
        content_reply:'',
        customer_reply:'',
        notes:'',
        file_url:null,
        is_schedule:'1',
        schedule_id:'',
        send_msg:'0',
        latitude:null,
        longitude:null
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (details) {
            console.log("shown details "+details?.is_completed);  
            setShouldShowForm(details?.is_completed !== 1);
            console.log("details comple ",details.is_completed);
            setFormValues((prev) => ({
                ...prev,
                uuid: details.uuid || null,
                // Removed hardcoded stage to prevent overriding
                date: details.date ? new Date(details.date) : new Date(),
                details: details.latest_update || '',
                file_url: details.file_url || '',
            }));

            if (Array.isArray(details.activity)) {
                setTasks(details.activity); // set the array directly
              } else {
                console.warn("task_update is null or not an array");
                setTasks([]);
              }
              
        }
    }, [details]);
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
                stage: value
            }));
        }
    };

    const getPlaceholderText = (key, defaultText) => options[key].find((item) => item.value === formValues[key])?.label || defaultText;

    const validateForm = () => {
        const newErrors = {};
        if (!formValues.date) newErrors.date = 'Please select date.';
        if (!formValues.stage) newErrors.stage = 'Please select status.';

        if (!selectedMode) newErrors.mode = 'Please select a mode of communication.';
        if (!selectedInquiry) newErrors.inquiry = 'Please select an inquiry.';
        if (!selectedReply) newErrors.reply = 'Please select a reply.';

        if ((selectedMode?.name === 'Email' || selectedMode?.name === 'WhatsApp') && checkboxStatus === 1) {
            if (!formValues.file_url) newErrors.file_url = 'Please attach a file.';
        }

        const selectedStage = options.stage.find(opt => opt.value === formValues.stage);
        if (selectedStage?.label === 'Field Visit') {
            if(messurement===1){
                if(!formValues.length) newErrors.length="Enter length";
                if(!formValues.width) newErrors.width="Enter width";
                if(!formValues.height) newErrors.height="Enter height";
                if(!formValues.unit) newErrors.unit="Select unit";
            }
        }
        if (selectedMode?.name === 'Direct') {
            if (!selectedLocation?.latitude || !selectedLocation?.longitude) {
                newErrors.location = 'Please select a location on the map.';
            }
         
        }
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
                uuid: details.uuid,
                lead_id:details.lead_id,
                file_url: formValues.file_url,
                update_status: formValues.stage,  // Assuming this holds stage ID
                notes: formValues.notes,
                date: moment(formValues.date ? new Date(formValues.date) : new Date()).format("YYYY-MM-DD HH:mm:ss"),
                mode_communication: selectedMode?.id,
                pipeline_id: formValues.stage   , // Replace with correct if different
                customer_reply: selectedReply,
                content_reply: selectedInquiry,
                length: formValues.length,
                width: formValues.width,
                height: formValues.height,
                unit: formValues.unit,
                latitude: selectedLocation?.latitude,
                longitude: selectedLocation?.longitude,
                is_schedule: '1',
                schedule_id: details.uuid,
                send_msg: checkboxStatus.toString(), // or 1/0 as string
            };

             console.log(JSON.stringify(requestPayload, null, 2));


            const response = await postData(`${BASE_URL_TESTING}activity-create`, requestPayload);
  
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
                    if (details?.stages_id) {
  
                        const matchedOption = formattedOptions.find(opt => opt.meta?.id === details.stages_id);
                        if (matchedOption) {
 
                            setFormValues(prev => ({
                                ...prev,
                                stage: matchedOption.value,
                            }));
                        }
                    } else {
                        console.warn("No matched stage option found for stages_id:", details.stages_id);
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
        
    }, [details]);

    return (
        <View className="flex-1 bg-white">
            <CustomHeader name={shouldShowForm?"Update Schedule":"Schedule List"} isBackIcon />
            {shouldShowForm ? (
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
                        date={formValues.date}
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
                    <View className="flex-row flex-wrap gap-2">
                            {modes.map((item) => (
                                <TouchableOpacity
                                key={item.uuid}
                                className={`border border-green-500 px-4 py-2 mb-2 rounded ${selectedMode?.uuid === item.uuid ? 'bg-green-100' : ''}`}
                                onPress={() => {
                                    setSelectedMode(item);
                                    setMessurement(0);
                                    setCheckboxStatus(0); // reset checkbox when selecting a new mode
                                    setFormValues(prev => ({
                                    ...prev,
                                    file_url: '',
                                    length: '',
                                    width: '',
                                    height: '',
                                    unit: ''
                                }));

                            // Reset location
                            setSelectedLocation({ latitude: null, longitude: null });
                            getCurrentLocation();
                                }}

                                >
                                <Text className="text-green-600 font-medium text-[12px]">
                                    {item.name}
                                </Text>
                                </TouchableOpacity>
                            ))}
                     </View>
                     {errors.mode  && (
                        <Text className="text-red-500 font-normal text-[12px]">{errors.mode }</Text>
                    )}
                    <DropdownPickerBox
                        label={
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <FontAwesome name="question-circle" size={13} color="#000" style={{ marginRight: 6 }} />
                                <Text style={{ fontSize: 12, color: '#000' }}>Lead Insights / Inquiries</Text>
                                <Text style={{ color: 'red', marginLeft: 3 }}>*</Text>
                            </View>
                        }
                        options={inquiryOptions}
                        onValueChange={(value) => handleInquiryChange(value)}  
                        placeholder="Select Inquiry"
                        value={selectedInquiry}
                    />
                     {errors.inquiry   && (
                        <Text className="text-red-500 font-normal text-[12px]">{errors.inquiry  }</Text>
                    )}

                     <DropdownPickerBox
                        label={
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <FontAwesome name="reply" size={13} color="#000" style={{ marginRight: 6 }} />
                                <Text style={{ fontSize: 12, color: '#000' }}>Our Reply</Text>
                                <Text style={{ color: 'red', marginLeft: 3 }}>*</Text>
                            </View>
                        }
                        options={replyOptions}
                        onValueChange={setSelectedReply}
                        placeholder="Select Reply"
                        value={selectedReply}
                    />
                    {errors.reply    && (
                        <Text className="text-red-500 font-normal text-[12px]">{errors.reply  }</Text>
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


                     {(selectedMode?.name === 'Email' || selectedMode?.name === 'WhatsApp') && (
                            <View>
                            <CheckboxWithLabel
                                label={`Send to ${selectedMode.name}`}
                                value={checkboxStatus}
                                onToggle={() => setCheckboxStatus(prev => (prev === 1 ? 0 : 1))}
                            />
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
                           
                    )}
                    {options.stage.find(opt => opt.value === formValues.stage)?.label === 'Field Visit' && (
                    <View className="p-4">
                        <View className="flex-row items-center mb-2">
                                <CheckboxWithLabel
                                                    label={`Add Area Dimension Details`}
                                                    value={messurement}
                                                    onToggle={() => setMessurement(prev => (prev === 1 ? 0 : 1))}
                                                />
                        </View> 
                        {messurement === 1 && (
                        <View className="flex-row flex-wrap justify-between">
                            {['length', 'width', 'height'].map((field) => (
                            <View key={field} className="w-[48%] mb-4">
                            <Text style={{ color: '#000', fontSize: 12,marginBottom:4 }}>
                                {field} <Text className="text-red-500">*</Text>
                                </Text>
                                <TextInputBox
                                keyboardType="numeric"
                                value={formValues[field]}
                                onChangeText={(text) => handleChange(field, text)}
                                />
                                {errors[field] && (
                                        <Text className="text-red-500 text-xs mt-1">{errors[field]}</Text>
                                    )}
                            </View>
                            ))}

                            {/* Unit */}
                            <View className="w-[48%] mb-4">
                            <DropdownPickerBox
                                            label={
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text style={{ fontSize: 10, color: '#000' }}>Unit</Text>
                                                    <Text style={{ color: 'red', marginLeft: 3 }}>*</Text>
                                                </View>
                                            }
                                            options={unitOptions}
                                             placeholder="Select Unit"
                                            value={formValues.unit}
                                            onValueChange={handleUnitCheange}


                                        />
                                        {errors.unit   && (
                                            <Text className="text-red-500 font-normal text-[12px]">{errors.unit  }</Text>
                                        )}
                            </View>
                         </View>
                        )}
                        </View>
                    )}
 


                 
                    {(selectedMode?.name === 'Direct' ) && (

                            <View className="p-4"> 
                            <View style={{ height: 300, marginVertical: 10 }}>
                            <MapView
                                provider={PROVIDER_GOOGLE}
                                style={{ flex: 1 }}
                                region={{
                                latitude: selectedLocation.latitude,
                                longitude: selectedLocation.longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                                }}
                                onPress={(event) => {
                                        const { latitude, longitude } = event.nativeEvent.coordinate;
                                         setSelectedLocation({ latitude, longitude });
                                        }}
                                pointerEvents="auto"
                            >
                                <Marker coordinate={selectedLocation} />
                            </MapView>
                            </View>
                        </View>
                        )}
                        {errors.location      && (
                         <Text className="text-red-500 font-normal text-[12px]">{errors.location    }</Text>
                          )}

                     

                    {/* Buttons */}
                    <View className="flex-row justify-between mt-4">
                        <TouchableOpacity className="bg-gray-400 px-6 py-2 rounded-md" onPress={() => navigation.navigate('TaskList')}>
                            <Text className="text-white font-semibold text-sm">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-blue-600 px-6 py-2 rounded-md" onPress={handleSubmit}>
                            <Text className="text-white font-semibold text-sm">Add Activity</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </Container>
            ) : (
                  <View className="flex-1 bg-white">
                                                  
                       <FlatList
                            data={tasks}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{ padding: 16 }}
                             renderItem={({ item }) => (
                                    <ScheduleRowItem
                                          item={item}
                                          isExpanded={expandedId === item.id}
                                           onPress={() => handlePress(item.id)}
                                          />
                                           )}
                                                    />
                                                </View>
                             )}
          
            <CustomFooter />
        </View>
    );
}

export default AddSettlement;
