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

const FooterButton = ({ icon: IconComponent, label, textClass, onPress }) => (
    <TouchableOpacity className="flex items-center justify-center" onPress={onPress}>
        <IconComponent />
        <Text className={`mt-1 ${textClass}`}>{label}</Text>
    </TouchableOpacity>
);

function CustomFooter({
    isAddCollection = false,
    isAddSettlement = false,
    chitId = null,
    auctionMonth = null,
    isAddMember = false,
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
                icon={SelectedHomeIcon}
                label="Home"
                textClass="text-custom-footerselected text-sm font-semibold"
                onPress={() => navigation.navigate("Home")}
            />
             
            <FooterButton
                icon={FooterSettingIcon}
                label="Tasks"
                textClass="text-custom-companytxt text-sm font-medium"
                onPress={() => navigation.navigate("Home")}
            />
            <FooterButton
                icon={FooterSettingIcon}
                label="Calls"
                textClass="text-custom-companytxt text-sm font-medium"
                onPress={() => navigation.navigate("Home")}
            />

            <FooterButton
                icon={FooterSettingIcon}
                label="Leads"
                textClass="text-custom-companytxt text-sm font-medium"
                onPress={() => navigation.navigate("Home")}
            />


        </View>
    );
}

export default CustomFooter;
