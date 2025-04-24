import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, Pressable } from "react-native";
import SmsIcon from "../../assets/svg-component/SmsIcon";
import CustomButton from "../../component/Button/CustomButton";
import RightArrowIcon from "../../assets/svg-component/RightArrowIcon";
import ResetPasswordModal from "./ResetPasswordModal";

export default function ForgotPasswordModal() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isResetModalVisible, setIsResetModalVisible] = useState(false);
  return (
    <View>
      <TouchableOpacity>
        <Text
          className="text-custom-hyperlink text-base underline"
          onPress={() => {
            setModalVisible(true);
            setIsResetModalVisible(false);
          }}
        >
          Forgot Password?
        </Text>
      </TouchableOpacity>
      {isResetModalVisible && 
      <ResetPasswordModal
        closeModal={() => {
          setModalVisible(false);
          setIsResetModalVisible(false);
        }}
      />}
      {!isResetModalVisible && (
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
              opacity: 0.9,
            }}
          >
            <View className="w-4/5 p-6 bg-white rounded-lg shadow-lg">
              <Pressable
                onPress={() => setModalVisible(false)}
                className="absolute top-6 right-4"
              >
                <Text className="text-custom-heading text-xl font-bold">×</Text>
              </Pressable>

              <Text className="text-xl font-semibold text-custom-heading text-center mb-4">
                Forgot Password?
              </Text>

              <View className="flex-row items-center space-x-1 mb-2">
                <SmsIcon />
                <Text className="text-custom-hyperlink font-semibold text-base">
                  Reset via SMS
                </Text>
              </View>

              <Text className="text-custom-companytxt text-base font-normal mb-6">
                You will receive a verification code via SMS, enabling you to
                set a new password.
              </Text>

              <CustomButton
                 title=" CONFIRM "
                onPress={() => setIsResetModalVisible(true)}
              />

              <Text className="text-center text-custom-heading mt-4 text-sm font-normal">
                Remember Password?{" "}
                <Text
                  onPress={() => setModalVisible(false)}
                  className="text-custom-red underline"
                >
                  Login
                </Text>
              </Text>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
