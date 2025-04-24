import React from 'react';
import { View, Modal, Pressable, Text } from 'react-native';
import { styled } from 'nativewind';
import DateTimePicker from 'react-native-ui-datepicker';
import moment from 'moment';

const StyledView = styled(View);
const StyledPressable = styled(Pressable);
const StyledText = styled(Text);

function CalenderModal({ close = () => { }, dateRange, onChange = () => { }, maxDate }) {
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
                    <StyledPressable
                        className="absolute top-1 right-2"
                        onPress={() => close(false)}
                    >
                        <StyledText className="text-custom-heading text-xl font-bold">×</StyledText>
                    </StyledPressable>

                    <StyledView className="w-full my-10">
                        <View className="mb-3">
                            <Text className="border border-gray-200 px-2 rounded-lg py-4 text-custom-companytxt text-base font-normal text-center">
                                {`${moment(dateRange?.startDate).format("DD/MM/YYYY")} - ${moment(dateRange?.endDate).format("DD/MM/YYYY")}`}
                            </Text>

                        </View>
                        <DateTimePicker
                            mode='range'
                            startDate={dateRange?.startDate}
                            endDate={dateRange?.endDate}
                            onChange={onChange}
                            maxDate={maxDate}
                            textColor="#000"
                            style={{ backgroundColor: '#fff' }} // optional background
                            calendarTextStyle={{ color: 'black' }} // <-- changes days, numbers
                            headerTextStyle={{ color: 'black' }} // <-- changes month/year
                            selectedItemColor="black" // <-- selected date circle text color
                            selectedItemBackgroundColor="#ddd" // optional
                            theme={{
                            textDefault: '#000000', // Day numbers
                            textSecondary: '#000000', // Month and year
                            textHeader: '#000000', // Weekday headers (Sun, Mon...)
                            textToday: '#000000', // Today text
                            textDisabled: '#999999',
                        }}
                                                />
                    </StyledView>


                </StyledView>
            </StyledView>
        </Modal>
    )
}

export default CalenderModal;