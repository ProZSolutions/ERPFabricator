import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getValue } from "../../component/AsyncStorage/AsyncStorage";
import CustomFooter from '../../component/Footer/CustomFooter';
import SearchInputBox from '../../component/SearchDisable/SearchDisable';
import CallHistoryRow from '../../screens/CallTracking/CallHistoryRow';
import { BASE_URL_TESTING } from '../../api/Config';
import CustomHeader from '../../component/Header/CustomHeader';
import SearchModal from './SearchModal';

function CallHIstory() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [deviceid, setDeviceID] = useState(null);
  const [token, setToken] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({});

  const openSearchModal = () => setModalVisible(true);
  const closeSearchModal = () => setModalVisible(false);

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

  const getTaskList = async (page = 1, newFilters = filters) => {
    const token_no = "Bearer " + token;
    setLoading(true);

    try {
      const body = { ...newFilters };
      const url = `${BASE_URL_TESTING}calltracking-list?page=${page}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': token_no,
          'device_id': deviceid,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (response.status === 200 && result.status === 'success') {
        const data = result.data;
        setTasks(page === 1 ? data.data : [...tasks, ...data.data]);
        setCurrentPage(data.current_page);
        setLastPage(data.last_page);
      } else {
        if (page === 1) setTasks([]);
        console.warn('Task list fetch failed:', result.message);
      }
    } catch (error) {
      console.error("Error fetching task list", error);
        Alert.alert('Error', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputSearchChange = (value) => {
    setSearch(value);
    const updatedFilters = { ...filters, keyword: value };
    setFilters(updatedFilters);
    getTaskList(1, updatedFilters);
  };

  const handleModalSearch = (payload) => {
    setFilters(payload);
    getTaskList(1, payload);
    closeSearchModal();
  };

  useEffect(() => {
    getDeviceId();
  }, []);

  useEffect(() => {
    if (token && deviceid) {
      getTaskList(1, filters);
    }
  }, [token, deviceid]);

  return (
    <View className="flex-1 bg-white">
      <CustomHeader name="Call History" isBackIcon={true} />
      <SearchInputBox
        value={search}
        onChangeText={handleInputSearchChange}
        onPress={openSearchModal}
      />
      {tasks.length === 0 && !loading ? (
        <Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>
          No list found
        </Text>
      ) : (
            <FlatList
              style={{ marginTop: 10, marginBottom: 70 }}
              data={tasks}
              keyExtractor={(item) => item.uuid}
              renderItem={({ item }) => <CallHistoryRow details={item} />}
              ListFooterComponent={loading ? (
                <ActivityIndicator size="small" color="#0000ff" style={{ marginVertical: 8 }} />
              ) : null}
              onEndReached={() => {
                if (!loading && currentPage < lastPage) {
                  getTaskList(currentPage + 1);
                }
              }}
              onEndReachedThreshold={0.5}
            />
      )}

      <SearchModal
        visible={isModalVisible}
        onClose={closeSearchModal}
        onSearch={handleModalSearch}
      />

      <CustomFooter isCalls={true} />
    </View>
  );
}

export default CallHIstory;
