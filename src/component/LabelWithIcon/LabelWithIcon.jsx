// components/LabelWithIcon.js
import React from 'react';
import { View, Text } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const LabelWithIcon = ({ iconName, label, isRequired = false, iconColor = '#000', iconSize = 14 }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5, }}>
      <FontAwesome name={iconName} size={iconSize} color={iconColor} style={{ marginRight: 6 }} />
      <Text style={{ color: '#000', fontSize: 12 }}>{label}</Text>
      {isRequired && <Text style={{ color: 'red', marginLeft: 3 }}>*</Text>}
    </View>
  );
};

export default LabelWithIcon;
