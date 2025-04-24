import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity } from "react-native";

function FooterLinks() {
    const navigation = useNavigation(); 

    return (
        <View className="px-4">
            <View className="flex-row justify-center mt-8">
                <Text className="text-custom-heading text-base font-normal">Don’t have an account?</Text>
                <TouchableOpacity onPress={()=>navigation.navigate('SignUp')}>
                    <Text className="text-custom-red text-base font-normal ml-2 underline">Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default FooterLinks;
