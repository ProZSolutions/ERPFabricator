import { View, Text, TouchableOpacity, Alert } from "react-native";
import CheckBox from '@react-native-community/checkbox';
import { useContext, useState } from "react";
import TextInputBox from "../../component/TextInputBox/TextInputBox";
import PasswordInputBox from "../../component/PasswordInputBox/PasswordInputBox";
import CustomButton from "../../component/Button/CustomButton";
import PhoneIcon from "../../assets/svg-component/PhoneIcon";
import PasswordLockIcon from "../../assets/svg-component/PasswordLockIcon";
import LoginButtonArrowIcon from "../../assets/svg-component/LoginButtonArrowIcon";
import { useNavigation } from "@react-navigation/native";
import { postData } from "../../api/ApiService";
import {postDataHRMS} from "../../api/ApiHRMSService";
import Spinner from "../../component/Spinner/Spinner";
import { AuthContext } from "../../component/AuthContext/AuthContext";
import ForgotPasswordModal from "./ForgotPasswordModal";
import DeviceInfo from 'react-native-device-info';

import AsyncStorage from '@react-native-async-storage/async-storage';
 

function SignInForm() {
  const [isChecked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigation = useNavigation();
  const { setUserInfo } = useContext(AuthContext);
  const [device,setDevice]= useState(null);
  const { setUserInfoHRMS } = useContext(AuthContext);

  const validateInputs = () => {
    let isValid = true;
    setUsernameError("");
    setPasswordError("");

   

    if (!username) {
      setUsernameError("Username is required");
      isValid = false;
    } 

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    }

    return isValid;
  };

  function generateRandomString(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

const sampleLogin = async (ndevice_id) => {
  const device = ndevice_id; // Make sure ndevice_id is passed correctly
  try {
    setIsLoading(true);

    const requestPayload = {
      username: username,
      password: password,
      device_id: device
    };

    console.log("Sending login payload:", JSON.stringify(requestPayload, null, 2));

    const url = `https://erphrms.proz.in/api/login`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'device_id': device || '',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    const result = await response.json();

    if (response.status === 200 && result.status === 'success') {
      await setUserInfoHRMS(result);

      if (device) {
        await AsyncStorage.setItem('device_id', device);
        console.log('Device ID saved to AsyncStorage:', device);
      } else {
        console.warn('Device ID is null or undefined. Skipping save.');
      }

      navigation.navigate('Home');
    } else {
      console.warn('HRMS Login Failed:', result.message || 'Unknown error');
    }
  } catch (error) {
    console.error("Error fetching task list", error);
  } finally {
    setIsLoading(false);
  }
};


const loginHandler = async () => {
  if (!validateInputs()) return;
 

  // 📌 Generate or override device_id
   // <- Make sure this is a **function call**
    let device_id1 =DeviceInfo.getUniqueId();
    let device_id = device_id1._j;
    if(device_id===null){
      device_id = generateRandomString(); 
    }

  const storedId = await AsyncStorage.getItem('device_id');
    if (storedId !== null) {
      device_id =storedId;
    }
    console.log(" device  id as "+device_id+" stored id "+storedId);


// let device_id =DeviceInfo.getUniqueId();

 // device_id="3Z1n";
        setDevice(device_id);

 /* if (username === 'AV-001') {
    device_id = 'axxx';
  } else if (username === 'AV-02') {
    device_id = 'sdgs';
  }  */

  console.log("Generated Device ID:", device_id);

  // ✅ Step 1: Login to HRMS
  
  
   try {
    setIsLoading(true);
    const appPayload = { username, password, device_id };
    const appResponse = await postData('/mobilelogin', appPayload);
          await AsyncStorage.setItem('device_id', device_id);
          setDevice(device_id);

    if (appResponse?.status === 'success') {

      console.log('Main App Login Successful:', appResponse);
      await setUserInfo(appResponse);
      sampleLogin(device_id);
     // await setUserInfoHRMS(hrmsResponse);

    } else {
      Alert.alert('Login failed', appResponse?.message || 'Unknown error');
    }

  } catch (error) {
    if (error?.response?.data?.status === 'error') {
      Alert.alert('Error', error?.response?.data?.error || 'An error occurred.');
    } else {
      await handleError(error, false);
    }
  } finally {
    setIsLoading(false);
  }
};

  return (
    <View className="flex-1 justify-center items-center bg-white">

    <View className="w-80  px-3">

      <Spinner visible={isLoading} textContent="Logging in..." />

      <View className="mb-3">
        <TextInputBox
          icon={<PhoneIcon />}
          required={true}
          placeholder="Username"
          value={username}
          onChangeText={(text) => {
       const filteredText = text
      .toUpperCase()
      .replace(/[^A-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g, '');

    // Only update if value has changed to avoid redundant re-renders
    if (filteredText !== username) {
      setUsername(filteredText);
    }
    }}
           errorMessage={usernameError}
          editable={true}
        />

      </View>
      <View>
        <PasswordInputBox
          onChangeText={setPassword}
          value={password}
          lockIcon={<PasswordLockIcon />}
          errorMessage={passwordError}
        />
      </View>

    

      <View className="w-1/2 mx-auto">
        <CustomButton
          icon={<LoginButtonArrowIcon />}
          title="LOGIN"
          onPress={loginHandler} />
      </View>
    </View>
    </View>
  );
}

export default SignInForm;
