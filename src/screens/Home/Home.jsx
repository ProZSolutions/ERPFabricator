import React, { useState, useEffect, useCallback, useContext } from "react";
import { View, Text, Alert, BackHandler,PermissionsAndroid  } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Geolocation from 'react-native-geolocation-service';

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

import { getData } from "../../api/ApiService";
import { getValue, removeValue } from "../../component/AsyncStorage/AsyncStorage";
import { AuthContext } from "../../component/AuthContext/AuthContext";
import handleError from "../../component/ErrorHandler/ErrorHandler";
import { capitalizeFirstLetter } from "../../utils";
import AsyncStorage from '@react-native-async-storage/async-storage';
import TaskList from "../Tasks/TaskList";

//import Pusher from 'pusher-js/react-native';
// import echo from "../../websocket";

const Home = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [agentItem, setAgentItem] = useState([]);
  const [myChitItem, setMyChitItem] = useState([]);
  const [userDetails, setUserDetails] = useState("");
  const { setUserInfo, isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const getUserDetails = async () => {
      const user = await getValue('userInfo');

      if (!user) {
        console.log('No user info found, redirecting to Login...');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
        return; // Stop execution here
      }
       setUserDetails(user);
      fetchDashboardData(user);
      requestLocationPermission();

    }
    getUserDetails();

  }, [isLoggedIn])

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      try {
        const result = await Geolocation.requestAuthorization('whenInUse');
        return result === 'granted';
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
  };
  

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        Alert.alert("Hold on!", "Are you sure you want to logout the app?", [
          { text: "Cancel", onPress: () => null, style: "cancel" },
          {
            text: "YES",
            onPress: async () => {
              await removeValue("userInfo");
              setUserInfo(null);
            },
          },
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, [setUserInfo])
  );

  const navigationMap = {
    1: "MembersList",
    2: "UpcomingAuction",
    3: "PendingList",
    4: "TransactionList",
    5: "MembersList",
    6: "TaskList",
    7: "PorfitLoss",
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
 
      if(parseInt(user.role)===10){
        // employee
        
        const titles=["Attendance","Customer Management", "Lead Follow-up", "Site Visit", 
          "Quatation Generation", "Project Task Update", 
          "Customer Feedback"];
          const icons = [
            <LiveChitIcon />,
            <UpcomingChitIcon />,
            <PendingChitIcon />,
            <TransactionChitIcon />,
            <MembersChitIcon />,
            <ProfitLossIcon />,
            <LiveChitIcon />
          ];

          const agentItems = [];
          for (let i = 0; i < titles.length; i++) {
            agentItems.push({
              id: String(i + 1),
              title: titles[i],
              notification:  0,
              icon: icons[i]
            });
          }
          
          setAgentItem(agentItems);
      }else{
        // fabricator
        const userTitles = [
          "Customer Management",
          "Quatation Generation",
          "Site Measurement",
          "Work Progress Updates",
          "Material/Inventory",
          "Employee Communication"
        ];
        
        const userIcons = [
          <MyChitIcon />,
          <TransactionChitIcon />,
          <MyAuctionIcon />,
          <MyChitIcon />,
          <TransactionChitIcon />,
          <MyAuctionIcon />
        ];
        const userItems = [];
        for (let i = 0; i < userTitles.length; i++) {
          userItems.push({
            id: String(i + 1),
            title: userTitles[i],
            notification:  0,
            icon: userIcons[i]
          });
        }
        
        setMyChitItem(userItems);
      }  
  };

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData(); 
    }, [])
  );

  return (
    <View className="flex-1 bg-white">
      <CustomHeader name="Home" isLogout={true} />
      <CustomHeading title={`Hi, ${capitalizeFirstLetter(userDetails?.name)}`} subTitle="Nice to have you back!" />
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
      <CustomFooter  />

     </View>
  );
};

export default Home;

