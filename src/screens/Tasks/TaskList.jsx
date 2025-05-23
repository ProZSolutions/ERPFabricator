import React, { useEffect, useState,useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Platform ,Image,ActivityIndicator,FlatList} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import { RNCamera } from 'react-native-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getValue, removeValue } from "../../component/AsyncStorage/AsyncStorage";
import CustomFooter from '../../component/Footer/CustomFooter';
import SearchInputBox from '../../component/SearchDisable/SearchDisable';
import TaskItemRow from '../../screens/Tasks/TaskItemRow';
import { BASE_URL_TESTING } from '../../api/Config';
import SearchModal from './SearchModal';
import { useFocusEffect } from '@react-navigation/native';

import CustomHeader from '../../component/Header/CustomHeader';
 import { styled } from 'nativewind';
 
import moment from 'moment';

 

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

function TaskList() {
//modal properties
const [isModalVisible, setModalVisible] = useState(false);
const handleSearchInputChange = (text) => setSearch(text);
const openSearchModal = () => setModalVisible(true);
const closeSearchModal = () => setModalVisible(false);

const [expandedTaskId, setExpandedTaskId] = useState(null);



        const [search, setSearch] = useState("");
      const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [deviceid,setDeviceID]=useState(null);
  const [token,setToken] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(null);
  const [tasks, setTasks] = useState([]);

  
  useFocusEffect(
    useCallback(() => {
      // Your refresh logic here
      getTaskList(1,{});
    }, [token,deviceid])
  );

 
 

  const getDeviceId = async () => {
    try {
      const device_id = await AsyncStorage.getItem('device_id');
      const userInfo = await getValue('userInfo'); // 👈 get token from storage
      const bearerToken = userInfo?.bearer_token; 
      setToken( bearerToken);
      setDeviceID(device_id);
      console.log("token",bearerToken+" device id "+device_id);
    } catch (error) {
      console.error('Error fetching device ID:', error);
      return null;
    }
  };
  const handleInputSearchChange = (value) => {
    setSearch(value);
};

const getTaskList = async (page = 1, filters = {}) => {
  const token_no = "Bearer " + token;
  setLoading(true);

  if(page==1){
    setTasks([]);
  }
  console.log("token",token_no+" device "+deviceid);
  try {
    console.log(" come to try ");
    const body = {
      ...filters, // ← flat structure as per Postman body
    };
        console.log("body values ",body);
    const response = await fetch(`${BASE_URL_TESTING}crmtask-mylist?page=${page}`, {
      method: 'POST', // use GET if supported; otherwise keep as POST with body
      headers: {
        'Authorization': token_no,
        'device_id': deviceid,
        'Accept': 'application/json',
        'Content-Type': 'application/json',

      },
      body: JSON.stringify(body), // ensure body is correct JSON

    });

    const result = await response.json();
    console.log('Task List Response:', result);

    if (response.status === 200 && result.status === 'success') {
      const data = result.data;
       
      if (page === 1) {
        setTasks(data.data); // ⬅️ Replace old list on fresh filter
      } else {
        setTasks(prev => [...prev, ...data.data]); // Append for pagination
      }
      //setTasks(prev => [...prev, ...data.data]); // Append new tasks
      setCurrentPage(data.current_page);
      setLastPage(data.last_page);
    } else {
      console.warn('Task list fetch failed:', result.message);
    }
  } catch (error) {
    console.log('Error fetching task list:', error);
  } finally {
    console.log(" come to finalle");
    setLoading(false);
  }
};


  useEffect(() => {
       getDeviceId();
  }, []);
  useEffect(() => {
    console.log("token"," as "+token+" device id "+deviceid);
    if (token && deviceid) {
      getTaskList(1,{});
     }
  }, [token, deviceid]);

  
 
  return (
    <View className="flex-1 bg-white">
      <CustomHeader name="Task List" isBackIcon={true} />
      <SearchInputBox value={search} onChangeText={handleInputSearchChange} onPress={openSearchModal}/>
 {tasks.length === 0 && !loading ? (
        <Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>
          No list found
        </Text>
      ) : (

       <FlatList style={{marginTop:10,marginBottom:70}}
        data={tasks}
        keyExtractor={(item) => item.uuid}
        renderItem={({ item }) => (
          <TaskItemRow
                name={item.assigned_to_name}
                dueDate={item.days_overdue}
                status={item.is_completed}
                details={item}
                  isExpanded={expandedTaskId === item.uuid}
onPress={() => {
    setExpandedTaskId(expandedTaskId === item.uuid ? null : item.uuid);
  }}
          />
        )}
        ListFooterComponent={loading ? (
          <ActivityIndicator size="small" color="#0000ff" className="my-2" />
        ) : null}
        onEndReached={() => {
          if (!loading && currentPage < lastPage) {
            getTaskList(currentPage + 1,{});
          }
        }}
        onEndReachedThreshold={0.5}
      />
         )}
 
       <SearchModal
          visible={isModalVisible}
          onClose={closeSearchModal}
          onSearch={(payload) => {
            getTaskList(1,payload);  
          }}
      />

      <CustomFooter isTask={true} />

     </View>
  );
}

 
export default TaskList;
