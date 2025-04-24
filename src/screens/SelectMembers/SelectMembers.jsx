import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Switch, Text, TouchableOpacity, View } from 'react-native';
import CustomHeader from '../../component/Header/CustomHeader';
import SearchInputBox from '../../component/SearchInputBox/SearchInputBox';
import Container from '../../component/Container/Container';
import CustomFooter from '../../component/Footer/CustomFooter';
import CustomButton from '../../component/Button/CustomButton';
import CheckBox from '@react-native-community/checkbox';
import RightArrowIcon from '../../assets/svg-component/RightArrowIcon';
import AddIcon from '../../assets/svg-component/AddIcon';
import { useNavigation } from '@react-navigation/native';
import { postData } from '../../api/ApiService';
import handleError from '../../component/ErrorHandler/ErrorHandler';
import Spinner from '../../component/Spinner/Spinner';
import SelectMemberInfo from './SelectMemberInfo';

function SelectMembers({ route }) {
  const { chitId, isExistingChit = false, alreadySelectedMember = [], completedMonth = 0 } = route.params || {};
  const [search, setSearch] = useState('');
  const [membersList, setMembersList] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const [totalChitMember, setTotalChitMember] = useState(0);
  const [addedMemberCount, setAddedMemberCount] = useState(0);

  const updateMembersList = (newMembers) => {
    setMembersList((prevMembers) => {
      const updatedMembers = newMembers.filter(
        (newMember) => !prevMembers.some((member) => member.id === newMember.id)
      );
      return [...prevMembers, ...updatedMembers];
    });
  };

  const fetchMembersList = async () => {
    try {
      const response = await postData('/add-chit-customer-dropdown', { chit_id: chitId });
      if (response?.status === 'success') {
        let membersWithDefaults = response.data.map((member) => ({
          ...member,
          isFullChit: true,
        }));

        console.log(' console member list ',membersWithDefaults);
        
        if (response.added_member_count === 1) {
          membersWithDefaults = membersWithDefaults.map((member) => {
            if (member.status === 'My Self' || member.status === 'MySelf') {
              return { ...member, disableCheckbox: true }; // disable selection
            }
            return member;
          });
        } else if (response.added_member_count === 0) {
          membersWithDefaults.splice(0, 1);

       //   membersWithDefaults = membersWithDefaults.filter((member) => member.status !== 'MySelf');
        }
  
        if (alreadySelectedMember.length > 0 && selectedMembers.length === 0) {
          const temp = alreadySelectedMember.map((item) => `${item.id}`);
          setSelectedMembers(temp);
        }
 
        updateMembersList(membersWithDefaults);
        setAddedMemberCount(response.added_member_count);
        setTotalChitMember(response.member_count);
      } else {
        Alert.alert('Failed', 'Failed to fetch members list.');
      }
    } catch (error) {
      if (error?.response?.data?.status === "error") {
        Alert.alert("Error", error?.response?.data?.error || "An error occurred.");
      } else {
        await handleError(error, false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembersList();
  }, []);

  const filteredMembersList = membersList.filter(
    (member) =>
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.contact.toString().includes(search)
  );

  const handleInputSearchChange = (value) => setSearch(value);

  const handleCheckboxToggle = (id) => {
    setSelectedMembers((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((memberId) => memberId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSwitchToggle = (id) => {
    setMembersList((prevMembers) =>
      prevMembers.map((member) =>
        member.id === id ? { ...member, isFullChit: !member.isFullChit } : member
      )
    );
  };

  const totalMemberHandler = () => {
    const findSelectedMembers = membersList.filter((member) =>
      selectedMembers.includes(member.id)
    );


    const { fullChitCount, halfChitCount } = findSelectedMembers.reduce(
      (counts, member) => {
        member.isFullChit ? counts.fullChitCount++ : counts.halfChitCount++;
        return counts;
      },
      { fullChitCount: 0, halfChitCount: 0 }
    );
    if(alreadySelectedMember.length){
      return fullChitCount + halfChitCount / 2;
    } else{
      return fullChitCount + halfChitCount / 2 + parseFloat(addedMemberCount);
    }
  };

  const addMemberHandler = () => {
    if (selectedMembers.length === 0) {
      Alert.alert('', 'Select at least one member.');
      return;
    }
    if (totalMemberHandler() > totalChitMember) {
      Alert.alert('', `You have more than ${totalMemberHandler()} members Please select only ${totalChitMember} members.`);
      return;
    }

    const selectedMembersItem = membersList.filter((member) =>
      selectedMembers.includes(member.id)
    );

    navigation.navigate('SelectedMembersList', {
      totalChitMember,
      addedMembers: totalMemberHandler(),
      selectedMembersItem,
      chitId,
      isExistingChit,
      alreadySelectedMember,
      completedMonth
    });
  };

  const handleRefresh = () => {
    fetchMembersList()
  };


  return (
    <View className="flex-1 bg-white">
      <CustomHeader name="Select Member" isBackIcon={alreadySelectedMember.length === 0 ? false : true} />
      <SearchInputBox value={search} onChangeText={handleInputSearchChange} />

      <View className="flex-row justify-between px-4 pt-2">
        <View className="flex-row items-center">
        <CheckBox
              value={
                selectedMembers.length === membersList.filter(
                  m =>
                    !m.disableCheckbox &&
                    m.status?.replace(/\s/g, '').toLowerCase() !== 'myself'
                ).length
              }
              onValueChange={() => {
                const selectableMembers = membersList
                  .filter(
                    m =>
                      !m.disableCheckbox &&
                      m.status?.replace(/\s/g, '').toLowerCase() !== 'myself'
                  )
                  .map(m => m.id);

                setSelectedMembers(
                  selectedMembers.length === selectableMembers.length ? [] : selectableMembers
                );
              }}
              tintColors={{ true: '#285FE7', false: 'rgb(209 213 219)' }}
/>
          <TouchableOpacity>
            <Text className="text-custom-rememberme text-sm font-medium ml-1">Select All</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-between pt-2">
          <Text className="text-custom-companytxt font-normal text-xs leading-6">Members </Text>
          <Text className="text-custom-heading font-medium text-sm leading-6">
            <Text className="text-custom-red">{totalMemberHandler()}</Text>/{totalChitMember}
          </Text>
        </View>
        <CustomButton
          isLeftIcon
          gapClass="ml-2"
          containerClass="px-2"
          icon={<AddIcon />}
          title="Members"
          onPress={() => navigation.navigate('AddMembers', { onGoBack: handleRefresh })}
        />
      </View>


      <Container paddingBottom={20}>
        <Spinner visible={isLoading} textContent="Processing..." />
        {filteredMembersList.length === 0 ? (
          <View className="flex-row justify-center items-center h-60">
            <Text className="text-sm text-custom-heading font-medium">No Data Found</Text>
          </View>
        ) : (
          <FlatList
            data={filteredMembersList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <SelectMemberInfo
                member={item}
                isSelected={selectedMembers.includes(item.id)}
                onCheckboxToggle={handleCheckboxToggle}
                onSwitchToggle={handleSwitchToggle}
              />
            )}
          />
        )}
      </Container>


      <View className="flex-row px-4 justify-end" style={{ marginBottom: 70 }}>
        {/* <CustomButton
          isLeftIcon
          gapClass="ml-2"
          containerClass="px-5 bg-white border border-gray-200"
          icon={<LeftArrowBlueIcon />}
          title="Back"
          isActive={false}
          onPress={() => navigation.goBack()}
        /> */}
        <CustomButton
          gapClass="mr-2"
          containerClass="px-5"
          icon={<RightArrowIcon />}
          title="Next"
          onPress={addMemberHandler}
        />
      </View>

      <CustomFooter />
    </View>
  );
}

export default SelectMembers;