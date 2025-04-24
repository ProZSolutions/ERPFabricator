import React, { useState,useEffect } from "react";
import CommonForm from "./CommonForm";
import OtpPopup from "../OTP/OtpPopup";
import Spinner from "../../component/Spinner/Spinner";
import useForm from "./useForm";
import { submitForm } from "./submitForm";
import { View } from "react-native";
import moment from "moment";

const AgentForm = () => {
  const initialFormData = {
    name: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    dob: null,
    gender: "",
    address: "",
    city: "",
    companyName: "",
    registrationDetails: "",
    attachedDocuments: "",
    document: "",
    agentType: "",
  };
  const baseRequiredFields  = [
    "name",
    "mobileNumber",
    "password",
    "confirmPassword",
    "dob",
    "gender",
    "address",
    "city",
    "agentType"
   ];
   const [requiredFields, setRequiredFields] = useState(baseRequiredFields);


  const { formData, handleInputChange, formErrors, validateForm } = useForm(
    initialFormData,
    requiredFields
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [fromRes, setFormRes] = useState("");
  useEffect(() => {
    if (formData.agentType === "finance") {
      setRequiredFields([
        ...baseRequiredFields,
        "companyName",
        "registrationDetails"
      ]);
    } else {
      setRequiredFields(baseRequiredFields);
    }
  }, [formData.agentType]);

  const onSaveHandler = async () => {
    if (validateForm()) {
      const requestData = {
        ...formData,
        type: "agent",
        contact: formData.mobileNumber,
        company_name: formData.companyName,
        registration_details: formData.registrationDetails,
        confirm_password: formData.confirmPassword,
        agent_type: formData.agentType,  
        dob:moment(new Date(formData.dob)).format("YYYY-MM-DD")
      };
      await submitForm(requestData, setIsLoading, setModalVisible, setFormRes);
    }
  };

  return (
    <View>
      <Spinner visible={isLoading} textContent="Registration in-progress..." />
      <CommonForm
        formData={formData}
        handleInputChange={handleInputChange}
        isAgent={true}
        onSaveHandler={onSaveHandler}
        formErrors={formErrors}
      />
      {isModalVisible && (
        <OtpPopup
          data={fromRes}
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
        />
      )}
    </View>
  );
};

export default AgentForm;
