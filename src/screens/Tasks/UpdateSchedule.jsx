import React, { useEffect, useState } from 'react';
import { Alert, Pressable, Text, View, TouchableOpacity ,Dimensions} from 'react-native';
import CustomHeader from '../../component/Header/CustomHeader';
import Container from '../../component/Container/Container';
import CustomFooter from '../../component/Footer/CustomFooter';
import DropdownPickerBox from '../../component/DropdownBox/DropdownPickerBox';
import TextInputBox from '../../component/TextInputBox/TextInputBox';
import CustomDateTimePicker from '../../component/DateTimePicker/CustomDateTimePicker';
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
import { styled } from 'nativewind';
const StyledButton = styled(TouchableOpacity);
import  CheckboxWithLabel from '../../component/Checkbox/CheckboxWithLabel';
import MapView, { Marker,PROVIDER_GOOGLE } from 'react-native-maps';
import { PermissionsAndroid ,Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';



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

    const [checkboxStatus, setCheckboxStatus] = useState(0); // 0 = unchecked, 1 = checked
    const [inquiryOptions, setInquiryOptions] = useState([]);
    const [replyOptions, setReplyOptions] = useState([]);

    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [selectedReply, setSelectedReply] = useState(null);



    const shouldShowForm = details?.is_update === 1 && details?.is_completed === 0;

    const [formValues, setFormValues] = useState({
        uuid: null,
        stage: null,
        date: null,
        details: '',
        file_url: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (details) {
            setFormValues((prev) => ({
                ...prev,
                uuid: details.uuid || null,
                // Removed hardcoded stage to prevent overriding
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
         setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handlePress = (event) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        console.log("onclick",latitude+" "+longitude);
        setSelectedLocation({ latitude, longitude });
        onLocationSelect({ latitude, longitude });
      };
    const handleSubmit = async () => {
        if (!validateForm()) {
            console.log('Validation errors:', errors);
            return;
        }

        setLoading(true);
        try {
            const requestPayload = {
                uuid: details.uuid,
                file_url: formValues.file_url,
                update_status: formValues.stage,
                notes: formValues.notes,
                date: moment(formValues.date ? new Date(formValues.date) : new Date()).format("YYYY-MM-DD"),
            };
            const response = await postData('/crm/crmtaskupdate-create', requestPayload);
            console.log("API Response:", response);

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
        console.log('Get current location called', Platform.OS);
    
        if (Platform.OS === 'android') {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
    
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              console.log('Permission granted');
    
              Geolocation.getCurrentPosition(
                (position) => {
                    console.log(" location params ",position);
                  console.log('Current location:', position.coords.latitude+" lng "+position.coords.longitude);
                /*  setSelectedLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                  }); */
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
                  console.log('Current location:', position);
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
                            value: item.uuid,
                            meta: { id: item.id },
                        }));
                    setOptions(prev => ({ ...prev, stage: formattedOptions }));

                    // Set default stage value after options are loaded
                    if (details?.stages_id) {
                            console.log("Trying to set default stage from stages_id:", details.stages_id);
 
                        const matchedOption = formattedOptions.find(opt => opt.meta?.id === details.stages_id);
                        if (matchedOption) {
                            console.log("Matched default option:", matchedOption);

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
        
    }, [details]);

    return (
        <View className="flex-1 bg-white">
            <CustomHeader name="Task Details" isBackIcon />
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
                                    setCheckboxStatus(0); // reset checkbox when selecting a new mode
                                }}

                                >
                                <Text className="text-green-600 font-medium text-[12px]">
                                    {item.name}
                                </Text>
                                </TouchableOpacity>
                            ))}
                     </View>
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

                    {/* Reply Dropdown */}
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
                    


                    {/* Description */}
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
                                        console.log("Map pressed:", latitude, longitude);
                                        setSelectedLocation({ latitude, longitude });
                                        }}
                                pointerEvents="auto"
                            >
                                <Marker coordinate={selectedLocation} />
                            </MapView>
                        </View>

                     

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
            <CustomFooter />
        </View>
    );
}

export default AddSettlement;
