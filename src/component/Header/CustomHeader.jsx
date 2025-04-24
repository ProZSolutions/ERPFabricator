import React, { useContext } from 'react';
import { View, Text, ImageBackground, Dimensions, StatusBar, Platform, TouchableOpacity, Image } from 'react-native';
import LeftArrowIcon from '../../assets/svg-component/LeftArrowIcon';
import { useNavigation } from '@react-navigation/native';
import LogoutIcon from '../../assets/svg-component/LogoutIcon';
import { AuthContext } from '../AuthContext/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window'); // Get the screen width for responsive design

const CustomHeader = ({
    name = '',
    isBackIcon = false,
    isLogout = false,
    isNotification = false
}) => {
    const navigation = useNavigation();
    const { logout } = useContext(AuthContext);

    const logoutHandler = async () => {
        try {
            await AsyncStorage.clear(); // 🚀 clears ALL keys saved in AsyncStorage
            logout();  
          } catch (error) {
            console.log('Error clearing async storage:', error);
          }
    }

    return (
        <View>
            <StatusBar
                translucent={true}
                backgroundColor="transparent"
                barStyle="light-content"
            />

            <ImageBackground
                source={require('./../../assets/image/head-bg.jpg')}
                style={{
                    width: width,
                    height: 120, //+ (Platform.OS === 'android' ? StatusBar.currentHeight : 0),
                    justifyContent: 'center',
                    paddingHorizontal: 16,
                    paddingTop: 20
                }}
                resizeMode="cover"
            >
                <View className="flex flex-row justify-between items-center">
                    <View className="flex flex-row items-center space-x-2 w-[80%]">
                        {isBackIcon && (
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <LeftArrowIcon />
                            </TouchableOpacity>
                        )}
                        <Text className="text-white text-2xl font-bold">{name}</Text>
                    </View>
                    <View>
                        {isLogout && <TouchableOpacity onPress={logoutHandler}><LogoutIcon /></TouchableOpacity>}
                    </View>
                    <View>
                        {isNotification && <Image  source={require('./../../assets/image/notification.png')}
                          style={{
                            width: 25,
                            height: 25, //+ (Platform.OS === 'android' ? StatusBar.currentHeight : 0),
                            justifyContent: 'center'
                        }}
                        ></Image>}
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

export default CustomHeader;
