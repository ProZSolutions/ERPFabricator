    import React from 'react';
    import { View, Text, TouchableOpacity, Switch } from 'react-native';
    import CheckBox from '@react-native-community/checkbox';
    import { styled } from 'nativewind';
    import { capitalizeFirstLetter } from '../../utils';

    const StyledView = styled(View);
    const StyledText = styled(Text);
    const StyledTouchableOpacity = styled(TouchableOpacity);

    const SelectMemberInfo = ({ member, isSelected, onCheckboxToggle, onSwitchToggle }) => {
        const { id, name, contact, isFullChit, status } = member;
        console.log(" name "," name "+name+" status "+status);


        return (
            <StyledView className="mb-2">
                <StyledTouchableOpacity className="flex flex-row items-center justify-between p-2 border border-gray-200 rounded-lg">
                    {/* Checkbox */}
                    <StyledView className="basis-[10%] flex-row">
                        <CheckBox
                            disabled={status?.replace(/\s/g, '').toLowerCase() === 'myself' }
                            value={
                                status?.replace(/\s/g, '').toLowerCase() === 'myself'
                                ? true
                                : isSelected
                            }                         
                              onValueChange={() => onCheckboxToggle(id)}
                            tintColors={{ true: '#285FE7', false: 'rgb(209 213 219)' }}
                        />
                    </StyledView>

                    {/* Member Details */}
                    <StyledView className="basis-[35%]">
                        <StyledText className="text-custom-heading text-base font-medium">{capitalizeFirstLetter(name)}</StyledText>
                        <StyledText
                            className={`${status === "MySelf" ? 'text-custom-green' : 'text-custom-hyperlink'} text-xs font-light`}
                        >
                            {contact}
                        </StyledText>
                    </StyledView>

                    {/* My Self */}
                    <StyledView className="basis-[25%] flex-row justify-end items-end">
                        {status !== null && (
                            <StyledView className="bg-custom-lightgreen px-4 py-1 border border-custom-lightgreen rounded-3xl mt-2">
                                <StyledText className="text-custom-green text-xs font-medium">My self</StyledText>
                            </StyledView>
                        )}
                    </StyledView>

                    {/* Full Chit Property */}
                    <StyledView className="basis-[30%] flex-row justify-end items-end">
                        <StyledView className="flex-col">
                            <StyledText className="text-left text-xs font-normal text-custom-companytxt">{isFullChit ? 'Full Chit':"Half Chit"}</StyledText>
                            <Switch
                                value={isFullChit}
                                onValueChange={() => onSwitchToggle(id)}
                                trackColor={{ false: '#767577', true: '#81b0ff' }}
                                thumbColor="#f4f3f4"
                            />
                        </StyledView>
                    </StyledView>
                </StyledTouchableOpacity>
            </StyledView>
        );
    };

    export default SelectMemberInfo;