import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomHeader from '../../component/Header/CustomHeader';
import CustomFooter from '../../component/Footer/CustomFooter';

// DetailItem Component
const DetailItem = ({ icon, label, value }) => (
  <View className="flex-row items-center mb-4">
    <FontAwesome name={icon} size={14} color="#4B5563" style={{ width: 24 }} />
    <Text className="ml-3 text-[12px] text-gray-700 font-semibold">{label}:</Text>
    <Text className="ml-2 text-[12px] text-gray-900">{value || 'N/A'}</Text>
  </View>
);

const LeadDetailsScreen = ({ route }) => {
  const { lead } = route.params;
  console.log(lead);

  return (
    <View className="flex-1 bg-white">
      {/* Custom Header */}
      <CustomHeader name="Lead Details" isBackIcon={true} />

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-[15px] font-bold text-gray-800 mb-5">Lead Details</Text>

        <DetailItem icon="id-card" label="Lead ID" value={lead.lead_id} />
        <DetailItem icon="user" label="Lead Name" value={toTitleCase(lead.lead_name)} />
        <DetailItem icon="phone" label="Lead Contact" value={lead.lead_contact} />
        <DetailItem icon="whatsapp" label="WhatsApp" value={lead.whatsapp_contact} />
        <DetailItem icon="envelope" label="Email" value={lead.email} />
        <DetailItem icon="map-marker" label="Address" value={lead.address} />
        <DetailItem icon="map-marker" label="District" value={lead.district_name} />
        <DetailItem icon="calendar" label="Next Followup" value={lead.next_followup} />
        <DetailItem icon="calendar" label="Last Followup" value={lead.last_followup} />
        <DetailItem icon="user" label="Incharge" value={lead.incharge_name} />
        <DetailItem icon="flag" label="Lead Type" value={lead.lead_type} />
        <DetailItem icon="flag" label="Lead Stage" value={lead.stage_name} />
        <DetailItem icon="flag" label="Lead Status" value={lead.is_closed_type} />
        <DetailItem icon="user" label="Created By" value={lead.created_by} />
        <DetailItem icon="phone" label="Pincode" value={lead.pincode} />
        <DetailItem icon="share-alt" label="Referral Platform" value={lead.referal_platform} />
        <DetailItem icon="share-alt" label="Reference Type" value={lead.reference_type} />
      </ScrollView>

      {/* Custom Footer */}
      <CustomFooter />
    </View>
  );
};

// Utility function to convert to Title Case
const toTitleCase = (str) =>
  str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export default LeadDetailsScreen;
