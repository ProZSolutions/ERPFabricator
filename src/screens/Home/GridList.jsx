import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import BoxItem from './BoxItem';
import { styled } from 'nativewind';

const StyledView = styled(View);

const GridList = ({ items, handleNavigation }) => {
    const { width } = useWindowDimensions();

    // Adjust the number of columns based on the screen width
    const isLargeScreen = width > 360; // Example breakpoint for large screens
    const itemWidth = isLargeScreen ? '48%' : '48%'; // 30% for large screen, 45% for smaller screen

    return (
        <StyledView className="flex-row flex-wrap justify-between">
            {items.map((item, index) => (
                <BoxItem
                    onPress={() => handleNavigation(item.id)}
                    key={item.id}
                    title={item.title}
                    notification={item.notification || ''}
                    icon={item.icon || null}
                    width={itemWidth}
                    // Add marginBottom for row gaps
                    style={{ marginBottom: 15 }} // Simulates a row gap of 15px
                    isLargeScreen = {isLargeScreen}
                />
            ))}
        </StyledView>
    );
};

export default GridList;

