import React, { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import CustomHeader from '../../component/Header/CustomHeader';
import Container from '../../component/Container/Container';
import CustomFooter from '../../component/Footer/CustomFooter';
import Spinner from '../../component/Spinner/Spinner';
import ChitWonIcon from '../../assets/svg-component/ChitWonIcon';
import { postData } from '../../api/ApiService';
import handleError from '../../component/ErrorHandler/ErrorHandler';
import { capitalizeFirstLetter, chitNameFormat, formatAmount } from '../../utils';

function MyAuctionSummary({ route }) {
  const { auctionId, chitId, chitName = '' } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState("");

  const getClosedDetails = async () => {
    setLoading(true);
    try {
      console.log("auction id "," value as "+auctionId);
      const response = await postData('/member-auction-closed-details', {
        auction_id: auctionId,
      });
      console.log("auctionID"," as "+auctionId);
      if (response?.status === 'success') {
        setSummaryData(response);
      }
    } catch (error) {
      if (error?.response?.data?.status === "error") {
        Alert.alert("Error", error?.response?.data?.error || "An error occurred.");
      } else {
        await handleError(error, false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClosedDetails();
  }, [auctionId]);

  console.log("=====> summaryData", summaryData)

  return (
    <View className="flex-1 bg-white">
      <CustomHeader name={`${chitNameFormat(chitName, chitId)} Auction`} isBackIcon={true} />
      <Spinner visible={loading} textContent="Loading..." />
      <Container paddingBottom={80}>
        {/* Auction Summary */}
        <View className="bg-white rounded-lg shadow-md px-2 border border-gray-200">
          <View className="mb-4 mt-2">
            <Text className="text-custom-red text-lg font-bold text-center">
              AUCTION IS CLOSED!
            </Text>
          </View>
          <View className="flex-row justify-between items-center mb-4 mt-2 px-2">
            <View className="w-[34%]">
              <Text className="text-xs text-custom-companytxt font-normal">Auction Date</Text>
              <Text className="text-xs text-custom-heading font-normal">
                {summaryData?.data?.[0]?.auction_date || "-"}
              </Text>
            </View>

            <View className="bg-custom-lightblue rounded-full px-4 py-2 w-[33%] items-center">
              <Text className="text-custom-hyperlink text-xs font-medium">
                {summaryData?.data?.[0]?.auction_month || 0}th Month
              </Text>
            </View>

            <View className="w-[33%]">
              <Text className="text-xs text-custom-companytxt font-normal text-right">
                Auction Amount
              </Text>
              <Text className="text-custom-hyperlink text-sm font-medium text-right">
                {formatAmount(summaryData?.data?.[0]?.auction_amount)}
              </Text>
            </View>
          </View>
          {/*                 {formatAmount(summaryData?.data?.[0]?.auction_amount)}  */}

          <View className="w-full h-[1px] bg-gray-200 my-2" />

          {/* Winner Information */}
          <View className="flex-1 mt-10 mb-10">
            <View className="h-[100%] flex justify-center items-center">
              <ChitWonIcon />
              <Text className="text-custom-companytxt text-center mt-4">Best wishes!!</Text>
              <Text className="text-custom-companytxt text-center mt-1">
                Chit for this month is provided to
              </Text>
              <Text className="text-custom-hyperlink text-lg font-bold text-center mt-1">
                {capitalizeFirstLetter(summaryData?.data?.[0]?.auction_winner) || "N/A"}
              </Text>
              <Text className="text-custom-hyperlink text-sm font-medium text-right">
                {formatAmount(summaryData?.data?.[0]?.win_amount)}
              </Text>
            </View>
          </View>
        </View>

        {/* History List */}
        <View className="bg-white rounded-lg shadow-md px-2 border border-gray-200 my-4">
          {summaryData?.history?.length > 0 ? (
            summaryData.history.map((user, index) => (
              <View key={index} className="px-2 py-4 flex-row justify-between items-center">
                <Text
                  className={`text-base font-medium ${
                    user.color_flag === 1 ? 'text-custom-hyperlink' : 'text-custom-companytxt'
                  }`}
                >
                  {capitalizeFirstLetter(user.name)}
                </Text>
                <Text
                  className={`text-base font-medium ${
                    user.winner_name === 1 ? 'text-custom-red' : 'text-custom-companytxt'
                  }`}
                >
                  {formatAmount(user.amount)}
                </Text>
              </View>
            ))
          ) : (
            <Text className="text-center text-gray-500 py-4">No history available</Text>
          )}
        </View>
      </Container>
      <CustomFooter />
    </View>
  );
}

export default MyAuctionSummary;
