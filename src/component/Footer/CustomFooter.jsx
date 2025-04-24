import { Text, TouchableOpacity, View } from "react-native";
import SelectedHomeIcon from "../../assets/svg-component/FooterSelectedHomeIcon";
import FooterAddChitIcon from "../../assets/svg-component/FooterAddChitIcon";
import FooterChitCalcIcon from "../../assets/svg-component/FooterChitCalcIcon";
import FooterSettingIcon from "../../assets/svg-component/FooterSettingIcon";
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
    const [userInfoData, setUserInfoData] = useState(null);
    const [isAddChitModal, setIsAddChitModal] = useState(false);

    useEffect(() => {
        const userInfoHandler = async () => {
            const userInfo = await getValue('userInfo');
            setUserInfoData(userInfo)
        }
        userInfoHandler()
    }, [])

    const addChitHandler = () => {
        setIsAddChitModal(true);
    }
    const onPressChitType = (type) => {
        setIsAddChitModal(false);
        if(type === 'new'){
            navigation.navigate("AddChit", {isExistingChit:false});
        } else {
            navigation.navigate("AddChit", {isExistingChit:true});
        }
    }

    return (
        <View className="flex-row justify-around items-center p-2 py-2 bg-white absolute bottom-0 w-full border-t border-gray-100">
            <FooterButton
                icon={SelectedHomeIcon}
                label="Home"
                textClass="text-custom-footerselected text-sm font-semibold"
                onPress={() => navigation.navigate("Home")}
            />
            {isAddCollection ? (
                <FooterButton
                    icon={FooterAddChitIcon}
                    label="Add Collections"
                    textClass="text-custom-companytxt text-sm font-medium"
                    onPress={() => navigation.navigate("AddCollection", { chitId, auctionMonth })}
                />
            ) : isAddSettlement ? (
                <FooterButton
                    icon={FooterAddChitIcon}
                    label="Add Settlement"
                    textClass="text-custom-companytxt text-sm font-medium"
                    onPress={() => navigation.navigate("AddSettlement", { chitId, auctionMonth })}
                />
            ) : isAddMember ? (
                <FooterButton
                    icon={FooterAddChitIcon}
                    label="Add Member"
                    textClass="text-custom-companytxt text-sm font-medium"
                    onPress={() => gotoAddMember()}
                />
            ) : userInfoData?.role_name === 'agent' ? (
                <FooterButton
                    icon={FooterAddChitIcon}
                    label="Add Chit"
                    textClass="text-custom-companytxt text-sm font-medium"
                    onPress={addChitHandler}
                />
            ) : (null)}

            <FooterButton
                icon={FooterChitCalcIcon}
                label="Chit Calc"
                textClass="text-custom-companytxt text-sm font-medium"
                onPress={() => navigation.navigate("ChitCalculation")}
            />
            <FooterButton
                icon={FooterSettingIcon}
                label="Settings"
                textClass="text-custom-companytxt text-sm font-medium"
                onPress={() => navigation.navigate("Settings")}
            />

            {isAddChitModal && (
                <AddChitPopup
                    close={() => setIsAddChitModal(false)}
                    onPressChitType = {onPressChitType}
                />
            )}


        </View>
    );
}

export default CustomFooter;
