import React, { useState } from "react";
import CustomHeader from "../../component/Header/CustomHeader";
import { View } from "react-native";
import Container from "../../component/Container/Container";
import CustomFooter from "../../component/Footer/CustomFooter";
import MyChitInfo from "./MyChitInfo";
import MyChitTabComponent from "./MyChitTabComponent";
import MyChitPayment from "./MyChitPayment";
import MyChitSettlement from "./MyChitSettlement";
import { chitNameFormat } from "../../utils";

function MyChitDetails({ route }) {
  const { item } = route.params || {};
  const [activeTab, setActiveTab] = useState('Payments');

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
  };

  return (
    <View className="flex-1 bg-white">
      <CustomHeader name={`${chitNameFormat(item.chit_name, item.chit_id)}`} isBackIcon={true} />
      <Container paddingBottom={110}>
        <View style={{ marginTop: -15 }}>
          <MyChitInfo item = {item}/>
          <MyChitTabComponent activeTab={activeTab} onTabChange={handleTabChange} />
          {activeTab === "Payments" && (<MyChitPayment chitId={item.chit_id} auctionMonth={item.current_time_period}  />)}
          {activeTab === "Settlement" && (<MyChitSettlement chitId={item.chit_id}/>)} 
        </View>
      </Container>
      <CustomFooter />
    </View>
  );
}
export default MyChitDetails;
