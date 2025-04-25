import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../Home/Home';
import Login from '../Login/Login';
import SignUp from '../SignUp/SignUp';
import LiveChit from '../LiveChit/LiveChit';
import PendingList from '../PendingList/PendingList';
import MembersList from '../MembersList/MembersList';
import AddMembers from '../AddMembers/AddMembers';
import ChitDetails from '../ChitDetails/ChitDetails';
import AddChit from '../AddChit/AddChit';
import Settings from '../Settings/Settings';
import SelectMembers from '../SelectMembers/SelectMembers';
import PendingDetails from '../PendingDetails/PendingDetails';
import TransactionList from '../TransactionList/TransactionList';
import TransactionDetails from '../TransactionList/TransactionDetails';
import MyChitList from '../MyChitList/MyChitList';
import MyChitDetails from '../MyChitDetails/MyChitDetails';
import MyTransaction from '../MyTransaction/MyTransaction';
import MyAuction from '../MyAuction/MyAuction';
import ChitCalculation from '../ChitCalculation/ChitCalculation';
import { AuthContext } from '../../component/AuthContext/AuthContext';
import SelectedMembersList from '../SelectedMember/SelectedMembersList';
import ChitSummary from '../ChitSummary/ChitSummary';
import UpcomingAuction from '../UpcomingAuction/UpcomingAuction';
import Auction from '../Auction/Auction';
import AuctionConfirm from '../AuctionConfirm/AuctionConfirm';
import AuctionSummary from '../AuctionSummary/AuctionSummary';
import AddCollection from '../AddCollection/AddCollection';
import AddSettlement from '../AddSettlement/AddSettlement';
import AuctionReqList from '../AuctionReqList/AuctionReqList';
import SettlementDetails from '../TransactionList/SettlementDetails';
import MyAuctionReqForm from '../MyAuction/MyAuctionReqForm';
import MyAuctionDetails from '../MyAuction/MyAuctionDetails';
import MyAuctionSummary from '../MyAuction/MyAuctionSummary';
import PorfitLoss from '../PorfitLoss/PorfitLoss';
import ExistingAddChit from '../ExistingChit/ExistingAddChit';
import ExistingChitSummary from '../ExistingChit/ExistingChitSummary';
import TaskList from '../Tasks/TaskList';
import UpdateTask from '../Tasks/UpdateTask';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

function Navigations() {
    const { isLoggedIn } = useContext(AuthContext);
    console.log("is logged in ",isLoggedIn);
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>

        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={isLoggedIn ? 'Home' : 'Login'}
                screenOptions={{ headerShown: false }}
            >
                {isLoggedIn ? (
                    <>
                         <Stack.Screen name="Home" component={Home} />
                        <Stack.Screen name="UpcomingAuction" component={UpcomingAuction} />
                        <Stack.Screen name="TaskList" component={TaskList} />
                        <Stack.Screen name='UpdateTask' component={UpdateTask} />
                        <Stack.Screen name="MembersList" component={MembersList} />
                        <Stack.Screen name="AddMembers" component={AddMembers} />
                        <Stack.Screen name="AddChit" component={AddChit} />
                        <Stack.Screen name="ChitSummary" component={ChitSummary} />
                        <Stack.Screen name="LiveChit" component={LiveChit} />
                        <Stack.Screen name="ChitDetails" component={ChitDetails} />
                        <Stack.Screen name="PendingList" component={PendingList} />
                        <Stack.Screen name="Settings" component={Settings} />
                        <Stack.Screen name="SelectMembers" component={SelectMembers} />
                        <Stack.Screen name="SelectedMembersList" component={SelectedMembersList} />
                        <Stack.Screen name="PendingDetails" component={PendingDetails} />
                        <Stack.Screen name="TransactionList" component={TransactionList} />
                        <Stack.Screen name="TransactionDetails" component={TransactionDetails} />
                        <Stack.Screen name="MyChitList" component={MyChitList} />
                        <Stack.Screen name="MyChitDetails" component={MyChitDetails} />
                        <Stack.Screen name="MyTransaction" component={MyTransaction} />
                        <Stack.Screen name="MyAuction" component={MyAuction} />
                        <Stack.Screen name="ChitCalculation" component={ChitCalculation} />
                        <Stack.Screen name="Auction" component={Auction} />
                        <Stack.Screen name="AuctionConfirm" component={AuctionConfirm} />
                        <Stack.Screen name="AuctionSummary" component={AuctionSummary} />
                        <Stack.Screen name="AddCollection" component={AddCollection} />
                        <Stack.Screen name="AddSettlement" component={AddSettlement} />
                        <Stack.Screen name="AuctionReqList" component={AuctionReqList} />
                        <Stack.Screen name="SettlementDetails" component={SettlementDetails} /> 
                         <Stack.Screen name="MyAuctionReqForm" component={MyAuctionReqForm} />
                        <Stack.Screen name="MyAuctionDetails" component={MyAuctionDetails} />
                        <Stack.Screen name="MyAuctionSummary" component={MyAuctionSummary} />
                        <Stack.Screen name="PorfitLoss" component={PorfitLoss} />
                        <Stack.Screen name="ExistingAddChit" component={ExistingAddChit} />
                        <Stack.Screen name="ExistingChitSummary" component={ExistingChitSummary} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={Login} />
                        <Stack.Screen name="SignUp" component={SignUp} />
                        <Stack.Screen name="Home" component={Home} />

                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
        </GestureHandlerRootView>
    );
}

export default Navigations;
