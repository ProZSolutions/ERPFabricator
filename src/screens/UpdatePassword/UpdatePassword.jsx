import React, { useContext, useState } from 'react'
import { Alert, View } from 'react-native'
import PasswordLockIcon from '../../assets/svg-component/PasswordLockIcon';
import PasswordInputBox from '../../component/PasswordInputBox/PasswordInputBox';
import CustomButton from '../../component/Button/CustomButton';
import RightArrowIcon from '../../assets/svg-component/RightArrowIcon';
import Spinner from '../../component/Spinner/Spinner';
import { postData } from '../../api/ApiService';
import handleError from '../../component/ErrorHandler/ErrorHandler';
import { AuthContext } from '../../component/AuthContext/AuthContext';

function UpdatePassword() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        oldPassword: '',
        password: '',
        confirmPassword: '',

    });
  const {  logout } = useContext(AuthContext);

    const handleInputChange = (field, value) => {
        setFormData(prevState => ({
            ...prevState,
            [field]: value,
        }));
    };

    const updatePasswordHandler = async () => {
        try {
            setLoading(true);

            let response = await postData("/change-password", {
                current_password: formData?.oldPassword,
                new_password: formData?.password
            });
            if (response.status === "success") {
                Alert.alert(
                    "",
                    "Password updated successfully!!!",
                    [
                        {
                            text: "OK",
                            onPress: async () => {
                                logout();
                            },
                        },
                    ],
                    { cancelable: false }
                );
            }
        } catch (error) {
            if (error?.response?.data?.status === "error") {
                Alert.alert(
                    "Profile Error",
                    error?.response?.data?.error || "An error occurred."
                );
            } else {
                await handleError(error, false);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <View>
            <Spinner visible={loading} textContent="Loading..." />
            <PasswordInputBox
                lockIcon={<PasswordLockIcon />}
                required={true}
                label='Current Password'
                placeholder="Current Password"
                value={formData.oldPassword}
                onChangeText={(text) => handleInputChange('oldPassword', text)}
            />
            <PasswordInputBox
                lockIcon={<PasswordLockIcon />}
                required={true}
                label="New Password"
                placeholder="New Password"
                value={formData.password}
                onChangeText={(text) => handleInputChange('password', text)}
            />
            <PasswordInputBox
                lockIcon={<PasswordLockIcon />}
                required={true}
                label="Confirm Password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(text) => handleInputChange('confirmPassword', text)}
            />
            <View className="w-full mt-10">
                <View className="ml-auto">
                    <CustomButton
                        containerClass="px-5"
                         title=" Save "
                        onPress={updatePasswordHandler}
                    />
                </View>
            </View>

        </View>
    )
}
export default UpdatePassword;