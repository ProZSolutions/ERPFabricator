import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styled } from "nativewind";
import { capitalizeFirstLetter } from "../../utils";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const SelectedMembersInfo = ({ member }) => {
  const { id, name, contact, isFullChit, status = null } = member;

  return (
    <StyledView className="mb-2">
      <StyledTouchableOpacity className="flex flex-row items-center justify-between p-2 border border-gray-200 rounded-lg">
        {/* Member Details */}
        <StyledView className="basis-[35%]">
          <StyledText className="text-custom-heading text-base font-medium">
            {capitalizeFirstLetter(name)}
          </StyledText>
          <StyledText
            className={`${
              status != null ? "text-custom-green" : "text-custom-hyperlink"
            } text-xs font-light`}
          >
            {contact}
          </StyledText>
        </StyledView>

        {/* My Self */}
        <StyledView className="basis-[25%] flex-row justify-end items-end">
          {status != null && (
            <StyledView className="bg-custom-lightgreen px-4 py-1 border border-custom-lightgreen rounded-3xl mt-2">
              <StyledText className="text-custom-green text-xs font-medium">
                My self
              </StyledText>
            </StyledView>
          )}
        </StyledView>

        {/* Full Chit Property */}
        <StyledView className="basis-[30%] flex-row justify-end items-end">
          <StyledView className="flex-col">
            <StyledText className="text-left text-xs font-normal text-custom-companytxt">
              {isFullChit ? "Full " : "Half "}Chit
            </StyledText>
          </StyledView>
        </StyledView>
      </StyledTouchableOpacity>
    </StyledView>
  );
};

export default SelectedMembersInfo;
