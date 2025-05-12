import { Text, TouchableOpacity, View } from "react-native";
import SelectedHomeIcon from "../../assets/svg-component/FooterSelectedHomeIcon";
import FooterAddChitIcon from "../../assets/svg-component/FooterAddChitIcon";
import FooterChitCalcIcon from "../../assets/svg-component/FooterChitCalcIcon";
import FooterSettingIcon from "../../assets/svg-component/FooterSettingIcon";
import ListIcon from "../../assets/svg-component/ListIcon";
import { useNavigation } from "@react-navigation/native";

import { useEffect, useState } from "react";
import { getValue } from "../AsyncStorage/AsyncStorage";
import AddChitPopup from "../ModalPopup/AddChitPopup";
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';



const FooterButton = ({ icon: IconComponent, label, textClass, onPress, isSelected }) => {
    const iconColor = isSelected ? "#3b82f6" : "#f59e0b"; // blue if selected, orange otherwise
    return (
      <TouchableOpacity className="flex items-center justify-center" onPress={onPress}>
        <IconComponent color={iconColor} size={20} />
        <Text className={`mt-1 mb-1 text-[12px] ${textClass} `}>{label}</Text>
      </TouchableOpacity>
    );
  };
  
function CustomFooter({
    isAddCollection = false,
    isAddSettlement = false,
    chitId = null,
    auctionMonth = null,
    isAddMember = false,
    isHome=false,
    isTask=false,
    isCalls=false,
    isLead=false,
    gotoAddMember = () => { }
}) {
    const navigation = useNavigation(); 

    useEffect(() => {
        const userInfoHandler = async () => {
            const userInfo = await getValue('userInfo');
            setUserInfoData(userInfo)
        }
        userInfoHandler()
    }, [])

     

    return (
        <View className="flex-row justify-around items-center p-2 py-2 bg-white absolute bottom-0 w-full border-t border-gray-100">
            <FooterButton
                icon={() => <FontAwesome name="home" size={22}     color={isHome ? "#3b82f6" : "#AAA4A4"} // blue if active, gray otherwise
                />}
                label="Home"
                textClass={isHome ? "text-blue-500   font-semibold" : "text-custom-companytxt   font-medium"}
                onPress={() => navigation.navigate("Home")}
            />
             
            <FooterButton
                icon={() => <FontAwesome name="tasks" size={20} color={isTask ? "#3b82f6" : "#AAA4A4"}  />}
                label="Tasks"
                textClass={isTask ? "text-blue-500   font-semibold" : "text-custom-companytxt   font-medium"}
                onPress={() => navigation.navigate("TaskList")}
            />
            <FooterButton
                icon={() => <FontAwesome name="phone" size={20} color={isCalls ? "#3b82f6" : "#AAA4A4"}  />}
                label="Calls"
                textClass={isCalls ? "text-blue-500  font-semibold" : "text-custom-companytxt   font-medium"}
                onPress={() => navigation.navigate("CallHIstory")}
            />

            <FooterButton
                icon={() => <FontAwesome name="users" size={20} color={isLead ? "#3b82f6" : "#AAA4A4"}  />}
                label="Leads"
                textClass={isLead ? "text-blue-500  font-semibold" : "text-custom-companytxt   font-medium"}
                onPress={() => navigation.navigate("LeadList")}
            />


        </View>
    );
}

export default CustomFooter;
