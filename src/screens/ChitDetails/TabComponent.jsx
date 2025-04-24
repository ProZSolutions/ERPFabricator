import React from 'react';
import { View } from 'react-native';
import Tab from '../../component/Tab/Tab';

const TabComponent = ({ activeTab, onTabChange }) => {
  return (
    <View className="flex-row border border-gray-300 rounded-lg overflow-hidden">
      <Tab
        label="Collections"
        isActive={activeTab === 'Collections'}
        onPress={() => onTabChange('Collections')}
      />
      <Tab
        label="Members"
        isActive={activeTab === 'Members'}
        onPress={() => onTabChange('Members')}
      />
      <Tab
        label="Settlement"
        isActive={activeTab === 'Settlement'}
        onPress={() => onTabChange('Settlement')}
        isLast = {true}
      />
    </View>
  );
};

export default TabComponent;
