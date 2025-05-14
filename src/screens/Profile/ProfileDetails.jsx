import { View, Text, Image, ScrollView,TouchableOpacity,Alert,ActivityIndicator} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getValue, removeValue } from "../../component/AsyncStorage/AsyncStorage";

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomHeader from '../../component/Header/CustomHeader';
import CustomFooter from '../../component/Footer/CustomFooter';
import { launchImageLibrary } from 'react-native-image-picker';
import { useEffect, useState } from 'react';
import { getDataHRMS, postDataHRMS } from '../../api/ApiHRMSService';
import { BASE_URL_HRMS } from '../../api/Config';
import axios from 'axios';




export default function ProfileScreen() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [profileData, setProfileData] = useState(null);
      const [loading, setLoading] = useState(false);
      const [deviceid,setDeviceID]=useState(null);
      const [token,setToken] = useState(null);

    const handlePickImage = () => {
        launchImageLibrary(
          {
            mediaType: 'photo',
            includeBase64: true,
          },
          (response) => {
            if (response.didCancel) {
             } else if (response.errorCode) {
             } else if (response.assets) {
              const image = response.assets[0];
              const fileSizeInMB = image.fileSize / (1024 * 1024);
    
              if (fileSizeInMB <= 2) {
                setSelectedImage(image);

                Alert.alert(
                    'Confirm Upload',
                    'Do you want to upload this image?',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'Upload',
                        onPress: () => {
                          setSelectedImage(image);
                          uploadImageToServer(image); // 👈 Call upload function here
                        },
                      },
                    ],
                    { cancelable: true }
                  );


              } else {
                Alert.alert('Error', 'File size exceeds 2MB. Please choose a smaller file.');
              }
            }
          }
        );
      };
      const uploadImageToServer = async (image) => {
        setLoading(true);
        try {
          const userInfo = await getValue('userInfohrms');
          const bearerToken = userInfo?.bearer_token;
          const profileId = profileData?.id;
      

        


          const formData = new FormData();
          formData.append('profile_id', profileId); // Add profile ID
          formData.append('image', {
            uri: image.uri,
            name: image.fileName,
            type: image.type,
          });
 
          const response = await fetch('https://erphrms.proz.in/api/employee-profile-update', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'device_id': deviceid,
                 'x-api-key': 'fhyDNulWAg9NzBsLmw4Lf6J47pEhQI37w5rWVu9uF'
              },
            body: formData,
          });
      
          const result = await response.json(); // This will now succeed
           Alert.alert('Success', 'Image uploaded successfully!');
        } catch (error) {
           Alert.alert('Error', 'Image upload failed.');
        } finally {
          setLoading(false);
        }
      };
      
      const getDeviceId = async () => {
        setLoading(true);
        try {
          const device_id = await AsyncStorage.getItem('device_id');
          const userInfo = await getValue('userInfohrms');  
          const bearerToken = userInfo?.bearer_token; 
          setToken( bearerToken);
          setDeviceID(device_id);
         } catch (error) {
           return null;
        }finally{
            setLoading(false);
        }
      };
      const fetchProfile = async () => {
        setLoading(true);
        const userInfoStr = await AsyncStorage.getItem('userInfohrms');
        const deviceId = await AsyncStorage.getItem('device_id');
      
        const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
        const bearerToken = userInfo?.bearer_token;
       
        try {
          const res = await axios.get('https://erphrms.proz.in/api/employee-profile', {
            headers: {
              'Authorization': `Bearer ${bearerToken}`,
              'device_id': deviceId,
              'Content-Type': 'application/json',
              'x-api-key': 'fhyDNulWAg9NzBsLmw4Lf6J47pEhQI37w5rWVu9uF'
            }
          });
      
           if (res.data.status === 'success') {
             setProfileData(res.data.data); // <-- set only the profile object
          }
        } catch (err) {
            
         }finally{
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
        useEffect(()=>{
            fetchProfile();
        },[deviceid]);

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <CustomHeader name="Profile Details" isBackIcon={true} />

        {loading && (
              <View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center z-10 ">
                    <ActivityIndicator size="large" color="#335ec7" />
              </View>

                  )
              }
      <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Profile Card */}
        <View className="items-center bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <TouchableOpacity   onPress={handlePickImage} >
          <View className="relative">
            <Image
              source={{
                    uri: selectedImage?.uri 
                    ? selectedImage.uri 
                    : profileData?.image,
                }}
              className="w-24 h-24 rounded-full"
            />
            <View className="absolute bottom-0 right-0 bg-orange-500 rounded-full p-1">
              <FontAwesome name="pencil" size={16} color="white" />
            </View>
          </View>
          </TouchableOpacity>

          <View className="mt-4 space-y-1">
            <Text className="text-sm font-semibold text-gray-800">{profileData?.name ?? 'N/A'}</Text>
            <Text className="text-[12px] text-gray-500">Employee ID: {profileData?.emp_no ?? 'N/A'}</Text>
            <Text className="text-[12px] text-gray-500">Department: {profileData?.department ?? 'N/A'}</Text>
            <Text className="text-[12px] text-gray-500">Designation: {profileData?.designation ?? 'N/A'}</Text>
            <Text className="text-[12px] text-gray-500">Contact: {profileData?.contact ?? 'N/A'}</Text>
            <Text className="text-[12px] text-gray-500">Mail: {profileData?.email ?? 'N/A'}</Text>
          </View>
        </View>

        {/* Info Boxes */}
        <View className="mt-4 space-y-3">
          <InfoCard icon={<FontAwesome name="venus" size={14} color="#AAA4A4" />} label="Gender" value={profileData?.gender ?? 'N/A'} />
          <InfoCard icon={<MaterialIcons name="calendar-today" size={14} color="#AAA4A4" />} label="Date of Birth" value={profileData?.dob ?? 'N/A'} />
          <InfoCard icon={<MaterialCommunityIcons name="blood-bag" size={14} color="#AAA4A4" />} label="Blood Group" value={profileData?.bloodgroup ?? 'N/A'} />
          <InfoCard icon={<FontAwesome name="id-card" size={14} color="#AAA4A4" />} label="Aadhar" value={profileData?.aadhar ?? 'N/A'} />
          <InfoCard icon={<FontAwesome name="id-card" size={14} color="#AAA4A4" />} label="Address" value={profileData?.address ?? 'N/A'} />
         </View>
      </ScrollView>

      <CustomFooter />
    </View>
  );
}

const InfoCard = ({ icon, label, value }) => (
  <View className="flex-row items-center bg-white mb-2 rounded-xl p-4 space-x-4 shadow-sm">
    <View className="bg-gray-100 p-2 rounded-full">{icon}</View>
    <View>
      <Text className="text-sm text-gray-400 text-[13px]">{label}</Text>
      <Text className="text-base text-gray-700 text-[11px]">{value}</Text>
    </View>
  </View>
);
