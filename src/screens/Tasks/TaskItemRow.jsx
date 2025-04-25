import { View, Text, Pressable } from 'react-native';
import { CalendarIcon } from 'react-native-heroicons/outline'; // Optional icon
import { styled } from 'nativewind'; 
import { Swipeable } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const StockAlertItem = ({ name,dueDate, status,details }) => {
  const navigation = useNavigation();
  const isCompleted = status === 0;

  const renderRightActions = () => {
    const actionLabel = isCompleted ? 'Details' : 'Update';

    return (
      <Pressable
        onPress={() => navigation.navigate('UpdateTask', { details})}
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

          {!isCompleted && (
            <View className="flex-row items-center mt-3">
              <Text className="text-[10px] underline text-blue-600 font-medium">
                Update &gt;
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    </Swipeable>
  );
};


export default StockAlertItem;
