import React, { useEffect, useState,useContext } from 'react';
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
 import TextInputBox from '../../component/TextInputBox/TextInputBox';
  import handleError from '../../component/ErrorHandler/ErrorHandler';
import Spinner from '../../component/Spinner/Spinner';
 import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { BASE_URL_HRMS } from '../../api/Config';
 import { postDataHRMS } from '../../api/ApiHRMSService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../component/AuthContext/AuthContext';


function EditSchedule({ route }) {
  const { lead } = route.params || {};
  const navigation = useNavigation();
      const { logout } = useContext(AuthContext);
  

  const [selectedLocation, setSelectedLocation] = useState({
    latitude: 11.2284893,
    longitude: 78.1450853,
  });
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({ stage: [] });
  const [modes, setModes] = useState([]);
  const [selectedMode, setSelectedMode] = useState(null);
  const [errors, setErrors] = useState({});
  const [token,setToken] = useState(null);
  const [deviceId,setDeviceID]=useState(null);
  const [hasSetDefaultUnit, setHasSetDefaultUnit] = useState(false);

  const [formValues, setFormValues] = useState({
    current_password: '',
    new_password: ''
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
    if (!formValues.old) newErrors.old = 'Enter Old Password';
    if (!formValues.new) newErrors.new = 'Enter New Password';
   
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
     useEffect(() => {
          getDeviceId();
        }, []);
const getDeviceId = async () => {
        setLoading(true);
        try {
          const device_id = await AsyncStorage.getItem('device_id');
          const userInfo = await getValue('userInfohrms');  
          const bearerToken = userInfo?.bearer_token; 
          if(device_id && bearerToken){
          setToken( bearerToken);
          setDeviceID(device_id);
          }
         
          console.log(" token "," sd "+bearerToken+" device id "+device_id);
         } catch (error) {
           return null;
        }finally{
            setLoading(false);
        }
      };
      const handleLogoutAndRedirect = async () => {
  try {
    await AsyncStorage.clear();
    logout(); 
  } catch (e) {
    console.error("Error clearing AsyncStorage", e);
  }
};


const getTaskList = async () => {
      if (!validateForm()) return;

    const token_no = "Bearer " + token;

    console.log("token"," as "+token_no+" device "+deviceId);
    setLoading(true);

    try {
  
      const requestPayload = {
        current_password: formValues.old,
        new_password: formValues.new
      };
      console.log(JSON.stringify(requestPayload, null, 2));
 
       const userInfoStr = await AsyncStorage.getItem('userInfohrms');
        const deviceId = await AsyncStorage.getItem('device_id');
         const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
        const bearerToken = userInfo?.bearer_token;
       const url = `https://erphrms.proz.in/api/change-password`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
              'device_id': deviceId,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });

      const result = await response.json();
      if (response.status === 200 && result.status === 'success') {
         Alert.alert("Success", "Password Changed Successfully!!!.", [
          { text: "OK", onPress: () => {
                    handleLogoutAndRedirect(); // Call separate async function

          }
            
          },
        ]);
      } else {
         
      }
    } catch (error) {
      console.error("Error fetching task list", error);
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
       
      const requestPayload = {
        current_password: formValues.old,
        new_password: formValues.new
      };
      console.log(JSON.stringify(requestPayload, null, 2));
 

      const response = await postDataHRMS('/change-password', requestPayload);
      console.log("response.status "," "+response.status );
      if (response.status === "success") {
        Alert.alert("Success", "Password Changed Successfully!!!.", [
          { text: "OK", onPress: () => {
                    handleLogoutAndRedirect(); // Call separate async function

          }
            
          },
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



  

  return (
    <View className="flex-1 bg-white">
      <CustomHeader name={"Change Password"} isBackIcon />
      <Container paddingBottom={110}>
        <View style={{ marginTop: -15 }}>
          <Spinner visible={loading} textContent="Loading..." />

       
      
 

      
          


           <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 5 }}>
            <FontAwesome name="file-text" size={13} color="#000" style={{ marginRight: 6 }} />
            <Text style={{ color: '#000', fontSize: 12 }}> Old Password </Text>
            <Text style={{ color: 'red', marginLeft: 3 }}>*</Text>
          </View>
          <TextInputBox
            placeholder="Old Password"
            value={formValues.old}
            onChangeText={(text) => handleValueChange('old', text)}
            errorMessage={errors.old}
            multiline={true}
            numberOfLines={1}
            textAlignVertical="top"
          />
           

           <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 5 }}>
            <FontAwesome name="file-text" size={13} color="#000" style={{ marginRight: 6 }} />
            <Text style={{ color: '#000', fontSize: 12 }}> New Password </Text>
            <Text style={{ color: 'red', marginLeft: 3 }}>*</Text>
          </View>
          <TextInputBox
            placeholder="New Password"
            value={formValues.new}
            onChangeText={(text) => handleValueChange('new', text)}
            errorMessage={errors.new}
            multiline={true}
            numberOfLines={1}
            textAlignVertical="top"
          />
    
              <View className="flex-row justify-between mt-4">
                <TouchableOpacity className="bg-gray-400 px-6 py-2 rounded-md" onPress={() => navigation.navigate('ProfileDetails')}>
                  <Text className="text-white font-semibold text-sm">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-blue-600 px-6 py-2 rounded-md" onPress={getTaskList}>
                  <Text className="text-white font-semibold text-sm">Change Password</Text>
                </TouchableOpacity>
              </View>
 
        </View>
      </Container>
      <CustomFooter isTask={true} />
    </View>
  );
}

export default EditSchedule;
