import React from 'react';
import { View, Text, TouchableOpacity,Linking ,Alert} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';


const ContactCard = ({ details }) => {
  const navigation = useNavigation();


    const colors = [
        'bg-red-200',
        'bg-green-200',
        'bg-blue-200',
        'bg-purple-200',
        'bg-pink-200',
        'bg-yellow-200',
        'bg-indigo-200',
        'bg-teal-200',
      ];
      const toCamelCase = (name) => {
        if (!name) return '';
        return name
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      };
    

      const getLabelStyle = (label) => {
        switch (label) {
          case 'Quotation':
            return { bg: 'bg-blue-100', text: 'text-blue-700' };
          case 'Enquiry':
            return { bg: 'bg-yellow-100', text: 'text-yellow-700' };
          case 'Field Visit':
            return { bg: 'bg-green-100', text: 'text-green-700' };
          default:
            return { bg: 'bg-gray-100', text: 'text-gray-700' };
        }
      };
      
      const label = details.stage_name; // or "Enquiry", "Field Visit"
      const { bg, text } = getLabelStyle(label);
      const getRandomColor = () => {
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
      };
      const getInitials = (name) => {
        if (!name) return '';
        const parts = name.trim().split(' ');
        const initials = parts.map(p => p.charAt(0).toUpperCase()).join('');
        return initials;
      };
      
      const firstLetter = getInitials(details.lead_name);
    const handleCall = (phoneNumber) => {
        const url = `tel:${phoneNumber}`;
        console.log('Trying to open:', url);
      
        Linking.openURL(url).catch((err) => {
            Alert.alert('Error', 'Phone call not supported on this device');
            console.error('Failed to open dialer', err);
          });
    };
    const openWhatsApp = (phoneNumber) => {
        const formattedNumber = phoneNumber.replace(/[^\d]/g, ''); // remove non-digits
        const url = `https://wa.me/${formattedNumber}`; // WhatsApp deep link
        console.log("whatsappurl",url);
        Linking.openURL(url).catch((err) => {
            Alert.alert('Error', 'Failed to open WhatsApp');
            console.error('WhatsApp open error:', err);
          });
      };
      const openGmail = (email) => {
        const subject = 'Proz Solutions';
        const body = 'Hello Sir/Mam,';
        const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
        Linking.openURL(url).catch((err) => {
          Alert.alert('Error', 'Failed to open email app');
          console.error('Email open error:', err);
        });
      };
  return (
    <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 m-3">
       <View className="flex-row items-center justify-between">
         <View className="flex-row items-center">
            <View className={`${getRandomColor()} rounded-full w-10 h-10 items-center justify-center mr-1`}>
                    <Text className="text-black font-bold">{firstLetter}</Text>
            </View>

          <View>
            <Text className="text-black font-semibold text-base text-[12px]">{toCamelCase(details.lead_name)}</Text>
            <View className={`${bg} px-4 py-0.5 rounded-full self-start`}>
                    <Text className={`text-[10px] ${text}`}>{label}</Text>
            </View>
          </View>
        </View>

         <View className="flex-row items-center space-x-3">
        {details?.lead_contact && (
          <View className="items-center">
            <TouchableOpacity className="border border-gray-300 p-2 rounded-full"   onPress={() => handleCall(details.lead_contact)}>
              <FontAwesome name="phone" size={16} color="#AFB1B5" />
            </TouchableOpacity>
            <Text className="text-[9px] text-gray-500">Call</Text>
          </View>
        )}
        {details?.whatsapp_contact && (
          <View className="items-center">
            <TouchableOpacity className="border border-gray-300 p-2 rounded-full" onPress={() => openWhatsApp(details.whatsapp_contact)}>
              <FontAwesome name="whatsapp" size={16} color="#AFB1B5" />
            </TouchableOpacity>
            <Text className="text-[9px] text-gray-500">WhatsApp</Text>
          </View>
        )}
        {details?.email && (
          <View className="items-center">
            <TouchableOpacity className="border border-gray-300 p-2 rounded-full" onPress={() => openGmail(details.email)}>
              <FontAwesome name="envelope" size={16} color="#AFB1B5" />
            </TouchableOpacity>
            <Text className="text-[9px] text-gray-500">Mail</Text>
          </View>
        )}
          
        </View>
      </View>

      {/* Bottom Row: View Link Right Aligned */}
      <View className="flex-row justify-end mt-3">
        <TouchableOpacity className="flex-row items-center" onPress={()=>navigation.navigate('LeadDetails', { lead: details })} >
          <Text className="text-blue-600 text-[10px] mr-1">View</Text>
          <FontAwesome name="angle-right" size={16} color="#2563eb" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ContactCard;
