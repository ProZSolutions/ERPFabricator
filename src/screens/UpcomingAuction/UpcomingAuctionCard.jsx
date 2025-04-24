import React,{useState,useEffect} from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import PlayIcon from '../../assets/svg-component/PlayIcon';
import { chitNameFormat, formatAmount } from '../../utils';
import { useNavigation } from '@react-navigation/native';
import LiveIndicator from './LiveIndicator';
import GreaterThanWhiteBGIcon from '../../assets/svg-component/GreaterThanWhiteBGIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';


const UpcomingAuctionCard = ({
    item,
    gotoAuctionSummary = () => { },
    goToChitDetailsPage = () => { },
    activeItem }) => {
    const navigation = useNavigation();
    const [agentId, setAgentId] = useState(null);
    item.chit_month=item.no_month;
    console.log("UpcomingAuctionCard item:", JSON.stringify(item, null, 2));
        
    const gotoActionHandler = async (val, page) => {
        if (page === 'summary') {
            gotoAuctionSummary(val);
        } else {
            navigation.navigate("Auction", { chit_id: val.chit_id, chit_month: val.no_month, info: val })
        }
    }

      const getAgentId = async () => {
            try {
              const agentId = await AsyncStorage.getItem('agent_id');
              if (agentId !== null) {
                console.log('Agent ID:', agentId);
                return agentId;
              } else {
                console.log('Agent ID not found');
                return null;
              }
            } catch (error) {
              console.error('Error reading agent_id:', error);
              return null;
            }
          };
    
          useEffect(() => {
            getAgentId();
          }, []);
    const gotoAuctionReq = (val) => {
        navigation.navigate('AuctionReqList', { chitId: val?.chit_id, auctionMonth: val?.no_month })
    }

    return (
        <View className="bg-white border border-gray-200 rounded-lg shadow-sm px-2 py-2 mb-4">
            <View className="flex-row justify-between items-center">
                <View className="w-[40%] gap-1">
                    <Text className="text-xs text-custom-heading font-medium">
                        {chitNameFormat(item.chit_name, item.chit_id)}
                    </Text>
                    <Text className="text-sm text-custom-heading font-medium">{formatAmount(item.cumulative_amount)}</Text>
                </View>

                <View className="w-[30%] items-center gap-1">
                    {activeItem !== 'inprogress' && (
                        <View>
                            <Text className="text-custom-companytxt text-xs font-normal">Members</Text>
                            <TouchableOpacity onPress={() => goToChitDetailsPage(item)}>
                                <Text className="text-custom-hyperlink text-xs font-medium underline">
                                    {item?.no_members || item?.total_member || 0}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    {activeItem === 'inprogress' && (
                        <View className="flex-row items-center">
                            <Text className="text-custom-red text-xs font-semibold">LIVE</Text>
                            <View className="">
                                <LiveIndicator />
                            </View>
                        </View>
                    )}
                </View>

                <View className="w-[30%] gap-1">
                    <Text className="text-custom-companytxt text-xs font-normal">
                        {item?.no_month || 0}ᵗʰ Month
                    </Text>
                    <Text className="text-custom-companytxt text-xs font-normal">
                        {item?.date}
                    </Text>
                </View>
            </View>
            <View className="w-full h-[1px] bg-gray-300 my-2" />
            <View className="flex-row justify-between items-center">
                <View className="w-[40%] gap-1">
                    <Text className="text-custom-companytxt text-xs font-normal">Request Received</Text>
                    <TouchableOpacity className="flex-row pl-5"   onPress={() => {
                            if (item?.request_count) {
                            gotoAuctionReq(item);
                            }
                        }}>
                       <Text className={`text-custom-hyperlink text-xs font-medium ${!item?.request_count ? 'text-gray-400' : 'underline'}`}>
                             {item?.request_count || 0}
                    </Text>
                    </TouchableOpacity>
                </View>

                <View className="w-[30%] items-center gap-1">
                    <Text className="text-custom-companytxt text-xs font-normal">Starts From</Text>
                    <TouchableOpacity>
                        <Text className="text-custom-red text-sm font-medium">
                            {formatAmount(item.starts_from)}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View className="w-[30%] gap-1">
                    {activeItem === 'yettostart' && (

                        
                        <TouchableOpacity className="bg-custom-hyperlink rounded-full px-2 py-2" onPress={() => gotoActionHandler(item)}>
                            <View className="flex-row items-center justify-center">
                                <Text className="text-white text-xs font-medium">Auction</Text>
                                <PlayIcon />
                            </View>
                        </TouchableOpacity>
                    )}
                    {/*
                                activeItem ==='yettostart' && (
                            <TouchableOpacity
                                onPress={() => navigation.navigate("MyAuctionReqForm", { item: item })}
                                className="flex-row items-center space-x-1"
                            >
                                <Text className="text-custom-hyperlink text-xs font-normal bg-custom-lightblue px-3 py-1 rounded-xl">
                                    Request Auction
                                </Text>
                            </TouchableOpacity>
                    )
                    */}
                    {activeItem === 'inprogress' && (
                        <TouchableOpacity className="bg-custom-hyperlink rounded-full px-2 py-2" onPress={() => gotoActionHandler(item)}>
                            <View className="flex-row items-center justify-center">
                                <Text className="text-white text-xs font-medium">Join Auction</Text>
                                <PlayIcon />
                            </View>
                        </TouchableOpacity>
                    )}
                    {activeItem === 'closed' && (
                        <TouchableOpacity className="bg-custom-hyperlink rounded-full py-1 w-[80%]" onPress={() => gotoActionHandler(item, "summary")}>
                            <View className="flex-row items-center justify-center space-x-2">
                                <Text className="text-white text-xs font-medium">View</Text>
                                <GreaterThanWhiteBGIcon />
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>


    );
};

export default UpcomingAuctionCard;
