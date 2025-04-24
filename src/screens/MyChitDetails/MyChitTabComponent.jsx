import React from 'react';
import { View } from 'react-native';
import Tab from '../../component/Tab/Tab';

const MyChitTabComponent = ({ activeTab, onTabChange }) => {
  return (
    <View className="flex-row border border-gray-300 rounded-lg overflow-hidden">
      <Tab
        label="Payments"
        isActive={activeTab === 'Payments'}
        onPress={() => onTabChange('Payments')}
      />
      <Tab
        label="Settlement"
        isActive={activeTab === 'Settlement'}
        onPress={() => onTabChange('Settlement')}
      />
    </View>
  );
};

export default MyChitTabComponent;
