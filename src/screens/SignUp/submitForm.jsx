import { Alert } from 'react-native';
import { postData } from '../../api/ApiService';
import handleError from '../../component/ErrorHandler/ErrorHandler';

export const submitForm = async (formData, setIsLoading, setModalVisible, setFormRes) => {
  setIsLoading(true);
  try {
    let response = await postData('/registration', formData);
    if (response.status === 'success') {
      Alert.alert(
        'Success',
        'OTP Sent Successfully to Your Mobile Number.',
        [{ text: 'OK', onPress: () => {
            setFormRes(response);
            setModalVisible(true);
        }}],
        { cancelable: false }
      );
    }
  } catch (error) {
    if (error?.response?.data?.status === 'error') {
      Alert.alert('Registration Error', error?.response?.data?.error || 'An error occurred.');
    } else {
      await handleError(error, false);
    }
  } finally {
    setIsLoading(false);
  }
};
