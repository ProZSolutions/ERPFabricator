import AsyncStorage from '@react-native-async-storage/async-storage';

const storeValue = async (key, val) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(val));
  } catch (error) {
    console.error('Error storing', error);
  }
};

const getValue = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return JSON.parse(value);
  } catch (error) {
    console.error('Error retrieving', error);
    return null;
  }
};

const removeValue = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing', error);
  }
};

export { storeValue, getValue, removeValue };
