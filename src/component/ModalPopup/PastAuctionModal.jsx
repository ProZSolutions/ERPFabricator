import React from 'react';
import { View, Modal, Pressable, Text } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledPressable = styled(Pressable);
const StyledText = styled(Text);

function PastAuctionModal({
    isAddCount = 0,
    close = () => { },
    onPressYesBtn = () => { },
    onPressNoBtn = () => {}
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
                <StyledView className="w-[90%] h-[30%] bg-white rounded-2xl px-5 py-6 items-center">
                    <StyledPressable
                        className="absolute top-3 right-4"
                        onPress={() => close(false)}
                    >
                        <StyledText className="text-2xl text-gray-600 font-bold">×</StyledText>
                    </StyledPressable>

                    <StyledView className="w-full space-y-10 items-center mt-10">
                        <StyledView className='px-4'>
                        <Text className="text-custom-heading text-sm font-normal">You need to add {isAddCount} past Auctions</Text>
                            {/* <Text className="text-custom-heading text-sm font-normal">Do you want to add some more past Auction to this chit?</Text> */}
                        </StyledView>
                        <StyledView className='w-full flex-row justify-center space-x-5'>
                            <Pressable onPress={() => onPressYesBtn()} className="w-[45%] py-3 bg-blue-600 rounded-lg shadow-md">
                                <StyledText className="text-center text-white text-lg font-bold">
                                    Next
                                </StyledText>
                            </Pressable>
                            {/* <Pressable onPress={() => onPressNoBtn()} className="w-[40%] py-3 border border-gray-300 rounded-lg shadow-sm">
                                <StyledText className="text-center text-blue-600 text-lg font-bold">
                                    NO
                                </StyledText>
                            </Pressable> */}
                        </StyledView>
                    </StyledView>
                </StyledView>
            </StyledView>
        </Modal>
    );
}

export default PastAuctionModal;
