import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoginStatus = async () => {
    try {
      const userInfo = await AsyncStorage.getItem("userInfo");
      const token =
        userInfo && userInfo !== "null"
          ? JSON.parse(userInfo).bearer_token
          : null;
       setIsLoggedIn(!!token);
    } catch (error) {
      console.error("Error checking login status:", error);
    }
  };

  const setUserInfo = async (userInfo) => {
    await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
     checkLoginStatus();
  };
  const setUserInfoHRMS = async (userInfo) => {
    await AsyncStorage.setItem("userInfohrms", JSON.stringify(userInfo));
     checkLoginStatus();
  };
  const logout = async () => {
    await AsyncStorage.clear();
    setIsLoggedIn(false);
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, setUserInfo, logout,setUserInfoHRMS }}
    >
      {children}
    </AuthContext.Provider>
  );
};
