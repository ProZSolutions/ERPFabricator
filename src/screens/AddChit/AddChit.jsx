
import React from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ChitForm from "./ChitForm";
import useAddChit from "./useAddChit";
import CustomHeader from "../../component/Header/CustomHeader";
import Container from "../../component/Container/Container";
import Spinner from "../../component/Spinner/Spinner";
import CustomFooter from "../../component/Footer/CustomFooter";

const AddChit = ({ route }) => {
  const { isExistingChit = false, isUpdate = false, updateChitId = null } = route.params || {};
   
  const navigation = useNavigation();
  const {
    isLoading,
    formValues,
    errors,
    handleSwitchChange,
    handleValueChange,
    increaseMonths,
    decreaseMonths,
    chitTypeOptions,
    chitReceivingMonthOptions,
    handleSubmit,
    minDate,
    maxDate,
    increaseIntervals,
    decreaseIntervals,
    increaseCompletedMonth,
    decreaseCompletedMonth
  } = useAddChit(navigation, isExistingChit, isUpdate, updateChitId);

  const initialAmountOptions = [
    { label: "Min Auction Amount", value: 1 },
    { label: "Max Auction Amount", value: 2 },
  ];

  return (
    <View className="flex-1 bg-white">
      <CustomHeader name="Add Chit" isBackIcon={true} />

      <Container paddingBottom={80} marginTop={-20}>
        <Spinner visible={isLoading} textContent="Processing..." />
        <ChitForm
          formValues={formValues}
          errors={errors}
          handleSwitchChange={handleSwitchChange}
          handleValueChange={handleValueChange}
          increaseMonths={increaseMonths}
          decreaseMonths={decreaseMonths}
          increaseIntervals={increaseIntervals}
          decreaseIntervals={decreaseIntervals}
          increaseCompletedMonth = {increaseCompletedMonth}
          decreaseCompletedMonth = {decreaseCompletedMonth}
          chitTypeOptions={chitTypeOptions}
          chitReceivingMonthOptions={chitReceivingMonthOptions}
          handleSubmit={handleSubmit}
          minDate={minDate}
          maxDate={maxDate}
          initialAmountOptions={initialAmountOptions}
          isExistingChit = {isExistingChit}
        />
      </Container>

      <CustomFooter />
    </View>
  );
};

export default AddChit;

