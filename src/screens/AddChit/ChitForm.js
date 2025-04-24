// src/screens/AddChit/ChitForm.js
import React from "react";
import { View, Text, Switch } from "react-native";
import RightArrowIcon from "../../assets/svg-component/RightArrowIcon";
import CustomDatePicker from "../../component/DatePicker/CustomDatePicker";
import DropdownBox from "../../component/DropdownBox/DropdownBox";
import TextInputBox from "../../component/TextInputBox/TextInputBox";
import DurationSelector from "../../component/DurationSelector/DurationSelector";
import DropdownPickerBox from "../../component/DropdownBox/DropdownPickerBox";
import CustomButton from "../../component/Button/CustomButton";

const ChitForm = ({
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
  initialAmountOptions,
  increaseIntervals,
  decreaseIntervals,
  increaseCompletedMonth,
  decreaseCompletedMonth,
  isExistingChit
}) => {
  const getSelectedInitialAmountText = () => {
    const find = initialAmountOptions.find(
      (item) => item.value === formValues.initialAmount
    );
    return find?.label || "Select";
  };

  const getSelectedChitReceivingText = () => {
    const find = chitReceivingMonthOptions.find(
      (item) => item.value === formValues.chitReceivingMonth
    );
    return find?.label || "Select";
  };

  return (
    <View className="px-2 mb-4">
      <TextInputBox
        required={true}
        placeholder="Chit Name"
        label="Chit Name"
        value={formValues.chitName}
        onChangeText={(text) => handleValueChange("chitName", text)}
        errorMessage={errors.chitName}
        editable={true}
      />

      <CustomDatePicker
        date={formValues.startDate}
        onChangeTxt={(value) => handleValueChange("startDate", value)}
        placeholder="Start Date"
        label="Start Date"
        required={true}
        editable={true}
        rightIcon={true}
        errorMessage={errors.startDate}
        minDate={minDate}
        maxDate={maxDate}
      />

      <DropdownBox
        label="Chit Type"
        options={chitTypeOptions}
        onValueChange={(value) => handleValueChange("chitType", value)}
        placeholder={{}}
        value={formValues.chitType}
        errorMessage={errors.chitType}
      />

      <TextInputBox
        required={true}
        placeholder="Total Chit Amount"
        label="Total Chit Amount ⟨₹)"
        value={formValues.totalChitValue}
        onChangeText={(text) => handleValueChange("totalChitValue", text)}
        errorMessage={errors.totalChitValue}
        editable={true}
        isCurrency={true}
        keyboardType="numeric"
      />

      <DurationSelector
        label="Number of Months"
        months={formValues.months}
        decreaseMonths={decreaseMonths}
        increaseMonths={increaseMonths}
        errorMessage={errors.months}
        disabledIncrease={formValues.months <= 6}
        disabledDecrease={formValues.months >= 24}
      />

      <DurationSelector
        label="Number of Intervals"
        months={formValues.intervals}
        decreaseMonths={decreaseIntervals}
        increaseMonths={increaseIntervals}
        errorMessage={errors.intervals}
        disabledIncrease={formValues.intervals <= 1}
        disabledDecrease={formValues.intervals >= 6}
      />
      {isExistingChit && (
         <DurationSelector
         label="Completed Months"
         months={formValues.completedMonth}
         decreaseMonths={decreaseCompletedMonth}
         increaseMonths={increaseCompletedMonth}
         errorMessage={errors.completedMonth}
         //disabledIncrease={formValues.intervals <= 1}
       //  disabledDecrease={formValues.intervals >= 6}
       />
      )}
      <View className="mb-4">
        <View className="flex-row space-x-2">
        <View className="w-[70%]">
            <TextInputBox
              required={true}
              placeholder="Interest Amount"
              label="Interest Amount"
              value={formValues.interestAmount}
              onChangeText={(text) => handleValueChange("interestAmount", text)}
              editable={true}
              isCurrency={true}
              mb={""}
              keyboardType="numeric"
            />
          </View>
          <View className="w-[30%]">
            <TextInputBox
              required={true}
              placeholder="Interest %"
              label="Interest %"
              value={formValues.interest}
              onChangeText={(text) => handleValueChange("interest", text)}
              editable={true}
              isPercentage={true}
              mb={""}
              keyboardType="numeric"
            />
          </View>
        
        </View>
        {errors.interest && (
          <View className="flex-row w-[100%]">
            <Text className="text-red-500 font-normal text-[12px]">
              {errors.interest}
            </Text>
          </View>
        )}
      </View>

      {formValues.dividend_after_chit == 0 && (
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xs font-normal text-black">
            Dividend After Chit Taken
          </Text>
          <Switch
            value={formValues.isDividend}
            onValueChange={(value) => handleSwitchChange("isDividend", value)}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={"#f4f3f4"}
          />
        </View>
      )}

      {formValues.is_auction == 0 && (
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xs font-normal text-black">Auction</Text>
          <Switch
            value={formValues.isAuction}
            onValueChange={(value) => handleSwitchChange("isAuction", value)}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={"#f4f3f4"}
          />
        </View>
      )}
      {formValues.chitType != 5 && (
        <View>
          <TextInputBox
            required={true}
            placeholder="Auction Interval"
            label="Auction Interval"
            value={formValues.multipleAuctionValue}
            onChangeText={(text) =>
              handleValueChange("multipleAuctionValue", text)
            }
            errorMessage={errors.multipleAuctionValue}
            editable={true}
            keyboardType="numeric"
          />

          <View className="mb-4">
            <DropdownPickerBox
              required={true}
              label="Auction Starts From "
              options={[
                { label: "Min Auction Amount", value: 1 },
                { label: "Max Auction Amount", value: 2 },
              ]}
              onValueChange={(value) =>
                handleValueChange("initialAmount", value)
              }
              placeholder={
                formValues.initialAmount === null
                  ? "Select Initial Amount"
                  : getSelectedInitialAmountText()
              }
              value={formValues.initialAmount}
              mb=""
            />
            {errors.initialAmount && (
              <View className="flex-row w-[100%]">
                <Text className="text-red-500 font-normal text-[12px]">
                  {errors.initialAmount}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {formValues.is_commission == 0 && (
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xs font-normal text-black">Agent</Text>
          <Switch
            value={formValues.isAgent}
            onValueChange={(value) => handleSwitchChange("isAgent", value)}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={"#f4f3f4"}
          />
        </View>
      )}

      {formValues.isAgent === true && (
        <View className="mb-4">
          <View className="flex-row space-x-2">
          <View className="w-[69%]">
              <TextInputBox
                required={true}
                placeholder="Commission Amount"
                label="Commission Amount"
                value={formValues.commisionAmount}
                onChangeText={(text) =>
                  handleValueChange("commisionAmount", text)
                }
                editable={true}
                isCurrency={true}
                mb=""
                keyboardType="numeric"
              />
            </View>
            <View className="w-[31%]">
              <TextInputBox
                required={true}
                placeholder="Commission %"
                label="Commission %"
                value={formValues.commision}
                onChangeText={(text) => handleValueChange("commision", text)}
                editable={true}
                isPercentage={true}
                mb=""
                keyboardType="numeric"
              />
            </View>
          
          </View>
          {errors.commision && (
            <View className="flex-row w-[100%]">
              <Text className="text-red-500 font-normal text-[12px]">
                {errors.commision}
              </Text>
            </View>
          )}
        </View>
      )}

      {formValues.chit_to_agent == 0 && (
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xs font-normal text-black">Agent as Member</Text>
          <Switch
            value={formValues.isChitReceiving}
            onValueChange={(value) =>
              handleSwitchChange("isChitReceiving", value)
            }
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={"#f4f3f4"}
          />
        </View>
      )}
      {formValues.isChitReceiving && (
        <View className="mb-4">
          <DropdownPickerBox
            required={true}
            label="Agent Chit Taking Month"
            options={chitReceivingMonthOptions}
            onValueChange={(value) =>
              handleValueChange("chitReceivingMonth", value)
            }
            placeholder={
              formValues.chitReceivingMonth === null
                ? "Agent Chit Taking Month"
                : getSelectedChitReceivingText()
            }
            value={formValues.chitReceivingMonth}
            mb="0"
          />
          {errors.chitReceivingMonth && (
            <View className="flex-row w-[100%]">
              <Text className="text-red-500 font-normal text-[12px]">
                {errors.chitReceivingMonth}
              </Text>
            </View>
          )}
        </View>
      )}

      <View className="w-full mt-5">
        <View className="ml-auto">
          <CustomButton
            containerClass="px-5"
             title="Save"
            onPress={handleSubmit}
          />
        </View>
      </View>
    </View>
  );
};

export default ChitForm;
