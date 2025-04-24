import { Alert } from 'react-native';
import { removeValue } from '../AsyncStorage/AsyncStorage';

const handleError = async (error, logout) => {
    if (error.response) {
        console.error('API Error:', error.response.data);

        switch (error.response.status) {
            case 401:
                // Unauthorized - Handle logout and navigate to login
                await removeValue('userInfo');
                if (logout) logout();
                Alert.alert("Session Expired", "You have been logged out due to inactivity. Please log in again.");
                break;
            case 403:
                Alert.alert("Access Denied", "You do not have permission to perform this action.");
                break;
            case 404:
                Alert.alert("Not Found", "The requested resource was not found.");
                break;
            case 500:
                Alert.alert("Server Error", "An internal server error occurred. Please try again later.");
                break;
            default:
                Alert.alert("Error", error.response.data.message || "An unexpected error occurred.");
                break;
        }
    } else if (error.request) {
        console.error('No response from server:', error.request);
        Alert.alert("Network Error", "There was a problem connecting to the server. Please check your internet connection.");
    } else {
        console.error('Error setting up request:', error.message);
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
};

export default handleError;
