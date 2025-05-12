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
import CallHistoryRow from '../../screens/CallTracking/CallHistoryRow';
import { BASE_URL_TESTING } from '../../api/Config';

import CustomHeader from '../../component/Header/CustomHeader';
 import { styled } from 'nativewind';
 
import moment from 'moment';

 

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

function CallHIstory() {
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
     } catch (error) {
      console.error('Error fetching device ID:', error);
      return null;
    }
  };
  const handleInputSearchChange = (value) => {
    setSearch(value);
    getTaskList(1, value); // always call page 1 with current search

};

const getTaskList = async (page = 1, searchTerm = '') => {
  const token_no = "Bearer " + token;
  setLoading(true);

  try {
    let url = `${BASE_URL_TESTING}calltracking-list?page=${page}`;
    if (searchTerm) {
      url += `&call_type=${encodeURIComponent(searchTerm)}`;
    }
    console.log("token",token_no+" device "+deviceid+" search url "+url);

    const response = await fetch(url, {
      method: 'POST', // use GET if supported; otherwise keep as POST with body
      headers: {
        'Authorization': token_no,
        'device_id': deviceid,
        'Accept': 'application/json',
      },
    });

    const result = await response.json();
 
    if (response.status === 200 && result.status === 'success') {
      const data = result.data;
     // setTasks(prev => [...prev, ...data.data]); // Append new tasks

     if (page === 1) {
        setTasks(data.data); // replace list if it's the first page
      } else {
        setTasks(prev => [...prev, ...data.data]); // append for pagination
      }
      setCurrentPage(data.current_page);
      setLastPage(data.last_page);
    } else {
        if (page === 1) {
            setTasks([]); // clear old list if first page fails (e.g., no search results)
          }
      console.warn('Task list fetch failed:', result.message);
    }
  } catch (error) {
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
      getTaskList(1,'');
     }
  }, [token, deviceid]);

  
 
  return (
    <View className="flex-1 bg-white">
      <CustomHeader name="Call History" isBackIcon={true} />
      <SearchInputBox value={search} onChangeText={handleInputSearchChange} />


      <FlatList style={{marginTop:10,marginBottom:70}}
        data={tasks}
        keyExtractor={(item) => item.uuid}
        renderItem={({ item }) => (
          <CallHistoryRow
                details={item}
          />
        )}
        ListFooterComponent={loading ? (
          <ActivityIndicator size="small" color="#0000ff" className="my-2" />
        ) : null}
        onEndReached={() => {
          if (!loading && currentPage < lastPage) {
            getTaskList(currentPage + 1,'');
          }
        }}
        onEndReachedThreshold={0.5}
      />


      <CustomFooter isCalls={true} />

     </View>
  );
}

 
export default CallHIstory;
