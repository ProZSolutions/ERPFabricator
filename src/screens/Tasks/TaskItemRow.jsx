import { View, Text, Pressable } from 'react-native';
import { CalendarIcon } from 'react-native-heroicons/outline';
import { Swipeable } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import React, { useRef, useEffect } from 'react';

let currentlyOpenSwipeable = null;

const StockAlertItem = ({ name, dueDate, status, details }) => {
  const navigation = useNavigation();
  const swipeableRef = useRef(null);

  let isCompleted = status === 1;
  if (details.task_type === 'assigned') {
    isCompleted = status === 1 && details.is_update === 1;
  }

  const handlePress = () => {
    // Close current swipeable
    swipeableRef.current?.close();

    setTimeout(() => {
      if (details.task_type === 'assigned') {
        navigation.navigate('UpdateTask', { details });
      } else {
        navigation.navigate('UpdateSchedule', { details });
      }
    }, 100); // small delay to ensure close animation completes
  };

  const renderRightActions = () => {
    const actionLabel = isCompleted ? 'Details' : 'Update';

    return (
      <Pressable
        onPress={handlePress}
        className="bg-blue-600 justify-center items-end pr-4 rounded-r-xl"
        style={{ width: 100 }}
      >
        <Text className="text-white text-sm font-semibold">{actionLabel}</Text>
      </Pressable>
    );
  };

  const handleSwipeOpen = () => {
    if (currentlyOpenSwipeable && currentlyOpenSwipeable !== swipeableRef.current) {
      currentlyOpenSwipeable.close();
    }
    currentlyOpenSwipeable = swipeableRef.current;
  };

  useEffect(() => {
    return () => {
      // Close the swipeable on unmount
      if (swipeableRef.current) {
        swipeableRef.current.close();
      }
    };
  }, []);

  return (
    <Swipeable
      ref={swipeableRef}
      onSwipeableOpen={handleSwipeOpen}
      renderRightActions={renderRightActions}
    >
      <Pressable className="bg-white shadow-md rounded-xl p-4 mb-4 mx-2">
        {/* Task Type Label */}
        <View className="mb-2">
          {details.task_type === 'assigned' ? (
            <View className="flex-row items-center">
              <FontAwesome name="user-plus" size={12} color="#16a34a" />
              <Text className="text-green-600 text-[10px] font-medium ml-2">Assigned Task</Text>
            </View>
          ) : (
            <View className="flex-row items-center">
              <FontAwesome name="calendar" size={12} color="#2563eb" />
              <Text className="text-blue-600 text-[10px] font-medium ml-2">Schedule Task</Text>
            </View>
          )}
        </View>

        {/* Title and Status */}
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-[13px] font-semibold text-gray-800">{name}</Text>
          <View
            className={`px-2 py-1 rounded-md ${
              isCompleted ? 'bg-green-100' : 'bg-yellow-100'
            }`}
          >
            <Text
              className={`text-[10px] font-semibold ${
                isCompleted ? 'text-green-700' : 'text-yellow-700'
              }`}
            >
              {isCompleted ? 'Completed' : 'Pending'}
            </Text>
          </View>
        </View>

        {/* Due Date */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center space-x-1">
            <CalendarIcon color="#6B7280" size={18} />
            <Text className="text-[12px] text-gray-600">Due Days: {dueDate}</Text>
          </View>
        </View>
      </Pressable>
    </Swipeable>
  );
};

export default StockAlertItem;
