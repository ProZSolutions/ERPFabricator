import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomHeader from '../../component/Header/CustomHeader'; // Assuming you have a custom header component
import CustomFooter from '../../component/Footer/CustomFooter'; // Assuming you have a custom footer component

// DetailItem Component to show each item with an icon
const DetailItem = ({ icon, label, value }) => (
  <View className="flex-row items-center mb-4">
    <FontAwesome name={icon} size={14} color="#4B5563" className="w-6" />
    <Text className="ml-3 text-[12px] text-gray-700 font-semibold">{label}:</Text>
    <Text className="ml-2 text-[12px] text-gray-900">{value || 'N/A'}</Text>
  </View>
);

const CustomerDetailsScreen = ({ route }) => {
  const { customer } = route.params; // Receiving customer details through params

  return (
    <View className="flex-1 bg-white">
      {/* Custom Header */}
      <CustomHeader name="Customer Details" isBackIcon={true} />

      <View className="flex-1 bg-white p-4">
        <Text className="text-[15px] font-bold text-gray-800 mb-5">Customer Details</Text>

        {/* Displaying the customer details using DetailItem components */}
        <DetailItem icon="id-card" label="Customer ID" value={customer.customer_id} />
        <DetailItem icon="user" label="Name" value={toTitleCase(customer.name)} />
        <DetailItem icon="phone" label="Contact" value={customer.contact} />
        <DetailItem icon="whatsapp" label="WhatsApp" value={customer.whatsapp_contact} />
        <DetailItem icon="envelope" label="Email" value={customer.email} />
        <DetailItem icon="map-marker" label="Address" value={customer.address} />
        <DetailItem icon="building" label="Customer Type" value={customer.customer_type_name} />
  

      </View>

      {/* Custom Footer */}
      <CustomFooter />
    </View>
  );
};

// Utility function to convert to Title Case (e.g., 'lalith s' -> 'Lalith S')
const toTitleCase = (str) =>
  str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export default CustomerDetailsScreen;
