import { View, Text, Pressable,TouchableOpacity,StyleSheet } from 'react-native';
import { CalendarIcon } from 'react-native-heroicons/outline';
import { Swipeable } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import React, { useRef, useEffect } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

let currentlyOpenSwipeable = null;

const StockAlertItem = ({ name, dueDate, status, details }) => {
  const navigation = useNavigation();
  const swipeableRef = useRef(null);
  let disname =null;
   let isCompleted = status === 1;
  if (details.task_type === 'assigned') {
    isCompleted = status === 1 && details.is_update === 1;
    disname = details?.task_name;
  }else{
    disname = details?.lead_name+"("+details?.lead_leadid+")";
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

  const handleRoute =()=>{
    if (details.task_type === 'assigned') {
        navigation.navigate('UpdateAssigned', { lead:details });
      } else {
        navigation.navigate('EditActivity', { details });
      }
  }
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
  
      <Pressable className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 m-1">
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
          <Text className="text-[13px] font-semibold text-gray-800">{disname}</Text>
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
            <View className="flex-row justify-end mt-3">
                  { (details?.is_completed ===0) && (
                          <View className="flex-row items-center space-x-2 pl-2 mr-2">          
            
                            <TouchableOpacity onPress={handleRoute}>
                              <View style={styles.iconCircle}>
                                <MaterialIcons name="note-add" size={12} color="white" />
                              </View>
                            </TouchableOpacity>
                          </View>
                    )}
                    { (details?.is_completed ===1) && (
                <TouchableOpacity className="flex-row items-center" onPress={handlePress} >
                  <View style={styles.iconCircle}>
                                <MaterialIcons name="visibility" size={12} color="white" />
                              </View>
                </TouchableOpacity>
                  )}
              </View>
      </Pressable>
   );
};

export default StockAlertItem;
const styles = StyleSheet.create({
  iconRow: {
    flexDirection: 'row',
    gap: 12,
  },
  iconCircle: {
    backgroundColor: 'green',
    borderRadius: 20, // for a perfect circle
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});