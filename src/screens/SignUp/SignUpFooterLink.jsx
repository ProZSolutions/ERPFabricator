import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity } from "react-native";

function SignUpFooterLinks() {
    const navigation = useNavigation(); 

    return (
        <View className="px-4">
            <View className="flex-row justify-center mt-8">
                <Text className="text-gray-500">I have an account?</Text>
                <TouchableOpacity  onPress={() => navigation.navigate('Login')}>
                    <Text className="text-red-500 ml-2">Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default SignUpFooterLinks;
