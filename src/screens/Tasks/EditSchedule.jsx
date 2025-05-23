import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Switch,
  TextInput,
  ActivityIndicator,
  FlatList,
  PermissionsAndroid,
  Platform,
} from 'react-native';
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
import CheckboxWithLabel from '../../component/Checkbox/CheckboxWithLabel';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import ScheduleRowItem from './ScheduleRowItem';

function EditSchedule({ route }) {
  const { lead } = route.params || {};
  const navigation = useNavigation();

  const [selectedLocation, setSelectedLocation] = useState({
    latitude: 11.2284893,
    longitude: 78.1450853,
  });
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({ stage: [] });
  const [modes, setModes] = useState([]);
  const [selectedMode, setSelectedMode] = useState(null);
  const [errors, setErrors] = useState({});
  const [hasSetDefaultUnit, setHasSetDefaultUnit] = useState(false);

  const [formValues, setFormValues] = useState({
    date: '',
    stage: '',
    mode: '',
    notes: '',
    unit: '',
    reschedule_reason:'',
    uuid:'',
    lead_id:''
  });

  const handleValueChange = (name, value) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (name === 'stage') {
      setFormValues((prev) => ({ ...prev, pipeline_id: value }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formValues.date) newErrors.date = 'Please select date.';
    if (!formValues.stage) newErrors.stage = 'Please select status.';
    if (!formValues.mode) newErrors.mode = 'Please select Mode of Communication.';
    if(!formValues.reschedule_reason) newErrors.reschedule_reason ='Please enter reschedule reason';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
const parsedDate = new Date(formValues.date);
      const formattedDate = isNaN(parsedDate.getTime())
  ? moment().format("YYYY-MM-DD HH:mm:ss")
  : moment(parsedDate).format("YYYY-MM-DD HH:mm:ss");
      const requestPayload = {
        lead_id: lead.id,
        notes: formValues.notes,
        date: moment(formValues.date ? new Date(formValues.date) : new Date()).format("YYYY-MM-DD HH:mm:ss"),
        mode_communication: selectedMode?.id,
        pipeline_id: formValues.stage,
        reschedule_reason:formValues.reschedule_reason,
        uuid:lead.uuid
      };
                   console.log(JSON.stringify(requestPayload, null, 2));


      const response = await postData(`${BASE_URL_TESTING}schedule-update`, requestPayload);
      if (response.status === "success") {
        Alert.alert("Success", "Reschedule  Submitted Successfully!!!.", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
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
              Alert.alert('Error', 'Unable to fetch location');
            },
            {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 10000,
              forceRequestLocation: true,
              showLocationDialog: true,
            }
          );
        } else {
          Alert.alert('Permission Denied', 'Location permission is required');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      Geolocation.requestAuthorization('whenInUse').then((result) => {
        if (result === 'granted') {
          Geolocation.getCurrentPosition(
            (position) => {
              setSelectedLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            (error) => {
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

   const fetchStageOptions = async () => {
    try {
      const response = await postData(`${BASE_URL_TESTING}leadstage`, {});
      if (response?.status === 'success' && Array.isArray(response.data)) {
        const formattedOptions = response.data
          .filter(item => item.name !== 'New')
          .map(item => ({ label: item.name, value: item.id, meta: { id: item.uuid } }));

        setOptions(prev => ({ ...prev, stage: formattedOptions }));

        // 🟢 Set stage from lead if available
        if (lead?.stages_id) {
          const matchedOption = formattedOptions.find(opt => opt.value === lead.stages_id);
          if (matchedOption) {
            setFormValues(prev => ({ ...prev, stage: matchedOption.value }));
          }
        }
      }
    } catch (error) {
      await handleError(error);
    }
  };

  const fetchModes = async () => {
    try {
      const response = await postData(`${BASE_URL_TESTING}leadsource`, {});
      if (response?.status === 'success') {
        const filteredModes = response.data.filter(item => item.name !== 'New');
        setModes(filteredModes);

        // 🟢 Set mode from lead if available
        if (lead?.mode_communication) {
          const matchedMode = filteredModes.find(mode => mode.id === lead.mode_communication || mode.uuid === lead.mode_communication);
          if (matchedMode) {
            setSelectedMode(matchedMode);
            setFormValues(prev => ({ ...prev, mode: matchedMode.uuid }));
          }
        }
      }
    } catch (error) {
      await handleError(error);
    }
  };

  // 🟢 Set other form values from lead
  if (lead) {
    setFormValues(prev => ({
      ...prev,
      notes: lead.notes || '',
  date: lead.date ? new Date(lead.date) : null,
      unit: lead.unit || '',
    }));
  }

  fetchStageOptions();
  fetchModes();
  }, [lead]);

  return (
    <View className="flex-1 bg-white">
      <CustomHeader name={"Reschedule "} isBackIcon />
      <Container paddingBottom={110}>
        <View style={{ marginTop: -15 }}>
          <Spinner visible={loading} textContent="Loading..." />

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

          <DropdownPickerBox
            label={
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome name="exchange" size={13} color="#000" style={{ marginRight: 6 }} />
                <Text style={{ fontSize: 12, color: '#000' }}>Mode of communication</Text>
                <Text style={{ color: 'red', marginLeft: 3 }}>*</Text>
              </View>
            }
            options={modes.map((item) => ({ label: item.name, value: item.uuid }))}
            onValueChange={(value) => {
              const selected = modes.find(item => item.uuid === value);
              setSelectedMode(selected);
              handleValueChange('mode', value);
            }}
            placeholder="Select Mode"
            value={selectedMode?.uuid}
          />
          {errors.mode && (
            <Text className="text-red-500 font-normal text-[12px]">{errors.mode}</Text>
          )}

          


           <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 5 }}>
            <FontAwesome name="file-text" size={13} color="#000" style={{ marginRight: 6 }} />
            <Text style={{ color: '#000', fontSize: 12 }}> Reschedule Reason </Text>
            <Text style={{ color: 'red', marginLeft: 3 }}>*</Text>
          </View>
          <TextInputBox
            placeholder="Reason"
            value={formValues.reschedule_reason}
            onChangeText={(text) => handleValueChange('reschedule_reason', text)}
            errorMessage={errors.reschedule_reason}
            multiline={true}
            numberOfLines={5}
            textAlignVertical="top"
          />
           

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

          <View className="flex-row justify-between mt-4">
            <TouchableOpacity className="bg-gray-400 px-6 py-2 rounded-md" onPress={() => navigation.navigate('LeadList')}>
              <Text className="text-white font-semibold text-sm">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-blue-600 px-6 py-2 rounded-md" onPress={handleSubmit}>
              <Text className="text-white font-semibold text-sm">Reschedule</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Container>
      <CustomFooter isTask={true} />
    </View>
  );
}

export default EditSchedule;
