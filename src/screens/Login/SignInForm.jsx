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

  function generateRandomString(length = 4) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
const loginHandler = async () => {
  if (!validateInputs()) return;
 

  // 📌 Generate or override device_id
  let device_id = generateRandomString(); // <- Make sure this is a **function call**
  if (username === 'AV-001') {
    device_id = 'axxx';
  } else if (username === 'AV-02') {
    device_id = 'sdgs';
  }

  console.log("Generated Device ID:", device_id);

  // ✅ Step 1: Login to HRMS
  try {
    const hrmsPayload = { username, password, device_id };
    const hrmsResponse = await postDataHRMS('/login', hrmsPayload);

    if (hrmsResponse?.status === 'success') {
      console.log('HRMS Login Successful:', hrmsResponse);
      await setUserInfoHRMS(hrmsResponse);
    } else {
      console.warn('HRMS Login Failed:', hrmsResponse?.message);
    }

    // Save device ID (once is enough)
    await AsyncStorage.setItem('device_id', device_id);
    console.log('Device ID saved to AsyncStorage:', device_id);

  } catch (error) {
    console.error('HRMS Login Error:', error);
    // optional: show an error or silently continue
  }

   try {
    setIsLoading(true);
    const appPayload = { username, password, device_id };
    const appResponse = await postData('/mobilelogin', appPayload);
          await AsyncStorage.setItem('device_id', device_id);

    if (appResponse?.status === 'success') {

      console.log('Main App Login Successful:', appResponse);
      await setUserInfo(appResponse);
      navigation.navigate('Home');
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
        .toUpperCase() // convert to uppercase
        .replace(/[^A-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g, ''); // allow only A-Z, 0-9, symbols
         setUsername(filteredText);
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
