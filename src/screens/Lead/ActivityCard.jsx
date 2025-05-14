import React, { useState } from 'react';
import { View, Text, TouchableOpacity,Modal, ToastAndroid,StyleSheet  } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';


export default function ActivityCard({ item, isExpanded, onToggle }) {
  const [showReadMore, setShowReadMore] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const navigation = useNavigation();


  if (!item) return null;

  const formatDate = (dateStr) => {
    
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  };

  const formattedDate = formatDate(item.date);


  const handleNavigateToSchedule = (type) => {
    console.log("details share ",JSON.stringify(item));
    if (item) {
      if(type==='activity'){
      navigation.navigate('EditSchedule', { lead: item });
      }else{
      navigation.navigate('EditActivity', { lead: item });
  
      }
    } else {
      Alert.alert('Please wait', 'Lead details are still loading.');
    }
  };


  return (
    <View className="flex-row bg-gray-100 rounded-2xl shadow-md p-3 mb-4 mx-2 items-start">
      <View className="w-1.5 rounded-full bg-red-500 mr-3" />
      <View className="flex-1 space-y-2">
        <View className="flex-row items-center space-x-1">
          {item.mode_communication_name === 'WhatsApp' && (
            <>
              <FontAwesome name="whatsapp" size={14} color="green" />
              <Text className="text-[10px] font-semibold text-gray-800 ml-1">WhatsApp</Text>
            </>
          )}
          {item.mode_communication_name === 'Email' && (
            <>
              <MaterialIcons name="email" size={14} color="red" />
              <Text className="text-[10px] font-semibold text-gray-800 ml-1">Email</Text>
            </>
          )}
          {item.mode_communication_name === 'Direct' && (
            <>
              <MaterialIcons name="directions-walk" size={14} color="#555" />
              <Text className="text-[10px] font-semibold text-gray-800 ml-1">Direct</Text>
            </>
          )}
          {(!item.mode_communication_name || item.mode_communication_name === 'Phone') && (
            <>
              <MaterialIcons name="phone" size={14} color="#555" />
              <Text className="text-[10px] font-semibold text-gray-800 ml-1">Phone Call</Text>
            </>
          )}
        </View>

        {item.content_reply_name ? (
          <Text
            numberOfLines={isExpanded ? undefined : 2}
            onTextLayout={(e) => {
              const lines = e.nativeEvent.lines;
              if (lines.length > 2 && !showReadMore) {
                setShowReadMore(true);
              }
            }}
            className="text-[12px] text-gray-700"
          >
            {item.content_reply_name}
          </Text>
        ) : (
          <Text className="text-[12px] text-gray-500 ">No message content</Text>
        )}

        {showReadMore && (
          <TouchableOpacity onPress={() => onToggle(item.uuid)}>
            <Text className="text-blue-500 text-[12px]">
              {isExpanded ? 'Read Less' : 'Read More'}
            </Text>
          </TouchableOpacity>
        )}

        <View className="flex-row justify-between items-center pt-1 ">
          <View className="flex-row space-x-4">
            <View className="flex-row items-center space-x-1">
              <FontAwesome name="user-circle" size={14} color="#333" />
              <Text className="text-[10px] text-gray-800 font-medium">{item.lead_name}</Text>
            </View>
            <View className="flex-row items-center space-x-1">
              <MaterialIcons name="access-time" size={14} color="#555" />
              <Text className="text-[10px] text-gray-600">{formattedDate}</Text>
            </View>
          </View>
          <View className="flex-row items-center space-x-2 pl-2">
          <TouchableOpacity  onPress={() => handleNavigateToSchedule('schedule')}
          >
          <View style={styles.iconCircle}>
            <MaterialIcons name="calendar-today" size={12} color="white" />

          </View>
                    </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavigateToSchedule('activity')}> 
              <View style={styles.iconCircle}>
                      <MaterialIcons name="done" size={12} color="white" />
                    </View>      
                        </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  

}
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

