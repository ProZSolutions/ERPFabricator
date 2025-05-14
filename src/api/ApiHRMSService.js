import axios from 'axios';
import { getValue } from '../component/AsyncStorage/AsyncStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';


 
const api = axios.create({
    baseURL: 'https://erphrms.proz.in/api',
    timeout: 100000,
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'fhyDNulWAg9NzBsLmw4Lf6J47pEhQI37w5rWVu9uF',
     }
});

api.interceptors.request.use(
    async (config) => {
        const token = await getValue('userInfohrms');


        const userInfoStr = await AsyncStorage.getItem('userInfohrms');
        const deviceId = await AsyncStorage.getItem('device_id');
  
        const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
        const bearerToken = userInfo?.bearer_token;
        console.log("bearer token "+bearerToken+" device id "+deviceId);

        if (token) {
             config.headers['Authorization'] = `Bearer ${token.bearer_token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getDataHRMS = async (endpoint) => {
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const postDataHRMS = async (endpoint, payload) => {
    try {
        const response = await api.post(endpoint, payload);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

const handleError = (error) => {
    if (error.response) {
        //console.error('API Error:', error.response.data);
    } else if (error.request) {
        console.error('No response from server:', error.request);
    } else {
        console.error('Error setting up request:', error.message);
    }
    throw error;
};

export default api;
