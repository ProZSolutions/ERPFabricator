import React, { useState, useEffect, useContext,useRef } from "react";
import { View, Text, Alert } from "react-native";
import Modal from "react-native-modal";
import { styled } from "nativewind";
import { OtpInput } from "react-native-otp-entry";
import CustomButton from "../../component/Button/CustomButton";
import RightArrowIcon from "../../assets/svg-component/RightArrowIcon";
import OtpHeader from "./OtpHeader";
import OtpFooter from "./OtpFooter";
import { useNavigation } from "@react-navigation/native";
import handleError from "../../component/ErrorHandler/ErrorHandler";
import Spinner from "../../component/Spinner/Spinner";
import { postData } from "../../api/ApiService";
import { AuthContext } from "../../component/AuthContext/AuthContext";

const StyledView = styled(View);

const OtpPopup = ({ isVisible, onClose, data = {} }) => {
  const [resendTime, setResendTime] = useState(90);
  const navigation = useNavigation();
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
 const otpRef = useRef(null);
  const { setUserInfo } = useContext(AuthContext); 

  useEffect(() => {
    if (data?.status === "success") {
      const usernameValue = data.email || data.contact || "";
      setUsername(usernameValue);
      const digits = data?.message?.slice(-4);
      setOtp(digits);
      if (otpRef.current) {
        otpRef.current.setValue(digits);
      }
    }
  }, [data]);

  useEffect(() => {
    let timer;
    if (isVisible && resendTime > 0) {
      timer = setInterval(() => {
        setResendTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (resendTime <= 0) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isVisible, resendTime]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const otpValidationHandler = async () => {
    let req = {
      username: username,
      otp: otp,
    };

    setIsLoading(true);
    try {
      let response = await postData("/registration-verify-otp", req);
      if (response.status === "success") {
        await setUserInfo(response); 
        navigation.navigate("Home");
        onClose();
      }
    } catch (error) {
      if (error?.response?.data?.status === "error") {
        Alert.alert(
          "OPT Error",
          error?.response?.data?.error || "An error occurred."
        );
      } else {
        await handleError(error, false);
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Modal
      isVisible={isVisible}
      style={{ justifyContent: "flex-end", margin: 0 }}
      onBackdropPress={onClose}
    >
      <Spinner
        visible={isLoading}
        textContent="OTP Verification In Progress..."
      />

      <StyledView className="bg-white rounded-t-lg p-5 py-10">
        <OtpHeader onClose={onClose} />
        <StyledView className="w-4/5 mx-auto">
          <Text className="text-gray-600 text-center mt-2 mb-5">
            Enter the 4-digit OTP received on the phone number
          </Text>
        </StyledView>
        <StyledView className="w-4/5 mx-auto">
          <OtpInput
            ref={otpRef}
            numberOfDigits={4}
            onTextChange={(text) => console.log(text)}
            theme={{
             
              pinCodeTextStyle: {
                color:"black"
              },
            
            }}
          />
          
        </StyledView>


        <OtpFooter resendTime={formatTime(resendTime)} />

        <StyledView className="w-full">
          <CustomButton
            containerClass="w-[50%] mx-auto"
             title=" NEXT "
            onPress={otpValidationHandler}
          />
        </StyledView>
      </StyledView>
    </Modal>
  );
};

export default OtpPopup;
