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
import LeadRowItem from '../../screens/Lead/LeadRowItem';
import { BASE_URL_TESTING } from '../../api/Config';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

 
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
    getTaskList(1);
};

const getTaskList = async (page = 1) => {
    const token_no = "Bearer " + token;
    setLoading(true);
  
    console.log("token", token_no + " device " + deviceid);
  
    try {
      const url = `${BASE_URL_TESTING}leads-list?page=${page}&search=${search}`;
  
      const response = await fetch(url, {
        method: 'GET',
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
        if (page === 1) {
          setTasks(data.data); // Replace old list on fresh filter
        } else {
          setTasks(prev => [...prev, ...data.data]); // Append for pagination
        }
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
      <CustomHeader name="Lead List" isBackIcon={true} />
      <SearchInputBox value={search} onChangeText={handleInputSearchChange}  />

      <View className="flex-row justify-end mt-1">
        <TouchableOpacity className="flex-row items-center  rounded-xl bg-blue-600 px-3 py-2 m-2" onPress={() => navigation.navigate('AddLead')}
>
          <FontAwesome name="plus" size={12} color="#FFFFFF" />
          <Text className="text-white text-[10px] mr-1"> Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList style={{marginTop:10,marginBottom:70}}
        data={tasks}
        keyExtractor={(item) => item.uuid}
        renderItem={({ item }) => (
          <LeadRowItem
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
