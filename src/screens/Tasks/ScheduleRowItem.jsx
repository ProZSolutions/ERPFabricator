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
            <Text className="ml-2 text-[12px]">
                <Text className="text-gray-500">Lead : </Text>
                <Text className="text-black">{item.lead_id}</Text>
            </Text>
        </View>
        <View className="flex-row items-center mt-3">
            <Text className="ml-2 text-[12px]">
                <Text className="text-gray-500">Mode of Communication : </Text>
                <Text className="text-black">{item.mode_communication}</Text>
            </Text>
        </View>  
        <View className="flex-row items-center mt-3">
            <Text className="ml-2 text-[12px]">
                <Text className="text-gray-500">Purpose : </Text>
                <Text className="text-black">{item.pipeline_id}</Text>
            </Text>
        </View>  
        <View className="flex-row items-center mt-3">
            <Text className="ml-2 text-[12px]">
                <Text className="text-gray-500">Inquiries : </Text>
                <Text className="text-black">{item.content_reply}</Text>
            </Text>
        </View>  
        <View className="flex-row items-center mt-3">
            <Text className="ml-2 text-[12px]">
                <Text className="text-gray-500">Our Reply : </Text>
                <Text className="text-black">{item.customer_reply}</Text>
            </Text>
        </View>  
        {item.notes && (
            <View className="flex-row items-center mt-3">
                <Text className="ml-2 text-[12px]">
                <Text className="text-gray-500">Notes : </Text>
                <Text className="text-black">{item.notes}</Text>
                </Text>
            </View>
        ) }
        {item.location && (
            <View className="flex-row items-center mt-3">
                <Text className="ml-2 text-[12px]">
                <Text className="text-gray-500">Location : </Text>
                <Text className="text-black">{item.location}</Text>
                </Text>
            </View>
        ) }
        {item.notes && (
            <View className="flex-row items-center mt-3">
                <Text className="ml-2 text-[12px]">
                <Text className="text-gray-500">Notes: </Text>
                <Text className="text-black">{item.notes}</Text>
                </Text>
            </View>
        ) }
        {item.reschedule_reason && (
            <View className="flex-row items-center mt-3">
                <Text className="ml-2 text-[12px]">
                <Text className="text-gray-500">Rescheduled Reason : </Text>
                <Text className="text-black">{item.reschedule_reason}</Text>
                </Text>
            </View>
        ) }
        {item.reschedule_date && (
            <View className="flex-row items-center mt-3">
                <Text className="ml-2 text-[12px]">
                <Text className="text-gray-500">Rescheduled Date: </Text>
                <Text className="text-black">{item.reschedule_date}</Text>
                </Text>
            </View>
        ) }
           

           {/* Attachment section */}
           {item.file_url && (
            <View className="mt-3">
              <Text className="text-[12px] text-gray-700 mb-1">Attachment:</Text>
              {isImage(item.file_url) ? (
                <Image
                  source={{ uri: item.file_url }}
                  className="w-full h-40 rounded-md"
                  resizeMode="cover"
                />
              ) : (
                <TouchableOpacity
                  onPress={() => Linking.openURL(item.file_url)}
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
