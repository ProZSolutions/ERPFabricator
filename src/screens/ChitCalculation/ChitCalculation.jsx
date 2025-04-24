import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import CustomHeader from "../../component/Header/CustomHeader";
import Container from "../../component/Container/Container";
import CustomFooter from "../../component/Footer/CustomFooter";
import TextInputBox from "../../component/TextInputBox/TextInputBox";
import CustomButton from "../../component/Button/CustomButton";
import CalculatorIcon from "../../assets/svg-component/CalculatorIcon";
import PaymentDetails from "./PaymentDetails";

function ChitCalculation() {
    // State for inputs
    const [chitValue, setChitValue] = useState("");
    const [members, setMembers] = useState("");
    const [interest, setInterest] = useState("");
    const [commission, setCommission] = useState("");
    const [auctionAmount, setAuctionAmount] = useState("");
    const [state, setState] = useState({
        auctionAmount: 0,
        agentCommision: 0,
        totalAmtPayable: 0,
        dividendPerMember: 0,
        payableAmtPerPersion: 0
    });

    // State for error messages
    const [errors, setErrors] = useState({
        chitValue: "",
        members: "",
        interest: "",
        commission: "",
        auctionAmount: "",
    });

    // Validation Function
    const validateInputs = () => {
        const newErrors = {
            chitValue: chitValue && !isNaN(chitValue) ? "" : "Enter a valid Chit Value",
            members: members && !isNaN(members) ? "" : "Enter a valid Member/Month",
            interest: interest && !isNaN(interest) ? "" : "Enter a valid Interest Percentage",
            commission: commission && !isNaN(commission) ? "" : "Enter a valid Commission Percentage",
            auctionAmount: auctionAmount && !isNaN(auctionAmount) ? "" : "Enter a valid Auction Amount",
        };

        setErrors(newErrors);

        // Check if any errors exist
        return Object.values(newErrors).every((error) => error === "");
    };

    // OnPress Handler
    const onPressCalculationHandler = () => {
        if (!validateInputs()) return;

        // Parse inputs and perform calculations
        const chitValueNum = parseFloat(chitValue);
        const membersNum = parseFloat(members);
        const interestNum = parseFloat(interest);
        const commissionNum = parseFloat(commission);
        const auctionAmountNum = parseFloat(auctionAmount);

        const agentCommisionAmount = (commissionNum * chitValueNum) / 100;
        const totalPayAmtCal = (chitValueNum * ((membersNum - 1) / 12) * interestNum) / 100;
        const totalComm = chitValueNum - totalPayAmtCal;
        const totalPayAmt = totalComm - agentCommisionAmount;

        const dividendByMember = totalPayAmtCal / membersNum;
        const payAmtPerPersion = chitValueNum / membersNum - dividendByMember;

        setState({
            auctionAmount: auctionAmountNum,
            agentCommision: agentCommisionAmount,
            totalAmtPayable: totalPayAmt,
            dividendPerMember: dividendByMember,
            payableAmtPerPersion: payAmtPerPersion
        });
    };

    return (
        <View className="flex-1 bg-white">
            <CustomHeader name="Chit Calculator" isBackIcon={true} />
            <Container paddingBottom={80}>
                <View style={{ marginTop: -15 }}>
                    <View className="flex-row space-x-4">
                        <View className="flex-1">
                            <TextInputBox
                                required={true}
                                placeholder="Chit Value"
                                value={chitValue}
                                label="Chit Value"
                                onChangeText={(text) => setChitValue(text)}
                                keyboardType="numeric"
                                errorMessage={errors.chitValue}
                                isCurrency={true}
                            />
                        </View>
                        <View className="flex-1">
                            <TextInputBox
                                required={true}
                                placeholder="Member/Month"
                                label="Member/Month"
                                value={members}
                                onChangeText={(text) => setMembers(text)}
                                keyboardType="numeric"
                                errorMessage={errors.members}
                            />
                        </View>
                    </View>
                    <View className="flex-row space-x-4">
                        <View className="flex-1">
                            <TextInputBox
                                required={true}
                                placeholder="Interest Percentage"
                                label="Interest Percentage"
                                value={interest}
                                onChangeText={(text) => setInterest(text)}
                                keyboardType="numeric"
                                errorMessage={errors.interest}
                                isPercentage={true}
                            />
                        </View>
                        <View className="flex-1">
                            <TextInputBox
                                required={true}
                                placeholder="Commission Percentage"
                                label="Commission Percentage"
                                value={commission}
                                onChangeText={(text) => setCommission(text)}
                                keyboardType="numeric"
                                errorMessage={errors.commission}
                                isPercentage={true}
                            />
                        </View>
                    </View>
                    <View className="flex-row space-x-4">
                        <View className="flex-1">
                            <TextInputBox
                                required={true}
                                placeholder="Auction Amount"
                                label="Auction Amount"
                                value={auctionAmount}
                                onChangeText={(text) => setAuctionAmount(text)}
                                keyboardType="numeric"
                                errorMessage={errors.auctionAmount}
                                isCurrency={true}
                            />
                        </View>
                        <View className="flex-1 justify-center mt-1">
                            <CustomButton
                                isLeftIcon={true}
                                icon={<CalculatorIcon />}
                                title="Calculate"
                                gapClass="ml-1"
                                onPress={onPressCalculationHandler}
                            />
                        </View>
                    </View>

                    <PaymentDetails item={state} />
                    <View className="bg-gray-520 p-4 border border-gray-100 mb-4 rounded-lg">
                        <Text className="text-custom-companytxt text-xs font-normal">
                            <Text className="font-bold">Disclaimer:</Text> This figure is based on the first month; the same applies to subsequent months. Other months' auction amounts may vary according to the auction requests made by members of the chit.
                        </Text>
                    </View>


                </View>
            </Container>
            <CustomFooter />
        </View>
    );
}



export default ChitCalculation;
