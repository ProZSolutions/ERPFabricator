// AttendanceRow.js
import React from 'react';
import { View, Text } from 'react-native';
 import moment from 'moment';
 import Icon from 'react-native-vector-icons/Feather';


const AttendanceRow = ({ item,index }) => {
  return (
    <View>
    <View className="flex-row justify-around bg-white py-4 rounded-lg shadow-md">
      {/* Check In */}
      <View className="items-center w-1/3">
      { index==0 && 
      <Text className="text-xs text-gray-500 font-semibold mt-1 mb-1">Check In</Text> }
            <Icon name="clock" size={20} color="#f5a623" />
        <Text className="text-[10px] text-gray-500 mt-1">
          {moment(item.in_time).format('DD-MM-YYYY hh:mm A')}
        </Text>
      </View>

      {/* Check Out */}
      <View className="items-center w-1/3">
      { index==0 &&  <Text className="text-xs font-semibold text-gray-500 mt-1 mb-1">Check Out</Text> }
      <Icon name="log-out" size={20} color="#f5a623" />
        <Text className="text-[10px] text-gray-500 mt-1">
          {item.out_time !== '-' ? moment(item.out_time).format('hh:mm A') : '-'}
        </Text>
      </View>

      {/* Working Hrs */}
      <View className="items-center w-1/3">
      { index==0 &&  <Text className="text-xs font-semibold text-gray-500 mt-1 mb-1">Working Hrs</Text> }
      <Icon name="activity" size={20} color="#f5a623" />
        <Text className="text-[10px] text-gray-500 mt-1 text-center">
          {item.work_hours}
        </Text>
      </View>
    </View>
    <View className="h-[1px] bg-gray-200  mx-2" />
    </View>
  );
};

export default AttendanceRow;
9