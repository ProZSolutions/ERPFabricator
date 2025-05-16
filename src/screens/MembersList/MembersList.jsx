import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Platform ,Image,ActivityIndicator,FlatList} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import { RNCamera } from 'react-native-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getValue, removeValue } from "../../component/AsyncStorage/AsyncStorage";
import CustomFooter from '../../component/Footer/CustomFooter';


import CustomHeader from '../../component/Header/CustomHeader';
import Container from '../../component/Container/Container';
import { styled } from 'nativewind';
import AttendanceRow from '../MembersList/AttendanceRow';

import moment from 'moment';



const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

function MembersList() {
  const [activeTab, setActiveTab] = useState(1); // Default tab is 1 (first tab)
  const navigation = useNavigation();
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [uri,setUri]=useState(null);
  const [encode,setEncode]=useState(null);
  const camera = useRef(null);  // Using useRef for the camera
  const [loading, setLoading] = useState(false);
  const [deviceid,setDeviceID]=useState(null);
  const [token,setToken] = useState(null);
  const [punchStatus, setPunchStatus] = useState(0); // default 0 (not punched in)
  const [showTracking, setShowTracking] = useState(false);


  const [attendanceData, setAttendanceData] = useState([]);


  const tabs = [
    { id: 1, label: 'Office', title: 'office' },
    { id: 2, label: 'Home', title: 'home' },
    { id: 3, label: 'Client', title: 'client' },
  ];

  const getCurrentLocation = async () => {
    console.log('Get current location called', Platform.OS);

    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permission granted');

          Geolocation.getCurrentPosition(
            (position) => {
              console.log('Current location:', position);
              setLatitude(position.coords.latitude);
              setLongitude(position.coords.longitude);
            },
            (error) => {
              console.error('Location error:', error);
              Alert.alert('Error', 'Unable to fetch location');
            },
            {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 10000,
              forceRequestLocation: true,   // Important for Android
              showLocationDialog: true,     // Ask GPS to turn on
            }
          );
        } else {
          Alert.alert('Permission Denied', 'Location permission is required');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      // iOS
      Geolocation.requestAuthorization('whenInUse').then((result) => {
        if (result === 'granted') {
          Geolocation.getCurrentPosition(
            (position) => {
              console.log('Current location:', position);
              setLatitude(position.coords.latitude);
              setLongitude(position.coords.longitude);
            },
            (error) => {
              console.error('Location error:', error);
              Alert.alert('Error', 'Unable to fetch location');
            },
            {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 10000,
            }
          );
        } else {
          Alert.alert('Permission Denied', 'Location permission is required');
        }
      });
    }
  };
 

  const takePicture = async () => {
    console.log("take pickture calling ");
    if (camera.current) {
      const options = { quality: 0.5, base64: true };
      const data = await camera.current.takePictureAsync(options);
      console.log(data.uri);  // This is the path of the image
      //console.log(data.base64);  // This is the base64 encoded image string
      setUri(data.uri);
      setEncode(data.base64);
      if (token && deviceid) {
        console.log("Token and Device ID fetched, calling checkAttendanceStatus");
        checkAttendanceStatus();
      } else {
        console.log("Token or Device ID not found");
      }

    }else{
      console.log(" come to camera else part ");
    }
  };
  const handleCheckIn = async () => {
    if (!uri) {
      Alert.alert('Error',  'Capture Image for Attendance');
      return;
    }
    if(!latitude){
      Alert.alert('Error',  'Cannot able to get current location');
      return;
    }
    const activeTabTitle = tabs.find(tab => tab.id === activeTab)?.title;
    setLoading(true);
     const formData = new FormData();
    formData.append('latitude', latitude.toString());
    formData.append('longitude', longitude.toString());
    formData.append('pin_work_location', activeTabTitle);
    formData.append('file', {
      uri: uri,
      type: 'image/jpeg', // or 'image/png'
      name: 'photo.jpg',
    });
    let token_no = "Bearer "+token;
 
    try {
      const response = await fetch('https://erphrms.proz.in/api/atten-punchin', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': token_no, 
          'device_id':deviceid
         },
        body: formData,
      });
  
      const data = await response.json();
       if (response.status === 200) {
        if (data.status === 'success') {
          const syncId = data?.punchin_data?.sync_id; // get sync_id safely

          if (syncId) {   
              try {
                await AsyncStorage.setItem('syncId', syncId);
                console.log('Device ID saved:', syncId);
              } catch (error) {
                console.error('Error saving device ID:', error);
              }
          } 
          Alert.alert('Success', 'Check In Successful!', [
            { text: 'OK', onPress: () => navigation.navigate('Home') }
          ]);
        } else {
          Alert.alert('Error', data.message || 'Something went wrong.');
        }
      } else {
        const errorMessage = data.message || data.error || 'Something went wrong.';
        Alert.alert('Error', errorMessage);
      }
  
      // You can clear uri or navigate after success
      // setUri(null);
  
    } catch (error) {
      console.log('Error uploading:', error);
    }finally{
      setLoading(false);
    }
  };
  const handleCheckOut = async () => {
    if (!uri) {
      Alert.alert('Error',  'Capture Image for Attendance');
      return;
    }
    if(!latitude){
      Alert.alert('Error',  'Cannot able to get current location');
      return;
    }
    let syncId=null;
    try {
      syncId = await AsyncStorage.getItem('syncId');
    } catch (error) {
       return null;
    }
 
    const activeTabTitle = tabs.find(tab => tab.id === activeTab)?.title;
    setLoading(true);
     const formData = new FormData();
    formData.append('latitude', latitude.toString());
    formData.append('longitude', longitude.toString());
    formData.append('pout_work_location', activeTabTitle);
    formData.append("sync_id",syncId);
    formData.append('file', {
      uri: uri,
      type: 'image/jpeg', // or 'image/png'
      name: 'photo.jpg',
    });
    let token_no = "Bearer "+token;
 
    try {
      const response = await fetch('https://erphrms.proz.in/api/atten-punchout', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': token_no, 
          'device_id':deviceid
         },
        body: formData,
      });
  
      const data = await response.json();
       if (response.status === 200) {
        if (data.status === 'success') {
          Alert.alert('Success', 'Check Out Successful!', [
            { text: 'OK', onPress: () => navigation.navigate('Home') }
          ]);
        } else {
          Alert.alert('Error', data.message || 'Something went wrong.');
        }
      } else {
        const errorMessage = data.message || data.error || 'Something went wrong.';
        Alert.alert('Error', errorMessage);
      }
  
      // You can clear uri or navigate after success
      // setUri(null);
  
    } catch (error) {
      console.log('Error uploading:', error);
    }finally{
      setLoading(false);
    }
  };

  const checkAttendanceStatus = async () => {
    console.log(" check attendance page called ");
  
    let token_no = "Bearer " + token;
    setLoading(true);
  
    const formData = new FormData();
    formData.append('latitude', latitude.toString());
    formData.append('longitude', longitude.toString());
    console.log("token no ",token_no+" device id "+deviceid);
    try {
      const response = await fetch('https://erphrms.proz.in/api/check-atten', {
        method: 'POST', // 🔥 changed to POST
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': token_no,
          'device_id': deviceid,
          'Accept': 'application/json', // 🔥 add this to force JSON return
        },
        body: formData,
      });
  
      const data = await response.json();
      console.log('Check Attendance Response:', data+" response "+response.status);
  
      if (response.status === 200 && data.status === 'success') {
        setLoading(false);
        const punchStatusFromApi = data.data.punch_status;
        const syncIdFromApi = data.data.sync_id;
  
        setPunchStatus(punchStatusFromApi);  // 1 or 0
  
        if (syncIdFromApi) {
          await AsyncStorage.setItem('syncId', syncIdFromApi);
          console.log('Saved sync_id:', syncIdFromApi);
        }
      } else {
        setLoading(false);
        console.log('Attendance check failed:', data.message || 'Unknown error');
        Alert.alert('Error', data.message || 'Attendance check failed.');
      }
  
    } catch (error) {
      setLoading(false);
      console.log('Error checking attendance:', error);
      Alert.alert('Error', 'Network or server error.');
    } finally {
      setLoading(false);
      console.log('come to finally ');
    }
  };
  


  const getDeviceId = async () => {
    try {
      const device_id = await AsyncStorage.getItem('device_id');
      const userInfo = await getValue('userInfohrms'); // 👈 get token from storage
      const bearerToken = userInfo?.bearer_token; 
      setToken( bearerToken);
      setDeviceID(device_id);
      console.log("token",bearerToken+" device id "+device_id);
    } catch (error) {
      console.error('Error fetching device ID:', error);
      return null;
    }
  };
  const fetchAttendanceData = async () => {
    let token_no = "Bearer " + token;
    setLoading(true);
  
    try {
      const response = await fetch('https://erphrms.proz.in/api/atten-list', {
        method: 'POST', // or 'GET' based on your API config
        headers: {
          'Authorization': token_no,
          'device_id': deviceid,
          'Accept': 'application/json',
        },
      });
  
      const data = await response.json();
      console.log('Attendance List Response:', data);
  
      if (response.status === 200 && data.status === 'success') {
        const list = data.data;  
  
        const transformedData = list.in_time.map((inTime, index) => ({
          in_time: inTime,
          out_time: list.out_time[index] || '-',
          work_hours: list.work_hours[index] || '-',
          pin_work_location: list.pin_work_location[index] || '-',
          pout_work_location: list.pout_work_location[index] || '-',
        }));
  
        setAttendanceData(transformedData);
      } else {
        console.warn('Attendance list fetch failed:', data.message);
       }
  
    } catch (error) {
      console.log('Error fetching attendance list:', error);
     } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    const handler = setTimeout(() => {
      getCurrentLocation();
      getDeviceId();
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, []);
  useEffect(() => {
    if (token && deviceid) {
      fetchAttendanceData();
    }
  }, [token, deviceid]);

  
 
  return (
    <View className="flex-1 bg-white">
      <CustomHeader name="Attendance" isBackIcon={true} />
      <StyledView className="px-4 items-end">


      {attendanceData && attendanceData.length > 0 && (
        <>
         <StyledView className='mb-[10px]'>
         <TouchableOpacity onPress={() => setShowTracking(!showTracking)}>
            <Text className="text-black underline text-custom-companytxt text-[12px] font-normal mt-2 text-right" >
            {showTracking ? 'Hide Tracking' : 'Show Tracking'}
            </Text>
          </TouchableOpacity>

        </StyledView>
        {showTracking && (
        <StyledView className='flex-row'>
        <FlatList
            data={attendanceData}
            renderItem={({ item,index }) => <AttendanceRow item={item} index={index}  />}
            keyExtractor={(item, index) => index.toString()}
          />
        </StyledView>
      )}
      </>
      )}


        <StyledView className="flex-row">
            {tabs.map((tab, index) => (
              <React.Fragment key={tab.id}>
                <StyledTouchableOpacity
                  onPress={() => setActiveTab(tab.id)}
                  className={`flex-1 items-center py-3 ${
                    activeTab === tab.id ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                >
                  <StyledText
                    className={`text-sm font-semibold ${
                      activeTab === tab.id ? 'text-white' : 'text-gray-500'
                    }`}
                  >
                    {tab.label}
                  </StyledText>
                </StyledTouchableOpacity>

                {index < tabs.length - 1 && (
                  <StyledView className="w-[1px] bg-gray-100" />
                )}
              </React.Fragment>
            ))}
        </StyledView>



       
        {uri == null ? (
          <StyledView style={{ height: 400, borderRadius: 10, overflow: 'hidden' }}>
          <>
              <RNCamera
                ref={camera}
                style={stylesss.preview}
                type={RNCamera.Constants.Type.front}
                flashMode={RNCamera.Constants.FlashMode.off}
                androidCameraPermissionOptions={{
                  title: 'Permission to use camera',
                  message: 'We need your permission to use your camera',
                  buttonPositive: 'Ok',
                  buttonNegative: 'Cancel',
                }}
              />
               

               <StyledView className="flex-row justify-center items-center space-x-4 mt-4">
                  <StyledTouchableOpacity 
                    className="flex-1 items-center py-3 bg-blue-500 rounded-lg" 
                    onPress={takePicture}
                  >
                    <StyledText className="text-sm font-semibold text-white">
                      Capture Image
                    </StyledText>
                  </StyledTouchableOpacity>
                </StyledView>


              </>
              </StyledView>

              ) : (
                <>
                <StyledView className="flex items-center justify-center mt-4 w-full">
  <Image
    source={{ uri: uri }}
    style={{ width: 200, height: 200, borderRadius: 10 }}
    resizeMode="cover"
  />
</StyledView>

             {loading && (
              <View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center z-10 ">
                    <ActivityIndicator size="large" color="#335ec7" />
              </View>

                  )
              }
                <StyledView className="flex-row justify-center items-center space-x-4 mt-4">
                  <StyledTouchableOpacity className={`flex-1 items-center py-3 ${punchStatus === 1 ? 'bg-gray-400' : 'bg-blue-500'}
                   rounded-lg`} 
                   disabled={punchStatus === 1}   // 👈 Disable if punchStatus is 1
                   onPress={handleCheckIn}>
                        <StyledText className={`text-sm font-semibold text-white`} >
                          Check In
                        </StyledText>
                  </StyledTouchableOpacity>

                  <StyledTouchableOpacity className={`flex-1 items-center py-3 
                  ${punchStatus === 0 ? 'bg-gray-400' : 'bg-blue-500'} rounded-lg`} 
                  disabled={punchStatus === 0}   // 👈 Disable if punchStatus is 1
                  onPress={handleCheckOut}>
                        <StyledText className={`text-sm font-semibold text-white`} >
                          Check Out
                        </StyledText>
                  </StyledTouchableOpacity>

                 </StyledView>
                </>
              )}

               
     </StyledView>
     <CustomFooter  />
     </View>
  );
}

const stylesss = StyleSheet.create({
  preview: {
   width: 300,
  height: 300,
  alignSelf: 'center',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 10,
  overflow: 'hidden',
  marginTop: 20,
  },
  capture: {
    flex: 0,
    backgroundColor: '#000',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
    color:'#fff'
  },
  buttonContainer: {
  alignItems: 'center',
  marginTop: 10,
},
});

export default MembersList;
