import React, { useState, useEffect, useCallback, useContext } from "react";
import { View, Alert, BackHandler, PermissionsAndroid, Platform, NativeModules } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CustomHeader from "../../component/Header/CustomHeader";
import CustomHeading from "../../component/Heading/CustomHeading";
import Container from "../../component/Container/Container";
import CustomFooter from "../../component/Footer/CustomFooter";
import Spinner from "../../component/Spinner/Spinner";
import GridList from "./GridList";

import LiveChitIcon from "../../assets/svg-component/LiveChitIcon";
import UpcomingChitIcon from "../../assets/svg-component/UpcomingChitIcon";
import PendingChitIcon from "../../assets/svg-component/PendingChitIcon";
import TransactionChitIcon from "../../assets/svg-component/TransactionChitIcon";
import ProfitLossIcon from "../../assets/svg-component/ProfitLossIcon";
import MembersChitIcon from "../../assets/svg-component/MembersChitIcon";
import MyChitIcon from "../../assets/svg-component/MyChitIcon";
import MyAuctionIcon from "../../assets/svg-component/MyAuctionIcon";

import { getValue } from "../../component/AsyncStorage/AsyncStorage";
import { AuthContext } from "../../component/AuthContext/AuthContext";
import { capitalizeFirstLetter } from "../../utils";

// Constants
const SERVICE_STARTED_KEY = "foreground_service_started";

const Home = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [agentItem, setAgentItem] = useState([]);
  const [myChitItem, setMyChitItem] = useState([]);
  const [userDetails, setUserDetails] = useState("");
  const { setUserInfo, isLoggedIn } = useContext(AuthContext);

  // State variable to track if the service has started
  const [serviceStarted, setServiceStarted] = useState(false);

  useEffect(() => {
    // Only start the service once when the app first loads and service isn't started
const initService = async () => {
    if (Platform.OS === 'android') {
      /*const isServiceStarted = await AsyncStorage.getItem(SERVICE_STARTED_KEY);
      if (isServiceStarted !== 'true') {
        console.log("Starting Pusher foreground service...");
        try {
          await AsyncStorage.setItem(SERVICE_STARTED_KEY, 'true');
          console.log("Foreground service started.");
        } catch (error) {
          console.error("Error starting service:", error);
        }
      } else {
        console.log("Foreground service already started.");
      } */
               NativeModules.ForegroundService.startService();

    }
};
    const getUserDetails = async () => {
      const user = await getValue('userInfo');

      if (!user) {
        console.log('No user info found, redirecting to Login...');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
        return;
      }

      setUserDetails(user);
      fetchDashboardData(user);
      requestPermissions();
    };

    initService();
    getUserDetails();
  }, [isLoggedIn, serviceStarted]);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      } catch (err) {
        console.warn("Permission error:", err);
      }
    } else {
      try {
        const result = await Geolocation.requestAuthorization('whenInUse');
        console.log("iOS location permission:", result);
      } catch (err) {
        console.warn("iOS permission error:", err);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        Alert.alert("Hold on!", "Are you sure you want to exit the app?", [
          { text: "Cancel", onPress: () => null, style: "cancel" },
          {
            text: "YES",
            onPress: async () => {
              await AsyncStorage.removeItem(SERVICE_STARTED_KEY);
              setServiceStarted(false);  // Reset service started status
              BackHandler.exitApp();
            },
          },
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
      return () => backHandler.remove();
    }, [])
  );

  const navigationMap = {
    1: "MembersList",
    2: "Customers",
    3: "LeadList",
    4: "CallHIstory",
    5: "TaskList",
    6: "ProfileDetails",
   };

  const myChitNavigations = {
    1: "MyChitList",
    2: "MyTransaction",
    3: "MyAuction",
    4: "MyChitList",
    5: "MyTransaction",
    6: "MyAuction",
  };

  const handleNavigation = (id, map) => {
    const screenName = map[id];
    if (screenName) {
      navigation.navigate(screenName);
    } else {
      console.warn("Unknown navigation option");
    }
  };

  const fetchDashboardData = async (user) => {
    if (parseInt(user.role) === 10) {
      const titles = ["Attendance", "Customers", "Leads", "Calls", "Tasks", "Profile"];
      const icons = [
        <LiveChitIcon />, <UpcomingChitIcon />, <PendingChitIcon />,
        <TransactionChitIcon />, <MembersChitIcon />, <ProfitLossIcon />
      ];
      const agentItems = titles.map((title, i) => ({
        id: String(i + 1),
        title,
        notification: 0,
        icon: icons[i],
      }));
      setAgentItem(agentItems);
    } else {
      const userTitles = [
        "Customer Management", "Quatation Generation", "Site Measurement",
        "Work Progress Updates", "Material/Inventory", "Employee Communication"
      ];
      const userIcons = [
        <MyChitIcon />, <TransactionChitIcon />, <MyAuctionIcon />,
        <MyChitIcon />, <TransactionChitIcon />, <MyAuctionIcon />
      ];
      const userItems = userTitles.map((title, i) => ({
        id: String(i + 1),
        title,
        notification: 0,
        icon: userIcons[i],
      }));
      setMyChitItem(userItems);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <CustomHeader name="Home" isLogout={true} />
      <CustomHeading
        title={
          userDetails?.name
            ? `Hi, ${capitalizeFirstLetter(userDetails.name)}`
            : `Hi, ${userDetails?.emp_no ?? ''}`
        }
        subTitle="Nice to have you back!"
      />
      <Container paddingBottom={80}>
        <Spinner visible={loading} textContent="Loading..." />
        <View className="px-4">
          {userDetails.role === 10 ? (
            <GridList
              items={agentItem}
              handleNavigation={(id) => handleNavigation(id, navigationMap)}
            />
          ) : (
            <GridList
              items={myChitItem}
              handleNavigation={(id) => handleNavigation(id, myChitNavigations)}
            />
          )}
        </View>
      </Container>
      <CustomFooter isHome={true} />
    </View>
  );
};

export default Home;
