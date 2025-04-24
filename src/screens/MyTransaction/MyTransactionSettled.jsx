import React, { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import Collapsible from "react-native-collapsible";
import GreaterThanIcon from "../../assets/svg-component/GreaterThanIcon";
import DownArrowIcon from "../../assets/svg-component/DownArrowIcon";
import { postData } from "../../api/ApiService";
import handleError from "../../component/ErrorHandler/ErrorHandler";
import { chitNameFormat, formatAmount } from "../../utils";
import Spinner from "../../component/Spinner/Spinner";

function MyTransactionSettled({ search }) {
  const [settlementList, setSettlementList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previousCollapses, setPreviousCollapses] = useState([true]);
  const [expandedIndex, setExpandedIndex] = useState(null);


  const fetchSettlementList = async () => {
    setLoading(true);
    try {
       const response = await postData('/my-invest-transaction-settlement', {
        chit_id: search
      });
       if (response && response.status === 'success') {
         setSettlementList(response.data);
        setPreviousCollapses(new Array(response.data.length).fill(true));

      } else {
        setPreviousCollapses([]);

        setSettlementList([]);
      }
    } catch (error) {
      if (error?.response?.data?.status === "error") {
        Alert.alert(
          "Error",
          error?.response?.data?.error || "An error occurred."
        );
      } else {
        await handleError(error, false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchSettlementList();
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search])


  const togglePreviousCollapse = (index) => {
    setExpandedIndex(prev => (prev === index ? null : index));
    setPreviousCollapses(prev => prev.map((collapsed, i) => (i === index ? !collapsed : collapsed)));

  };

  return (
    <View className="pt-4 bg-white">
      <Spinner visible={loading} textContent="Loading..." />
      {!loading && settlementList.length === 0 && (
        <View className="flex-1 items-center justify-center mt-12">
          <Text className="text-sm text-custom-black font-semibold">No Data Found</Text>
        </View>
      )}
      {!loading && settlementList.map((item, index) => (
        <View key={index} className={`border border-gray-200 rounded-lg mb-3`}>
          <TouchableOpacity
            onPress={() => togglePreviousCollapse(index)}
            className={`flex-row justify-between items-center p-2`}
          >
            <View className="flex-1">
              <Text className="text-custom-heading text-base font-medium">
                 {chitNameFormat(item?.chit_name, item?.chit_id)}
              </Text>
            </View>
            <View className="mr-1">
              <Text className="bg-custom-lightblue text-custom-hyperlink text-xs font-medium p-2 px-4 rounded-2xl">
                {item?.chit_month}ᵗʰ Month
              </Text>
            </View>
            {previousCollapses[index] ? <GreaterThanIcon /> : <DownArrowIcon />}
          </TouchableOpacity>
          {!previousCollapses[index] && (
            <View className="w-full h-[1px] bg-gray-200 mb-3"></View>
          )}
          <Collapsible collapsed={expandedIndex !== index}>

            <View className="bg-white px-2 rounded-bl-xl rounded-br-xl shadow-md mb-2">
              <View className="w-[80%] flex-row items-center mb-2">
                <Text className="text-custom-companytxt text-xs font-normal w-[40%]">
                  Amount
                </Text>
                <Text className="text-custom-companytxt text-center w-[20%]">
                  :
                </Text>
                <Text className="text-custom-hyperlink text-sm font-medium w-[40%]">
                  {formatAmount(item.amount)}
                </Text>
              </View>
              <View className="w-[80%] flex-row items-center mb-2">
                <Text className="text-custom-companytxt text-xs font-normal w-[40%]">
                  Settlement Date
                </Text>
                <Text className="text-custom-companytxt text-center w-[20%]">
                  :
                </Text>
                <Text className="text-custom-hyperlink text-sm font-medium w-[40%]">
                  {item.settled_date}
                </Text>
              </View>

              <View className="w-[80%] flex-row items-center mb-2">
                <Text className="text-custom-companytxt text-xs font-normal w-[40%]">
                  Mode of Payment
                </Text>
                <Text className="text-custom-companytxt text-center w-[20%]">
                  :
                </Text>
                <Text className="text-custom-heading text-sm font-medium w-[40%]">
                  {item.mode_of_payment}
                </Text>
              </View>

              <View className="w-[80%] flex-row items-center">
                <Text className="text-custom-companytxt text-xs font-normal w-[40%]">
                  Transaction Details
                </Text>
                <Text className="text-custom-companytxt text-center w-[20%]">
                  :
                </Text>
                <Text className="text-custom-heading text-sm font-medium w-[40%]">
                  {item?.transaction_details}
                </Text>
              </View>
            </View>

            {/* {index === 0 && (
              <View className="bg-white px-2 rounded-bl-xl rounded-br-xl shadow-md mb-1">
                <View className="flex-row justify-between mb-2">
                  <View className="w-[50%] ">
                    <Text className="text-custom-companytxt text-xs font-normal pb-1">
                      Date
                    </Text>
                    <Text className="text-custom-heading text-sm font-medium">
                      {auction.date}
                    </Text>
                  </View>

                  <View className="w-[50%] flex-row items-center justify-end">
                    <View>
                      <Text className="text-custom-companytxt text-xs font-normal pb-1">
                        Settled Amount
                      </Text>
                      <Text className="text-custom-red text-sm font-medium">$80000.00</Text>
                    </View>
                  </View>
                </View>
              </View>
            )} */}

          </Collapsible>
        </View>
      ))}
    </View>
  );
}
export default MyTransactionSettled;
