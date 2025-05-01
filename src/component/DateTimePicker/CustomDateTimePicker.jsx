import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  Text,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { styled } from "nativewind";
import DatePickerIcon from "../../assets/svg-component/DatePickerIcon";

const StyledTextInput = styled(TextInput);
const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);

const CustomDateTimePicker = ({
  onChangeTxt = () => {},
  date,
  placeholder = "Select Date & Time",
  leftIcon = true,
  rightIcon = false,
  label = "",
  required = false,
  errorMessage = "",
  editable = false,
  minDate = null,
  maxDate = null,
}) => {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date");

  const showMode = (currentMode) => {
    if (!editable) return;
    setShow(true);
    setMode(currentMode);
  };

  const onChange = (event, selectedDate) => {
    if (selectedDate) {
      if (mode === "date") {
        setShow(Platform.OS === "ios");
        setMode("time");
        setShow(true);
        onChangeTxt(selectedDate);
      } else {
        setShow(false);
        onChangeTxt(selectedDate);
      }
    } else {
      setShow(false);
    }
  };

  const showDateTimePicker = () => showMode("date");

  return (
    <StyledView className="mb-4">
      {label ? (
        <Text style={styles.label}>
          {label}
          {required && <Text className="text-red-500 ml-1"> *</Text>}
        </Text>
      ) : null}
      <StyledView className="flex-row items-center mb-0 border border-gray-300 px-2 rounded-lg">
        <StyledTouchableOpacity
          onPress={showDateTimePicker}
          className="flex-row flex-1 items-center"
        >
          <StyledTextInput
            className="flex-1 text-xs text-black font-normal"
            placeholder={placeholder}
            editable={false}
            placeholderTextColor="#000"
            value={
              date
                ? `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`
                : ""
            }
          />
          {rightIcon && (
            <StyledView className="pl-3">
              <DatePickerIcon color="#000" />
            </StyledView>
          )}
        </StyledTouchableOpacity>
      </StyledView>
      {errorMessage ? (
        <Text className="text-red-500 font-normal text-[12px]">
          {errorMessage}
        </Text>
      ) : null}
      {show && (
        <DateTimePicker
          value={date || new Date()}
          mode={mode}
          display="default"
          onChange={onChange}
          minimumDate={minDate}
          maximumDate={maxDate}
          is24Hour={true}
          themeVariant="light"
        />
      )}
    </StyledView>
  );
};

const styles = StyleSheet.create({
  label: {
    color: "#142650",
    fontSize: 12,
    marginBottom: 4,
  },
});

export default CustomDateTimePicker;
