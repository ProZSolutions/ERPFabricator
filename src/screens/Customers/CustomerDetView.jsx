import React, { useState } from 'react';
import { View, Text, TouchableOpacity,Modal, ToastAndroid,StyleSheet  } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';


export default function ActivityCard({ item, isExpanded, onToggle,onViewDetails  }) {
  const [showReadMore, setShowReadMore] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const navigation = useNavigation();
 



  if (!item) return null;

  let lead_det = item.lead_name+"("+item.lead_id+")";

     const getLabelStyle = (label) => {
        switch (label) {
          case 'Quotation':
            return { bg: 'bg-blue-100', text: 'text-blue-700' };
          case 'Enquiry':
            return { bg: 'bg-yellow-100', text: 'text-yellow-700' };
          case 'Field Visit':
            return { bg: 'bg-green-100', text: 'text-green-700' };
          default:
            return { bg: 'bg-gray-100', text: 'text-gray-700' };
        }
      };
      
      const label = item.stage_name; // or "Enquiry", "Field Visit"
      const { bg, text } = getLabelStyle(label);
 

 


  return (
    <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mt-2 ml-2 mr-2">
      <View className="w-1.5 rounded-full bg-red-500 mr-3" />
      <View className="flex-1 space-y-2">
      <View className="flex-row w-full justify-between items-start">
        {/* Left: Lead Name */}
        <View className="flex-row items-start w-1/2 flex-wrap">
          <MaterialIcons name="person" size={16} color="#555" />
          <Text className="text-[12px] font-semibold text-gray-800 ml-1">
            {lead_det}
          </Text>
        </View>

        {/* Right: Icon Button */}
        <TouchableOpacity onPress={() => onViewDetails(item)}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="visibility" size={12} color="white" />
          </View>
        </TouchableOpacity>
      </View>

  

        <View className={`${bg} px-4 py-0.5 rounded-full self-start`}>
            <Text className={`text-[10px] ${text}`}>{label}</Text>
        </View>

        <View className="flex-row justify-between items-center pt-1">
          {/* Left side - email & phone */}
          <View className="flex-row space-x-4">
            <View className="flex-row items-center space-x-1">
              <MaterialIcons name="email" size={14} color="#333" />
              <Text className="text-[10px] text-gray-800 font-medium">{item.email}</Text>
            </View>
            <View className="flex-row items-center space-x-1">
              <MaterialIcons name="phone" size={14} color="#555" />
              <Text className="text-[10px] text-gray-600">{item.lead_contact}</Text>
            </View>
          </View>

          {/* Right side - Closed text */}
          {item.is_closed === 1 && (
            <Text className="text-[10px] text-red-600  font-bold">Closed</Text>
          )}
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

