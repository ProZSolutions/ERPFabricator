import React, { useEffect, useState } from 'react';
import CustomHeader from '../../component/Header/CustomHeader';
import { Alert, Text, View } from 'react-native';
import Container from '../../component/Container/Container';
import Spinner from '../../component/Spinner/Spinner';
import DropdownPickerBox from '../../component/DropdownBox/DropdownPickerBox';
import TextInputBox from '../../component/TextInputBox/TextInputBox';
import CustomRadioButton from '../../component/RadioButton/CustomRadioButton';
import CustomDatePicker from '../../component/DatePicker/CustomDatePicker';
import handleError from '../../component/ErrorHandler/ErrorHandler';
import { postData } from '../../api/ApiService';
import CustomButton from '../../component/Button/CustomButton';
import RightArrowIcon from '../../assets/svg-component/RightArrowIcon';
import PastAuctionModal from '../../component/ModalPopup/PastAuctionModal';
import CustomFooter from '../../component/Footer/CustomFooter';
import moment from 'moment';
import { useNavigation } from "@react-navigation/native";

function ExistingAddChit({ route }) {
    const chitId = route.params?.chitId;
    const navigation = useNavigation();
    const completedMonth = route.params?.completedMonth || 1;
    const [isLoading, setIsLoading] = useState(false);
    const [chitReceivingMonthOptions, setChitReceivingMonthOptions] = useState([]);
    const [memberOptions, setMemberOptions] = useState([]);
    const [reqData, setReqData] = useState([])
    const [formValues, setFormValues] = useState({
        chitReceivingMonth: "",
        selectMember: "",
        auctionAmount: "",
        settlementType: "1",
        settlementDate: "",
        settlementAmount: "",
        pendingAmount: ""
    });
    const [errors, setErrors] = useState({});
    const [noMonths, setNoMonths] = useState(0);
    const [settlementOptionType, setSettlementOptionType] = useState('Yes');
    const [pendingAmtOptionType, setPendingAmtOptionType] = useState('Yes');
    const [isOpenModal, setIsOpenModal] = useState(false);

    const settlementOptions = [
        { label: "Full-settled", value: '1' },
        { label: "Part-settled", value: '2' },
    ];

    const getChitInfoHandler = async () => {
        const requestData = { chit_id: chitId };
        try {
            setIsLoading(true);
            const response = await postData("/chit-summary-list", requestData);
            if (response?.status === "success") {
                setNoMonths(response?.data?.no_of_month);
                const memberList = response?.member?.map((item) => ({
                    ...item,
                    label: item.name,
                    value: item.id
                }));
                setMemberOptions(memberList);
            }
        } catch (error) {
            if (error?.response?.data?.status === "error") {
                Alert.alert("Error", error?.response?.data?.error || "An error occurred.");
            } else {
                await handleError(error, false);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getChitInfoHandler();
    }, [chitId]);

    useEffect(() => {
        const generateData = () => {
            const result = Array.from({ length: completedMonth }, (_, i) => {  //noMonths
                const month = i + 1;
                const suffix = month % 10 === 1 && month !== 11 ? 'st'
                    : month % 10 === 2 && month !== 12 ? 'nd'
                        : month % 10 === 3 && month !== 13 ? 'rd'
                            : 'th';
                return { label: `${month}${suffix} Time`, value: month.toString() };
            });

            setChitReceivingMonthOptions(result);
        };

        generateData();
    }, [noMonths]);

    const handleValueChange = (name, value) => {
        setFormValues({ ...formValues, [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: "" }); // Clear error on change
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formValues.chitReceivingMonth) newErrors.chitReceivingMonth = "Select Chit Receiving Month";
        if (!formValues.selectMember) newErrors.selectMember = "Select a member.";
        if (!formValues.auctionAmount || isNaN(formValues.auctionAmount)) {
            newErrors.auctionAmount = "Enter a valid auction amount.";
        }
        if (settlementOptionType === 'Yes') {
            if (!formValues.settlementDate) newErrors.settlementDate = "Settlement date is required.";
            if (!formValues.settlementAmount || isNaN(formValues.settlementAmount)) {
                newErrors.settlementAmount = "Enter a valid settlement amount.";
            }
        }
        if (pendingAmtOptionType === 'Yes') {
            if (!formValues.pendingAmount || isNaN(formValues.pendingAmount)) {
                newErrors.pendingAmount = "Enter a valid pending amount.";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const checkDublications = (data) => {
        const chitReceivingMonthDuplicates = [];
        const selectMemberDuplicates = [];
        const chitReceivingMonthSet = new Set();
        const selectMemberSet = new Set();

        data.forEach((item) => {
            // Check for duplicates in chitReceivingMonth
            if (chitReceivingMonthSet.has(item.chitReceivingMonth)) {
                chitReceivingMonthDuplicates.push(item);
            } else {
                chitReceivingMonthSet.add(item.chitReceivingMonth);
            }

            // Check for duplicates in selectMember
            if (selectMemberSet.has(item.selectMember)) {
                selectMemberDuplicates.push(item);
            } else {
                selectMemberSet.add(item.selectMember);
            }
        });

        if (chitReceivingMonthDuplicates.length > 0) {
            Alert.alert("", "Chit Receiving Month already selected.");
            return false;
        } else if (selectMemberDuplicates.length > 0) {
            Alert.alert("", "Auction won by member already selected.");
            return false;
        } else {
            return true;
        }

    }

    const handleSubmit = () => {
        if (validateForm()) {
            let data = [...reqData, { ...formValues }];
            if (!checkDublications(data)) {
                return false;
            }
            if (completedMonth - reqData.length == 1) {
                addPastDetailsHandler();
            } else {
                setIsOpenModal(true);
            }

        } else {
            console.log("Form validation failed:", errors);
        }
    };


    const getSelectedText = (options, value, defaultText = "Select") => {
        const selected = options.find((item) => item.value === value);
        return selected?.label || defaultText;
    };

    const getSelectedChitReceivingText = () => getSelectedText(chitReceivingMonthOptions, formValues.chitReceivingMonth);

    const getSelectedMemberText = () => getSelectedText(memberOptions, formValues.selectMember);

    const getSelectedSettlementTypeText = () => getSelectedText(settlementOptions, formValues.settlementType);

    const addMorePastDetailsHandler = () => {
        let data = [...reqData, { ...formValues }];
        setReqData([...reqData, { ...formValues }]);
        setFormValues({
            chitReceivingMonth: "",
            selectMember: "",
            auctionAmount: "",
            settlementType: "1",
            settlementDate: "",
            settlementAmount: "",
            pendingAmount: ""
        });
        setErrors({});
        setIsOpenModal(false);
    }

    const addPastDetailsHandler = async () => {
        try {
            setIsLoading(true);
            setIsOpenModal(false);
            let formData = [...reqData, { ...formValues }]
            const auction_data = formData.map((item) => ({
                month: Number(item?.chitReceivingMonth) || 0,
                win_cus_id: Number(item?.selectMember) || 0,
                auction_amount: parseFloat(item?.auctionAmount) || 0,
                settlement: settlementOptionType?.toLocaleLowerCase() || '',
                settlement_label: Number(item?.settlementType) || 0,
                settlement_date: moment(item?.settlementDate).isValid()
                    ? moment(new Date(item.settlementDate)).format("YYYY-MM-DD")
                    : null,
                settlement_amount: parseFloat(item?.settlementAmount) || 0,
                collection_pending: pendingAmtOptionType?.toLocaleLowerCase() || '',
                collection_pending_amount: parseFloat(item?.pendingAmount) || 0,
            }));

            let req = {
                chit_id: chitId,
                auction_data: auction_data
            }
            const response = await postData('/past-auction-store', req);
            if (response?.status === "success") {
               // navigation.navigate("Home");
                navigation.navigate("ChitSummary", { chitId })
            } else {
                Alert.alert("Failed", "Past Chit Group is not Created.");
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
            setIsLoading(false);
        }


    }

    return (
        <View className="flex-1 bg-white">
            <CustomHeader name="Add Past Auction Details" isBackIcon={false} />
            <Container paddingBottom={80} marginTop={-20}>
                <Spinner visible={isLoading} textContent="Processing..." />
                <View className="px-2 mb-4">
                    <DropdownPickerBox
                        required
                        label="Chit Month"
                        options={chitReceivingMonthOptions}
                        onValueChange={(value) =>
                            handleValueChange("chitReceivingMonth", value)
                        }
                        placeholder={
                            formValues.chitReceivingMonth === null
                                ? "Chit Month"
                                : getSelectedChitReceivingText()
                        }
                        value={formValues.chitReceivingMonth}
                        errorMessage={errors.chitReceivingMonth}
                    />

                    <DropdownPickerBox
                        required
                        label="Auction Taken by"
                        options={memberOptions}
                        onValueChange={(value) => handleValueChange("selectMember", value)}
                        placeholder={getSelectedMemberText()}
                        value={formValues.selectMember}
                        errorMessage={errors.selectMember}
                    />

                    <TextInputBox
                        required
                        placeholder="Settlement amount"
                        label="Settlement amount"
                        value={formValues.auctionAmount}
                        onChangeText={(text) => handleValueChange("auctionAmount", text)}
                        errorMessage={errors.auctionAmount}
                        editable
                        isCurrency
                    />

                    <View className="flex-row justify-between mb-2">
                        <View className="flex-[2]">
                            <Text className="text-custom-heading text-xs font-normal">
                                Settlement Done
                            </Text>
                        </View>
                        <View className="flex-[1]">
                            <CustomRadioButton
                                label="Yes"
                                selected={settlementOptionType === "Yes"}
                                onPress={() => setSettlementOptionType("Yes")}
                            />
                        </View>
                        <View className="flex-[1]">
                            <CustomRadioButton
                                label="No"
                                selected={settlementOptionType === "No"}
                                onPress={() => setSettlementOptionType("No")}
                            />
                        </View>
                    </View>

                    {settlementOptionType === "Yes" && (
                        <>
                            <DropdownPickerBox
                                label=""
                                options={settlementOptions}
                                onValueChange={(value) =>
                                    handleValueChange("settlementType", value)
                                }
                                placeholder={getSelectedSettlementTypeText()}
                                mb="mb-4"
                                errorMessage={errors.settlementType}
                            />

                            <CustomDatePicker
                                date={formValues.settlementDate}
                                onChangeTxt={(value) => handleValueChange("settlementDate", value)}
                                placeholder="Settlement Date"
                                label="Settlement Date"
                                editable
                                rightIcon
                                errorMessage={errors.settlementDate}
                            />
                            <TextInputBox
                                required
                                placeholder="Settlement Amount"
                                label="Settlement Amount"
                                value={formValues.settlementAmount}
                                onChangeText={(text) => handleValueChange("settlementAmount", text)}
                                errorMessage={errors.settlementAmount}
                                editable
                                isCurrency
                            />
                        </>
                    )}

                    <View className="flex-row justify-between mb-2">
                        <View className="flex-[2]">
                            <Text className="text-custom-heading text-xs font-normal">
                                Pending Amount
                            </Text>
                        </View>
                        <View className="flex-[1]">
                            <CustomRadioButton
                                label="Yes"
                                selected={pendingAmtOptionType === "Yes"}
                                onPress={() => setPendingAmtOptionType("Yes")}
                            />
                        </View>
                        <View className="flex-[1]">
                            <CustomRadioButton
                                label="No"
                                selected={pendingAmtOptionType === "No"}
                                onPress={() => setPendingAmtOptionType("No")}
                            />
                        </View>
                    </View>

                    {pendingAmtOptionType === "Yes" && (
                        <TextInputBox
                            required
                            value={formValues.pendingAmount}
                            onChangeText={(text) => handleValueChange("pendingAmount", text)}
                            errorMessage={errors.pendingAmount}
                            editable
                            isCurrency
                            placeholder={'Pending Amount'}
                        />
                    )}

                    <View className="w-full mt-5">
                        <View className="ml-auto">
                            <CustomButton
                                containerClass="px-5"
                                 title=" SUBMIT "
                                onPress={handleSubmit}
                            />
                        </View>
                    </View>

                </View>

                {isOpenModal && (
                    <PastAuctionModal
                        isAddCount={completedMonth - (reqData.length + 1)}
                        close={() => setIsOpenModal(false)}
                        onPressYesBtn={addMorePastDetailsHandler}
                        onPressNoBtn={addPastDetailsHandler}
                    />
                )}

            </Container>
            <CustomFooter />
        </View>

    );
}

export default ExistingAddChit;

