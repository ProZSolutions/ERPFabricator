import React from 'react';
import { styled } from 'nativewind';
import GreaterThanIcon from '../../assets/svg-component/GreaterThanIcon';
import { Text, TouchableOpacity, View } from 'react-native';
import { capitalizeFirstLetter } from '../../utils';
import { useNavigation } from '@react-navigation/native';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

function MembersListItem({ item }) {
    const navigation = useNavigation();

    const onPress = (item) => {
        navigation.navigate("MemberChitList", {
            cus_id: item.cus_id,
            name:item.name
        });
    }

    return (
        <StyledTouchableOpacity
            onPress={() => onPress(item)}
            className="flex flex-row items-center justify-between border mb-4 rounded-lg border-gray-200 space-x-1 py-2">
            <StyledView className="basis-[40%] pl-1">
                <StyledText className="text-custom-heading text-base font-medium">
                    {capitalizeFirstLetter(item?.name)}
                </StyledText>
                <StyledText className="text-custom-hyperlink text-xs font-light">
                    {item?.contact}
                </StyledText>
            </StyledView>

            <StyledView className="basis-[25%]">
                {item?.referredBy && (
                    <StyledView>
                        <StyledText className="text-custom-companytxt text-xs font-medium">
                            Referred By
                        </StyledText>
                        <StyledText className="text-custom-hyperlink text-xs font-medium">
                            {capitalizeFirstLetter(item?.referredBy)}
                        </StyledText>
                    </StyledView>
                )}
            </StyledView>

            <StyledView className="basis-[20%]">
                {item?.lable && (
                    <StyledText className="bg-custom-lightgreen text-center py-2 text-custom-green text-sm font-medium rounded-md">
                        {item?.lable}
                    </StyledText>
                )}
            </StyledView>

            <StyledView className="basis-[10%] flex-row justify-end pr-1">
                <StyledView>
                    <GreaterThanIcon />
                </StyledView>
            </StyledView>
        </StyledTouchableOpacity>
    );
}

export default MembersListItem;
