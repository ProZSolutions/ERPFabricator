import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function ProductDetailsModal({ visible, onClose ,item }) {
    console.log(" lead name ","as "+item);
      if (!item) return null; // or a loading spinner if needed

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="bg-white rounded-2xl w-11/12 p-4">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-700">Product Details</Text>
            
          </View>

          {/* Product Name */}
          <View className="bg-gray-200 p-3 rounded-lg mb-4">
            <Text className="text-gray-700 font-medium">
              Product Name : {item.product_name}
            </Text>
          </View>

          {/* Grid Info */}
          <View className="flex-row flex-wrap justify-between gap-y-4">
          

           <View className="w-1/2 flex-row items-start">
            <View className="p-1 rounded-full bg-gray-200 p-1">
                 <Icon name="currency-inr" size={16} color="blue" className="mt-1" />
            </View>
            <View className="ml-2">
                <Text className="text-gray-700 text-[10px]">Product Value :</Text>
                <Text className="text-gray-700 text-[10px]">{item.lead_value}</Text>
            </View>
            </View>


                <View className="w-1/2 flex-row items-start mt-2">
                <View className="p-1 rounded-full bg-gray-200 p-1">
                                  <Icon name="arrow-expand-horizontal" size={16} color="blue" className="mt-1" />

                </View>
        <View className="ml-2">
            <Text className="text-gray-700 text-[10px]">Width :</Text>
            <Text className="text-gray-700 text-[10px]">{item.width}</Text>
        </View>
        </View>


        <View className="w-1/2 flex-row items-start mt-2">
        <View className="p-1 rounded-full bg-gray-200 p-1">
                    <Icon name="arrow-expand-vertical" size={16} color="blue" className="mt-1" />

        </View>
        <View className="ml-2">
            <Text className="text-gray-700 text-[10px]">Height :</Text>
            <Text className="text-gray-700 text-[10px]">{item.height}</Text>
        </View>
        </View>



          <View className="w-1/2 flex-row items-start mt-2">
                  <View className="p-1 rounded-full bg-gray-200 p-1">
                              <Icon name="ruler-square" size={16} color="blue" className="mt-1" />

                    </View>
            <View className="ml-2">
                <Text className="text-gray-700 text-[10px]">Length :</Text>
                <Text className="text-gray-700 text-[10px]">{item.length}</Text>
            </View>
          </View>





           
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
