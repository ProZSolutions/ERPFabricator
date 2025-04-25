import React, { useEffect, useState} from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Platform ,Image,ActivityIndicator,FlatList} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import { RNCamera } from 'react-native-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getValue, removeValue } from "../../component/AsyncStorage/AsyncStorage";
import CustomFooter from '../../component/Footer/CustomFooter';
import SearchInputBox from '../../component/SearchInputBox/SearchInputBox';
import TaskItemRow from '../../screens/Tasks/TaskItemRow';

import CustomHeader from '../../component/Header/CustomHeader';
 import { styled } from 'nativewind';
 
import moment from 'moment';

 

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

function TaskList() {
        const [search, setSearch] = useState("");
      const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [deviceid,setDeviceID]=useState(null);
  const [token,setToken] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(null);
  const [tasks, setTasks] = useState([]);

  


 
 

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

const getTaskList = async (page = 1) => {
  const token_no = "Bearer " + token;
  setLoading(true);

  console.log("token",token_no+" device "+deviceid);
  try {
    const response = await fetch(`https://erpbackendtesting.proz.in/api/crm/crmtask-mylist?page=${page}`, {
      method: 'POST', // use GET if supported; otherwise keep as POST with body
      headers: {
        'Authorization': token_no,
        'device_id': deviceid,
        'Accept': 'application/json',
      },
    });

    const result = await response.json();
    console.log('Task List Response:', result);

    if (response.status === 200 && result.status === 'success') {
      const data = result.data;
      setTasks(prev => [...prev, ...data.data]); // Append new tasks
      setCurrentPage(data.current_page);
      setLastPage(data.last_page);
    } else {
      console.warn('Task list fetch failed:', result.message);
    }
  } catch (error) {
    console.log('Error fetching task list:', error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    const handler = setTimeout(() => {
       getDeviceId();
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, []);
  useEffect(() => {
    if (token && deviceid) {
      getTaskList(1);
     }
  }, [token, deviceid]);

  
 
  return (
    <View className="flex-1 bg-white">
      <CustomHeader name="Task List" isBackIcon={true} />
      <SearchInputBox value={search} onChangeText={handleInputSearchChange} />


      <FlatList style={{marginTop:10,marginBottom:70}}
        data={tasks}
        keyExtractor={(item) => item.uuid}
        renderItem={({ item }) => (
          <TaskItemRow
                name={item.assigned_to_name}
                dueDate={item.days_overdue}
                status={item.is_completed}
                details={item}
          />
        )}
        ListFooterComponent={loading ? (
          <ActivityIndicator size="small" color="#0000ff" className="my-2" />
        ) : null}
        onEndReached={() => {
          if (!loading && currentPage < lastPage) {
            getTaskList(currentPage + 1);
          }
        }}
        onEndReachedThreshold={0.5}
      />


      <CustomFooter  />

     </View>
  );
}

 
export default TaskList;
