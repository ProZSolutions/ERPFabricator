import React from 'react';
import { View, Modal, Pressable, StyleSheet, Image, Text } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledPressable = styled(Pressable);
const StyledText = styled(Text);

function ModalPopup({ base64Image, close = () => { } }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={() => close(false)}
    >
      <StyledView
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
      >
        <StyledView className="w-[90%] bg-white rounded-lg px-2  relative">
          <StyledText className="text-custom-heading text-xl font-bold mt-1">Attached Documents</StyledText>
          <StyledPressable
            className="absolute top-1 right-2"
            onPress={() => close(false)}
          >
            <StyledText className="text-custom-heading text-xl font-bold">×</StyledText>
          </StyledPressable>

          <StyledView className="h-[90%] w-full mt-2">
            <Image
              className="h-full w-full rounded-lg"
              source={{ uri: base64Image }}
              style={styles.image}
            />
          </StyledView>

          {/* <StyledPressable
            className="px-4 py-2 bg-red-500 rounded-full mt-4"
            onPress={() => close(false)}
          >
            <StyledText className="text-white font-bold">Close</StyledText>
          </StyledPressable> */}
        </StyledView>
      </StyledView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
  },
});

export default ModalPopup;
