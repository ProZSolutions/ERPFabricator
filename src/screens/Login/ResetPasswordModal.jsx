import React, { useState } from "react";
import { Modal, View, Text } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import PasswordInputBox from "../../component/PasswordInputBox/PasswordInputBox";
import PasswordLockIcon from "../../assets/svg-component/PasswordLockIcon";
import CustomButton from "../../component/Button/CustomButton";
import RightArrowIcon from "../../assets/svg-component/RightArrowIcon";
import CloseIcon from "../../assets/svg-component/CloseIcon";

export default function ResetPasswordModal({ closeModal = () => {} }) {
  const [isModalVisible, setModalVisible] = useState(true);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isModalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
          opacity: 1,
          width: "100%",
        }}
      >
        <View
          style={{ width: "95%" }}
          className="p-4 bg-white rounded-lg shadow-lg"
        >
          <View className="flex-row items-center mb-4">
            <Text className="text-xl font-semibold text-custom-heading text-center w-4/5">
              Reset Password?
            </Text>

            <View className="w-1/5 flex-row justify-end">
              <CloseIcon
                onPress={() => {
                  setModalVisible(false);
                  closeModal();
                }}
              />
            </View>
          </View>

          <Text className="text-custom-companytxt mb-4 text-sm font-normal">
            Enter the 6-digit OTP received on the phone number
          </Text>

          <View className="flex-row  mb-4">
            <OtpInput
              numberOfDigits={6}
              onTextChange={(text) => console.log(text)}
            />
          </View>

          <View className="flex-row justify-end items-center mb-4">
            <Text className="text-custom-red text-base font-normal underline">
              Resend Code
            </Text>
            <Text className="text-custom-heading text-base font-normal ml-1">
              (01:30 min)
            </Text>
          </View>
          <View>
            <PasswordInputBox
              onChangeText={setPassword}
              value={password}
              lockIcon={<PasswordLockIcon />}
              errorMessage={passwordError}
              placeholder="New Password"
            />
          </View>

          <View className="mb-4">
            <PasswordInputBox
              onChangeText={setPassword}
              value={password}
              lockIcon={<PasswordLockIcon />}
              errorMessage={passwordError}
              placeholder="Confirm Password"
            />
          </View>

          <CustomButton
             title=" SUBMIT "
            onPress={() => {
              setModalVisible(false);
              closeModal();
            }}
          />
        </View>
      </View>
    </Modal>
  );
}
