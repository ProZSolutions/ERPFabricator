import { Platform, View } from "react-native";
import CustomHeader from "../../component/Header/CustomHeader";
import Container from "../../component/Container/Container";
import SignInForm from "./SignInForm";
import SocialLogin from "./SocialLogin";
import FooterLinks from "./FooterLinks";
import BiometricAuthentication from "./BiometricAuthentication";
import CustomHeading from "../../component/Heading/CustomHeading";
import LoginDivider from "./LoginDivider";
import AndroidBiometricAuth from "./AndroidBiometricAuth";

const isAndroid = Platform.OS === 'android';
const isIOS = Platform.OS === 'ios';

function Login() {
  return (
    <View className="flex-1 bg-white">
      <CustomHeader name={"Login"} />
      <CustomHeading title="Login to your Account" />
      <Container paddingBottom={20}>
        <SignInForm />
          
       </Container>
    </View>
  );
}

export default Login;
