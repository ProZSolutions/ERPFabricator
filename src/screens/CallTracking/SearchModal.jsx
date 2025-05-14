import React, { useState } from 'react';
import { View, Modal, Text, TouchableOpacity } from 'react-native';
import DropdownPickerBox from '../../component/DropdownBox/DropdownPickerBox';

const SearchModal = ({ visible, onClose, onSearch }) => {
  const [formValues, setFormValues] = useState({
    call_type: '',
  });

  const handleValueChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    onSearch({ ...formValues });
  };

  const handleClear = () => {
    const cleared = { call_type: '' };
    setFormValues(cleared);
    onSearch(cleared);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white p-4 rounded-t-2xl">
          <Text className="text-base font-semibold mb-2 text-black">Filter Call History</Text>

          <DropdownPickerBox
            label="Select Call Type"
            placeholder="Select"
            options={[
              { label: 'Incoming', value: 'incoming' },
              { label: 'Outgoing', value: 'outgoing' },
            ]}
            value={formValues.call_type}
            onValueChange={(value) => handleValueChange('call_type', value)}
          />

          <View className="flex-row justify-between mt-4">
            <TouchableOpacity className="bg-gray-300 px-4 py-2 rounded" onPress={handleClear}>
              <Text className="text-black text-sm">Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded" onPress={handleSearch}>
              <Text className="text-white text-sm">Search</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={onClose} className="mt-4 self-center">
            <Text className="text-red-500">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SearchModal;
