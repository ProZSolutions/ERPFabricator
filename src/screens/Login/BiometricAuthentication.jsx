import { View } from "react-native";
import FaceIDLogin from "./FaceIDLogin";
import TouchIDLogin from "./TouchIDLogin";

function BiometricAuthentication() {
    return (
        <View className="pt-5 flex-row justify-between">
            <View className="w-1/2">
                <FaceIDLogin />
            </View>
            <View className="w-1/2">
                <TouchIDLogin />
            </View>
        </View>
    );
}

export default BiometricAuthentication;
