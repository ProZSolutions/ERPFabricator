import React from 'react';
import { View, Modal, Pressable, Text } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledPressable = styled(Pressable);
const StyledText = styled(Text);

function AddChitPopup({
    close = () => { },
    onPressChitType = () => { }
}) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={true}
            onRequestClose={() => close(false)}
        >
            <StyledView
                className="flex-1 justify-center items-center"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            >
                <StyledView className="w-[90%] h-[40%] bg-white rounded-2xl px-5 py-6 items-center">
                    <StyledPressable
                        className="absolute top-3 right-4"
                        onPress={() => close(false)}
                    >
                        <StyledText className="text-2xl text-gray-600 font-bold">×</StyledText>
                    </StyledPressable>

                    <StyledView className="w-full space-y-10 items-center mt-16">
                        <Pressable onPress={() => onPressChitType('new')} className="w-[80%] py-4 bg-blue-600 rounded-lg shadow-md">
                            <StyledText className="text-center text-white text-lg font-bold">
                                NEW CHIT
                            </StyledText>
                        </Pressable>
                        <Pressable onPress={() => onPressChitType('old')} className="w-[80%] py-4 border border-gray-300 rounded-lg shadow-sm">
                            <StyledText className="text-center text-blue-600 text-lg font-bold">
                                EXISTING CHIT
                            </StyledText>
                        </Pressable>
                    </StyledView>
                </StyledView>
            </StyledView>
        </Modal>
    );
}

export default AddChitPopup;
