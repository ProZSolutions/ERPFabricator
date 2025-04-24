import { View, Text, TouchableOpacity } from "react-native";
import GoogleIcon from "../../assets/svg-component/GoogleIcon";

function SocialLogin() {
  return (
      <View className="flex-row justify-center space-x-4">
        <TouchableOpacity className="px-6 py-2 rounded-[10px] border border-gray-300 flex-row items-center space-x-2">
          <GoogleIcon />
          <Text className="text-custom-black text-base">Google</Text>
        </TouchableOpacity>

      </View>
  );
}

export default SocialLogin;
