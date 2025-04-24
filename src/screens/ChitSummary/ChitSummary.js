import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import CustomFooter from "../../component/Footer/CustomFooter";
import Container from "../../component/Container/Container";
import CustomHeader from "../../component/Header/CustomHeader";
import GreaterThanIcon from "../../assets/svg-component/GreaterThanIcon";
import DownArrowIcon from "../../assets/svg-component/DownArrowIcon";
import Collapsible from "react-native-collapsible";
import { postData } from "../../api/ApiService";
import Spinner from "../../component/Spinner/Spinner";
import ChitSummaryMembersInfo from "./ChitSummaryMembersInfo";
import { chitNameFormat } from "../../utils";

function ChitSummary({ route }) {
  const { chitId } = route.params || {};
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [chitData, setChitData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previousAuctions, setPreviousAuctions] = useState([]);
  const [membersList, setMembersList] = useState([]);

  const togglePreviousCollapse = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const fetchChitSummary = async () => {
    const requestData = { chit_id: chitId };

    try {
      setIsLoading(true);
      const response = await postData("/chit-summary-list", requestData);
      if (response.status === "success") {
        setChitData(response.data);
        setMembersList(response.member);
        setPreviousAuctions([
          { name: chitNameFormat(response.data?.chit_name, chitId) || "" },
          { name: "Members List" },
        ]);
        togglePreviousCollapse(0);
      }
    } catch (error) {
      console.error("Error fetching chit summary:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChitSummary();
  }, []);

  return (
    <View className="flex-1 bg-white">
      <CustomHeader name="Chit Summary" isBackIcon={false} />

      <Container paddingBottom={80} marginTop={-10}>
        <Spinner visible={isLoading} textContent="Processing..." />
        <View className="bg-white">
          {previousAuctions.map((item, index) => (
            <View key={index} className="border border-gray-200 rounded-lg mb-3">
              <TouchableOpacity
                onPress={() => togglePreviousCollapse(index)}
                className={`flex-row justify-between items-center p-2 ${
                  expandedIndex === index ? "bg-primary rounded-tl-lg rounded-tr-lg" : "rounded-lg"
                }`}
              >
                <Text className={`${
                  expandedIndex === index ? "text-white" : "text-custom-heading"
                } text-base font-medium`}>
                  {item.name}
                </Text>
                {expandedIndex === index ? <DownArrowIcon /> : <GreaterThanIcon />}
              </TouchableOpacity>
              {expandedIndex === index && <View className="w-full h-[1px] bg-gray-200 mb-3"></View>}
              <Collapsible collapsed={expandedIndex !== index}>
                {index === 0 && (
                  <View className="bg-white px-2 rounded-bl-xl rounded-br-xl shadow-md mb-1">
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-custom-companytxt text-xs font-normal">Start Date</Text>
                      <Text className="text-custom-heading text-sm font-medium text-right">{chitData.start_date}</Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-custom-companytxt text-xs font-normal">Total Chit Amount</Text>
                      <Text className="text-custom-heading text-sm font-medium text-right">₹{chitData.total_chit_value}</Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-custom-companytxt text-xs font-normal">Number of Months</Text>
                      <Text className="text-custom-heading text-sm font-medium text-right">{chitData.no_of_month}</Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-custom-companytxt text-xs font-normal">Interest Amount</Text>
                      <Text className="text-custom-heading text-sm font-medium text-right">₹{chitData.interest_amount}</Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-custom-companytxt text-xs font-normal">Dividend After Chit Taken</Text>
                      <Text className="text-custom-heading text-sm font-medium text-right">{chitData.dividend_after_chit_taken}</Text>
                    </View>
                    <View className="flex-row justify-between mb-4">
                      <Text className="text-custom-companytxt text-xs font-normal">Auction</Text>
                      <Text className="text-custom-heading text-sm font-medium text-right">{chitData.auction}</Text>
                    </View>
                    <View className="w-full h-[1px] bg-gray-200 mb-2"></View>
                    <View className="mb-3">
                      <Text className="text-custom-heading text-sm font-medium">Agent</Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-custom-companytxt text-xs font-normal">Commission</Text>
                      <Text className="text-custom-heading text-sm font-medium text-right">{chitData.commission_amount}</Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-custom-companytxt text-xs font-normal">Chit</Text>
                      <Text className="text-custom-heading text-sm font-medium text-right">{chitData.agent_chit}</Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-custom-companytxt text-xs font-normal">Auction Taken Month</Text>
                      <Text className="text-custom-heading text-sm font-medium text-right">{chitData.agent_chit_receiving}</Text>
                    </View>
                  </View>
                )}
                {index === 1 && (
                  <View className="bg-white px-2 rounded-bl-xl rounded-br-xl shadow-md mb-2">
                    <FlatList
                      data={membersList}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item }) => <ChitSummaryMembersInfo member={item} />}
                    />
                  </View>
                )}
              </Collapsible>
            </View>
          ))}
        </View>
      </Container>
      <CustomFooter />
    </View>
  );
}

export default ChitSummary;
