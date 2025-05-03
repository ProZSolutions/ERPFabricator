import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { View, Text, TouchableOpacity,Image, Linking  } from 'react-native';
const isImage = (url) => {
    return /\.(jpeg|jpg|gif|png|webp)$/i.test(url);
  };
export default TaskItem = ({ item, isExpanded, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-gray-100 rounded-xl p-4 mb-2 mx-2"
    >
      {/* Header Row */}
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center space-x-2">
          <FontAwesome name="calendar" size={12} color="#4B5563" />
          <Text className="text-[12px] font-medium text-black">{item.date}</Text>
        </View>

        <FontAwesome
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={12}
          color="#6B7280"
        />
      </View>

      {/* Collapsible Content */}
      {isExpanded && (
        <>
          <View className="flex-row items-center mt-3">
            <FontAwesome name="file-text-o" size={14} color="#4B5563" />
            <Text className="ml-2 text-[12px] text-gray-500">Task Description</Text>
          </View>

          <View className="mt-2 border border-gray-300 rounded p-2">
            <Text className="text-gray-600 text-[10px]">{item.details}</Text>
          </View>

           {/* Attachment section */}
           {item.attachment && (
            <View className="mt-3">
              <Text className="text-[12px] text-gray-700 mb-1">Attachment:</Text>
              {isImage(item.attachment) ? (
                <Image
                  source={{ uri: item.attachment }}
                  className="w-full h-40 rounded-md"
                  resizeMode="cover"
                />
              ) : (
                <TouchableOpacity
                  onPress={() => Linking.openURL(item.attachment)}
                  className="flex-row items-center space-x-2 bg-white p-2 rounded border border-gray-300"
                >
                  <FontAwesome name="file" size={16} color="#4B5563" />
                  <Text className="text-[12px] text-blue-600 underline">Open Document</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <View className="flex-row items-center space-x-1 mt-2">
            <View className="w-3 h-3 bg-green-500 rounded-full" />
            <Text className="text-gray-600 text-[10px]">Completed</Text>
          </View>
        </>
      )}
    </TouchableOpacity>
  );
};
