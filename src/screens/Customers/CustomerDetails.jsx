import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Pressable, FlatList, Alert,ActivityIndicator } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomHeader from '../../component/Header/CustomHeader';
import CustomFooter from '../../component/Footer/CustomFooter';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL_TESTING } from '../../api/Config';
import { getValue } from '../../component/AsyncStorage/AsyncStorage';
import LeadRowItem from './CustomerDetView';
import ProductDetailsModal from "./ProductDetailsModal";

const CustomerDetails = ({ route }) => {
  const { lead } = route.params;
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deviceid, setDeviceID] = useState(null);
  const [token, setToken] = useState(null);
  const [details, setDetails] = useState(null);
  const [modalDet,setModalDet] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation();
  

  const handleToggle = (uuid) => {
    setExpandedId(prev => (prev === uuid ? null : uuid));
  };

  const handleNavigateToSchedule = (type) => {
    navigation.navigate('AddLead');
  };

  const getDeviceId = async () => {
    try {
      const device_id = await AsyncStorage.getItem('device_id');
      const userInfo = await getValue('userInfo');
      const bearerToken = userInfo?.bearer_token;

      setDeviceID(device_id);
      setToken(bearerToken);

      console.log("customer device id:", device_id, "token:", bearerToken);

    } catch (error) {
      console.error('Error fetching device ID:', error);
    }
  };

  const getTaskList = async () => {
     const token_no = "Bearer " + token;
     console.log("base "," url "+BASE_URL_TESTING);
          console.log("uuid "," url "+lead?.uuid);

    setLoading(true);

    try {
      const url = `${BASE_URL_TESTING}customer-profile?uuid=${lead?.uuid}`;
      const response = await fetch(url, {
        method: 'POST', 
        headers: {
          'Authorization': token_no,
          'device_id': deviceid,
          'Accept': 'application/json',
        },
      });

      const result = await response.json();
      console.log("status ", "code " + result.status);

      if (response.status === 200 && result.status === 'success') {

        setTasks(result.lead_data?.data || []);
        setDetails(result.customer || {});
        setModalDet(result.customer || {});
      } else {
        console.warn('Task list fetch failed:', result?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching task list:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleViewDetails = (leadItem) => {
  setModalDet(leadItem);
  setShowModal(true);
};


  useEffect(() => {
    getDeviceId(); // Get the device ID and token from AsyncStorage
  }, []);

  useEffect(() => {
    if (token && deviceid) {
      // Call getTaskList only when token and deviceid are available
      getTaskList();
    }
  }, [token, deviceid]); // This effect runs whenever token or deviceid changes

  const getInitials = (name) => {
    if (!name) return '';
    return name.trim().split(' ').map(p => p[0].toUpperCase()).join('');
  };

  return (
    <View className="flex-1 bg-white">
      <CustomHeader name="View Customer" isBackIcon={true} />
      <View className="flex-row items-center justify-between ml-5 mr-5">
        <View className="flex-row items-center">
          <View className="bg-green-200 rounded-full w-10 h-10 items-center justify-center mr-1">
            <Text className="text-black font-bold">{getInitials(details?.name || '')}</Text>
          </View>
          <View className="ml-1">
            <Text className="text-black font-semibold text-[12px]">{details?.name || ''}</Text>
            <Text className="text-[10px] text-gray-700">{details?.customer_id || ''}</Text>
          </View>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-2 p-2">
        <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-xl" onPress={() => setShowModal(true)}>
          <Text className="text-white text-[10px]">View Customer Details</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-xl" onPress={() => handleNavigateToSchedule('schedule')}>
          <Text className="text-white text-[10px]">Add Lead</Text>
        </TouchableOpacity>
         
      </View>

      <View className="border-t border-gray-200 mb-2 mt-3" />

  

      <FlatList
        style={{ marginTop: 10, marginBottom: 70 }}
        data={tasks}
        keyExtractor={(item) => item.uuid}
        renderItem={({ item }) => (
          <LeadRowItem
            item={item}
            isExpanded={item.uuid === expandedId}
            onToggle={handleToggle}
              onViewDetails={handleViewDetails} // pass handler here
          />
        )}
         ListFooterComponent={loading ? (
                  <ActivityIndicator size="small" color="#0000ff" className="my-2" />
                ) : null}
      />

      <ProductDetailsModal visible={showModal} onClose={() => setShowModal(false)} item={modalDet} />
      <CustomFooter isLead={true} />
    </View>
  );
};

export default CustomerDetails;
