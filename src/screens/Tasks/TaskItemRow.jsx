import { View, Text, Pressable } from 'react-native';
import { CalendarIcon } from 'react-native-heroicons/outline'; // Optional icon
import { styled } from 'nativewind'; 
import { Swipeable } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const StockAlertItem = ({ name,dueDate, status,details }) => {
  const navigation = useNavigation();
  const isCompleted = status === 0;

  const renderRightActions = () => {
    const actionLabel = isCompleted ? 'Details' : 'Update';

    return (
      <Pressable
       onPress={() => {
              if (details.task_type === 'assigned') {
                          navigation.navigate('UpdateTask', { details });
               } else {
                          navigation.navigate('UpdateSchedule', { details });
                }
           }}

        className="bg-blue-600 justify-center items-end pr-4 rounded-r-xl"
        style={{ width: 100 }}
      >
        <Text className="text-white text-sm font-semibold">{actionLabel}</Text>
      </Pressable>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <Pressable className="bg-white shadow-md rounded-xl p-4 mb-4 mx-2">
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
