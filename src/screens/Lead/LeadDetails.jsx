import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Pressable, FlatList, ImageComponent,Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomHeader from '../../component/Header/CustomHeader';
import CustomFooter from '../../component/Footer/CustomFooter';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL_TESTING } from '../../api/Config';
import { getValue } from '../../component/AsyncStorage/AsyncStorage';
import LeadRowItem from '../../screens/Lead/ActivityCard';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ProductDetailsModal from "./ProductDetailsModal";
 

const LeadDetailsScreen = ({ route }) => {
  const { lead } = route.params;
  const [selectedTab, setSelectedTab] = useState('all');
  const [tasks, setTasks] = useState([]);
  const [overDue, setOverDue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deviceid, setDeviceID] = useState(null);
  const [token, setToken] = useState(null);
  const navigation = useNavigation();
  const [details, setDetails] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
   


  const handleToggle = (uuid) => {
    setExpandedId(prev => (prev === uuid ? null : uuid));
  };
  const handleNavigateToSchedule = (type) => {
    console.log("details share ",JSON.stringify(details));
    if (details) {
      if(type==='activity'){
      navigation.navigate('AddSchedule', { lead: details });
      }else{
      navigation.navigate('AddActivity', { lead: details });

      }
    } else {
      Alert.alert('Please wait', 'Lead details are still loading.');
    }
  };

  const getDeviceId = async () => {
    try {
      const device_id = await AsyncStorage.getItem('device_id');
      const userInfo = await getValue('userInfo');
      const bearerToken = userInfo?.bearer_token;
      setToken(bearerToken);
      setDeviceID(device_id);
    } catch (error) {
      console.error('Error fetching device ID:', error);
    }
  };

  const getTaskList = async () => {
    const token_no = "Bearer " + token;
    setLoading(true);

    try {
      const url = `${BASE_URL_TESTING}leads-view?uuid=${lead?.uuid}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': token_no,
          'device_id': deviceid,
          'Accept': 'application/json',
        },
      });

      const result = await response.json();

      if (response.status === 200 && result.status === 'success') {
        setTasks(result.activity);
        setOverDue(result.overdue);
        setDetails(result.data);
      } else {
        console.warn('Task list fetch failed:', result?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching task list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDeviceId();
   if (details) {
    setDetails({
      ...details,
      stage_id: 1,
      lead_id: details.id, // overwrite lead_id with id
    });
  }
  }, []);

  useEffect(() => {
    if (token && deviceid) {
      getTaskList();
    }
  }, [token, deviceid]);

  const getInitials = (name) => {
    if (!name) return '';
    return name.trim().split(' ').map(p => p[0].toUpperCase()).join('');
  };

  const dataToShow = selectedTab === 'all' ? tasks : overDue;

  return (
    <View className="flex-1 bg-white">
      <CustomHeader name="View Lead" isBackIcon={true} />

      <View className="flex-row items-center justify-between ml-5 mr-5">
        <View className="flex-row items-center">
          <View className="bg-green-200 rounded-full w-10 h-10 items-center justify-center mr-1">
            <Text className="text-black font-bold">{getInitials(lead.lead_name)}</Text>
          </View>
          <View className="ml-1">
            <Text className="text-black font-semibold text-[12px]">{lead.lead_name}</Text>
            <Text className="text-[10px] text-gray-700">{lead.lead_id}</Text>
          </View>
        </View>

        <TouchableOpacity className="rounded-xl bg-blue-600 px-3 py-2 m-2">
          <Text className="text-white text-[10px] mr-1">{lead.is_closed_type}</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row flex-wrap gap-2 p-2">
        <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-xl"   onPress={() => setShowModal(true)}
>
          <Text className="text-white text-[10px]">View Product Details</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-xl"  onPress={() => handleNavigateToSchedule('schedule')}
>
          <Text className="text-white text-[10px]">Schedule</Text>
        </TouchableOpacity>
        <Pressable className="bg-blue-600 px-4 py-2 rounded-xl">
          <Text className="text-white text-[10px]">Go to Project</Text>
        </Pressable>
      </View>

      <View className="border-t border-gray-200 mb-2 mt-3" />

      <View className="flex-row bg-gray-200 p-1 rounded-xl self-center">
        <Pressable
          onPress={() => setSelectedTab('all')}
          className={`px-6 py-2 rounded-xl ${selectedTab === 'all' ? 'bg-blue-600' : ''}`}
        >
          <Text className={`text-[10px] ${selectedTab === 'all' ? 'text-white' : 'text-black'}`}>
            All Activities
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setSelectedTab('overdue')}
          className={`px-4 py-2 rounded-xl ${selectedTab === 'overdue' ? 'bg-blue-600' : ''}`}
        >
          <Text className={`text-[10px] ${selectedTab === 'overdue' ? 'text-white' : 'text-black'}`}>
            Overdue
          </Text>
        </Pressable>
      </View>

      <View className="flex-row justify-end mt-1">
        <TouchableOpacity
          className="flex-row items-center rounded-xl bg-blue-600 px-3 py-2 m-2"
            onPress={() => handleNavigateToSchedule('activity')}

        >
          <FontAwesome name="plus" size={12} color="#FFFFFF" />
          <Text className="text-white text-[10px] ml-1">Add Activity</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        style={{ marginTop: 10, marginBottom: 70 }}
        data={dataToShow}
        keyExtractor={(item) => item.uuid}
        renderItem={({ item }) => (
          <LeadRowItem
            item={item}
            isExpanded={item.uuid === expandedId}
            onToggle={handleToggle}
          />
        )}
      />

      {selectedTab === 'all' && tasks.length === 0 && (
        <Text style={{ textAlign: 'center' }}>No activity found.</Text>
      )}
      {selectedTab === 'overdue' && overDue.length === 0 && (
        <Text style={{ textAlign: 'center' }}>No overdue tasks found.</Text>
      )}
<ProductDetailsModal visible={showModal} onClose={() => setShowModal(false)} item={details}/>


      <CustomFooter isLead={true} />
    </View>
  );
};

export default LeadDetailsScreen;
