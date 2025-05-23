// components/SearchModal.js
import React, { useState } from 'react';
import { View, Modal, Text, TouchableOpacity } from 'react-native';
import CustomDatePicker from '../../component/DatePicker/CustomDatePicker';
import DropdownPickerBox from '../../component/DropdownBox/DropdownPickerBox';
import moment from 'moment';

const SearchModal = ({ visible, onClose ,onSearch}) => {
  const [formValues, setFormValues] = useState({
    from:'',
    to:'',
    task_type: '',
    type: '',
    search:''
  });

  const handleValueChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    // Perform search logic
    const formattedPayload = {
        ...formValues,
        from: formValues.from ? moment(new Date(formValues.from)).format("YYYY-MM-DD") : '',
        to: formValues.to ? moment(new Date(formValues.to)).format("YYYY-MM-DD") : '',
      };
      onSearch(formattedPayload);

    console.log('Search with:', formValues);
    onClose();
  };

  const handleClear = () => {
 const clearedValues = {
    from: '',
    to: '',
    task_type: '',
    type: '',
    search: ''
  };

  setFormValues(clearedValues);

  // Prepare payload with formatted empty values
  const formattedPayload = {
    ...clearedValues,
    from: '',
    to: ''
  };

  // Call the search API with cleared filters
  onSearch(formattedPayload);

  onClose();  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white p-4 rounded-t-2xl">
          <Text className="text-base font-semibold mb-2 text-black">Filter Tasks</Text>

          <CustomDatePicker
           editable={true}
           rightIcon={true}
            date={formValues.from}
            onChangeTxt={(value) => handleValueChange('from', value)}
            placeholder="From Date"
          />

          <CustomDatePicker
           editable={true}
           rightIcon={true}
            date={formValues.to}
            onChangeTxt={(value) => handleValueChange('to', value)}
            placeholder="To Date"
          />

          <DropdownPickerBox
            label ="Select Task Type"
            placeholder="Select"
            options={[
              { label: 'Assigned', value: 'assigned' },
              { label: 'Scheduled', value: 'schedule' },
            ]}
            value={formValues.task_type}
            onValueChange={(value) => handleValueChange('task_type', value)}
          />

          <DropdownPickerBox
            label="Select Type"
            placeholder="Select"
            options={[
              { label: 'Pending', value: 'pending' },
              { label: 'Completed', value: 'completed' },
            ]}
            value={formValues.type}
            onValueChange={(value) => handleValueChange('type', value)}
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
