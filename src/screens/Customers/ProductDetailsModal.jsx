import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function ProductDetailsModal({ visible, onClose, item,display }) {
   if (!item) return null; // or a loading spinner if needed

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="bg-white rounded-2xl w-11/12 p-4">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-700">{display} Details</Text>
          </View>

          {/* Product Name */}
          <View className="bg-gray-200 p-3 rounded-lg mb-4">
            <Text className="text-gray-700 font-medium">{display} Name: {item?.name || item?.lead_name || '-'}
</Text>
          </View>

          {/* Grid Info */}
          <View className="flex-row flex-wrap justify-between gap-y-4">
            {/* First row: Product Value and Width */}
            
            {/* Third row: Address and Landmark */}
            <View className="flex-row w-full justify-between">
              <View className="w-1/2 flex-row items-start ">
                <View className="p-1 rounded-full bg-gray-200">
                  <Icon name="home" size={16} color="blue" className="mt-1" />
                </View>
                <View className="ml-2 flex-1">
                  <Text className="text-gray-700 text-[10px]">Address:</Text>
                  <Text className="text-gray-700 text-[10px]">{item.address  || '-'}</Text>
                </View>
              </View>

              <View className="w-1/2 flex-row items-start">
                <View className="p-1 rounded-full bg-gray-200">
                  <Icon name="map-marker" size={16} color="blue" className="mt-1" />
                </View>
                <View className="ml-2 flex-1">
                  <Text className="text-gray-700 text-[10px]">Landmark:</Text>
                  <Text className="text-gray-700 text-[10px]">{item.landmark  || '-'}</Text>
                </View>
              </View>
            </View>

            {/* Fourth row: Village/Town and District */}
            <View className="flex-row w-full justify-between">
              <View className="w-1/2 flex-row items-start">
                <View className="p-1 rounded-full bg-gray-200">
                  <Icon name="city" size={16} color="blue" className="mt-1" />
                </View>
                <View className="ml-2 flex-1">
                  <Text className="text-gray-700 text-[10px]">Village/Town:</Text>
                  <Text className="text-gray-700 text-[10px]">{item.landmark || '-'}</Text>
                </View>
              </View>

              <View className="w-1/2 flex-row items-start ">
                <View className="p-1 rounded-full bg-gray-200">
                  <Icon name="map" size={16} color="blue" className="mt-1" />
                </View>
                <View className="ml-2 flex-1">
                  <Text className="text-gray-700 text-[10px]">District:</Text>
                  <Text className="text-gray-700 text-[10px]">{item.district_name  || '-'}</Text>
                </View>
              </View>
            </View>

            {/* Fifth row: State and Pincode */}
            <View className="flex-row w-full justify-between">
              <View className="w-1/2 flex-row items-start ">
                <View className="p-1 rounded-full bg-gray-200">
                  <Icon name="globe" size={16} color="blue" className="mt-1" />
                </View>
                <View className="ml-2 flex-1">
                  <Text className="text-gray-700 text-[10px]">State:</Text>
                  <Text className="text-gray-700 text-[10px]">{item.state  || '-'}</Text>
                </View>
              </View>

              <View className="w-1/2 flex-row items-start ">
                <View className="p-1 rounded-full bg-gray-200">
                  <Icon name="numeric" size={16} color="blue" className="mt-1" />
                </View>
                <View className="ml-2 flex-1">
                  <Text className="text-gray-700 text-[10px]">Pincode:</Text>
                  <Text className="text-gray-700 text-[10px]">{item.pincode  || '-'}</Text>
                </View>
              </View>
            </View>

            {/* Sixth row: Lead Contact and WhatsApp Contact */}
            <View className="flex-row w-full justify-between">
              <View className="w-1/2 flex-row items-start ">
                <View className="p-1 rounded-full bg-gray-200">
                  <Icon name="phone" size={16} color="blue" className="mt-1" />
                </View>
                <View className="ml-2 flex-1">
                  <Text className="text-gray-700 text-[10px]">{display} Contact:</Text>
                  <Text className="text-gray-700 text-[10px]">{item.contact  || '-'}</Text>
                </View>
              </View>

              <View className="w-1/2 flex-row items-start ">
                <View className="p-1 rounded-full bg-gray-200">
                  <Icon name="whatsapp" size={16} color="green" className="mt-1" />
                </View>
                <View className="ml-2 flex-1">
                  <Text className="text-gray-700 text-[10px]">WhatsApp Contact:</Text>
                  <Text className="text-gray-700 text-[10px]">{item.whatsapp_contact  || '-'}</Text>
                </View>
              </View>
            </View>

            {/* Seventh row: Email and Notes */}
            <View className="flex-row w-full justify-between">
            <View className="w-1/2 flex-row items-start">
            <View className="p-1 rounded-full bg-gray-200">
              <Icon name="email" size={16} color="blue" />
            </View>
            <View className="ml-2 flex-1">
              <Text className="text-gray-700 text-[10px]">Email:</Text>
              <Text className="text-gray-700 text-[10px]">{item.email || '-'}</Text>
            </View>
          </View>



               
            </View>

            {/* Eighth row: Overdue Days and Stage Name */}
        
          </View>

          {/* Close Button */}
          <TouchableOpacity
            className="bg-blue-500 mt-6 py-2 rounded-full items-center"
            onPress={onClose}
          >
            <Text className="text-white font-semibold">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
