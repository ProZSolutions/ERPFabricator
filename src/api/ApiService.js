import axios from 'axios';
import { getValue } from '../component/AsyncStorage/AsyncStorage';


 
const api = axios.create({
    baseURL: 'https://erpbackend.proz.in/api',
    timeout: 100000,
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'fhyDNulWAg9NzBsLmw4Lf6J47pEhQI37w5rWVu9uF',
     }
});

api.interceptors.request.use(
    async (config) => {
        const token = await getValue('userInfo');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token.bearer_token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getData = async (endpoint) => {
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const postData = async (endpoint, payload) => {
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
