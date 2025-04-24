// src/hooks/useAddChit.js
import { useState, useEffect } from "react";
import { Alert } from "react-native";
import handleError from "../../component/ErrorHandler/ErrorHandler";
import { getData, postData } from "../../api/ApiService";
import { validateAddChitForm } from "./validation";
import moment from "moment";

const useAddChit = (navigation, isExistingChit, isUpdate, updateChitId) => {
  console.log(" is existing"," as "+isExistingChit);
  const today = new Date();
  let minDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const maxDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  if(isExistingChit){
    minDate = new Date(today.getFullYear(), today.getMonth() - 3, 1); } 
 
  const [isLoading, setIsLoading] = useState(false);

  const [formValues, setFormValues] = useState({
    totalChitValue: "",
    interest: "",
    interestAmount: "",
    multipleAuctionValue: "",
    chitReceivingMonth: "",
    chitType: "",
    startDate: null,
    isDividend: false,
    isAuction: false,
    isAgent: true,
    isChitReceiving: true,
    initialAmount: null,
    commisionAmount: null,
    commision: "",
    dividend_after_chit: null,
    is_auction: null,
    chit_to_agent: null,
    is_commission: null,
    months: 6,
    intervals: 1,
    chitName:"",
    completedMonth:1
  });

  const [errors, setErrors] = useState({
    totalChitValue: "",
    interest: "",
    interestAmount: "",
    multipleAuctionValue: "",
    chitReceivingMonth: "",
    chitType: "",
    startDate: "",
    commisionAmount: "",
    commision: "",
    initialAmount: "",
    intervals: "",
    chitName:"",
    completedMonth:""
  });

  const [chitTypeOptions, setChitTypeOptions] = useState([]);
  const [chitReceivingMonthOptions, setChitReceivingMonthOptions] = useState(
    []
  );

  const getUpdateChitInfo = async () => {
    try {
      setIsLoading(true);
      const { data } = await getData("/chit-group-list");

      if (data?.length > 0) {
        const findRecord = data.find((item) => item.id == updateChitId);
        let chitTypeOptionsSelection = chitTypeOptions.find(item=>item.value == findRecord?.chit_type);
        setFormValues((prev) => ({
          ...prev,
          totalChitValue: `${findRecord?.cumulative_amount}`,
          interest: `${findRecord.min_auction_per}`,
          interestAmount: `${findRecord?.min_auction_value}`,
          multipleAuctionValue: `${findRecord.auction_multiple}`,
          chitReceivingMonth: `${findRecord.agent_chit_install}`,
          chitType: findRecord?.chit_type,
          startDate: new Date(findRecord?.start_month),
          isDividend: findRecord?.dividend_after_chit === 'yes' ? true : false,
         // isAuction: false,
          isAgent: findRecord?.agent_com === "yes" ? true : false,
          isChitReceiving: findRecord?.agent_chit === "yes" ? true : false,
        //  initialAmount: null, //Need
          commisionAmount: `${findRecord.agent_com_value}`,
          commision:`${findRecord.agent_com_per}`,
          dividend_after_chit: chitTypeOptionsSelection?.dividend_after_chit,
          is_auction: chitTypeOptionsSelection?.is_auction,
          chit_to_agent: chitTypeOptionsSelection?.chit_to_agent,
          is_commission: chitTypeOptionsSelection?.is_commission,
          months: findRecord.time_period,
          chitName:findRecord?.chit_name
         // intervals: 1, //Need
        }));
      }
    } catch (error) {
      console.error("Error loading chit type data:", error);
    } finally {
        setIsLoading(false);
    }
  };
  useEffect(() => {
    if (isUpdate && chitTypeOptions.length) {
      getUpdateChitInfo();
    }
  }, [isUpdate, updateChitId, chitTypeOptions]);

  useEffect(() => {
    const getChitType = async () => {
      setIsLoading(true);
      try {
        const { data } = await getData("/chit-type-list");
        if (data) {
          const options = data.map((item) => ({
            ...item,
            label: item.name,
            value: item.id,
          }));
          setChitTypeOptions(options);
          setFormValues((prev) => ({
            ...prev,
            chitType: options[0]?.id || "",
            dividend_after_chit: options[0]?.dividend_after_chit,
            is_auction: options[0]?.is_auction,
            chit_to_agent: options[0]?.chit_to_agent,
            is_commission: options[0]?.is_commission,
          }));
        }
      } catch (error) {
        console.error("Error loading chit type data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getChitType();
  }, []);

  useEffect(() => {
    if (formValues.chitType) {
      const findVal = chitTypeOptions.find(
        (item) => item.id === formValues.chitType
      );
      setFormValues((prev) => ({
        ...prev,
        chitType: findVal?.id || "",
        dividend_after_chit: findVal?.dividend_after_chit,
        is_auction: findVal?.is_auction,
        chit_to_agent: findVal?.chit_to_agent,
        is_commission: findVal?.is_commission,
      }));
    }
  }, [formValues.chitType, chitTypeOptions]);

  useEffect(() => {
    const { totalChitValue, interest, months , commision} = formValues;

    if (!totalChitValue || !months || !interest) return;

    const process = parseFloat(totalChitValue) || 0;
    const aper = parseFloat(interest) || 0;
    const nu = parseInt(months, 10);
    const valuefor = (((process * nu) / 12) * aper) / 100;

    if(commision){
      const cpercentage = isNaN(parseFloat(commision)) ? 0 : parseFloat(commision);
      const cvaluefor = (cpercentage * parseFloat(totalChitValue)) / 100;
      setFormValues((prev) => ({
        ...prev,
        interestAmount: valuefor.toFixed(2),
        commisionAmount:cvaluefor.toFixed(2)
      }));
    } else {
      setFormValues((prev) => ({
        ...prev,
        interestAmount: valuefor.toFixed(2),
      }));
    }
   
    
  }, [formValues.totalChitValue, formValues.months]);

  useEffect(() => {
    if (formValues.chitType === "") {
      return;
    }
    const {
      dividend_after_chit,
      isDividend,
      is_auction,
      isAuction,
      is_commission,
      isChitReceiving,
      isAgent,
      chit_to_agent
    } = formValues;
    const newIsDividend =
      dividend_after_chit === 0 || dividend_after_chit == null
        ? isDividend
        : dividend_after_chit === 1;

    const newIsAuction =
      is_auction === 0 || is_auction == null ? isAuction : is_auction === 1;

    const newAgent =
      is_commission === 0 || is_commission == null
        ? isAgent
        : is_commission === 1;

    const newChitReceiving =
      chit_to_agent === 0 || chit_to_agent == null
        ? isChitReceiving
        : chit_to_agent === 1;

    if (
      newIsDividend !== isDividend ||
      newIsAuction !== isAuction ||
      newAgent !== isAgent ||
      newChitReceiving !== isChitReceiving
    ) {
      setFormValues((prev) => ({
        ...prev,
        isDividend: newIsDividend,
        isAuction: newIsAuction,
        isAgent: newAgent,
        isChitReceiving: newChitReceiving,
      }));
    }
  }, [chitTypeOptions, formValues]);

  useEffect(() => {
    const generateData = () => {
      let result = [];

      for (let i = 1; i <= formValues.months; i++) {
        let suffix = "th";
        if (i % 10 === 1 && i !== 11) suffix = "st";
        else if (i % 10 === 2 && i !== 12) suffix = "nd";
        else if (i % 10 === 3 && i !== 13) suffix = "rd";

        result.push({
          label: `${i}${suffix} Time`,
          value: i.toString(),
        });
      }

      if (formValues.chitReceivingMonth) {
        const isValueAvailable = result.some(
          (item) => item.value === formValues.chitReceivingMonth
        );
        setChitReceivingMonthOptions(result);
        setFormValues((prev) => ({
          ...prev,
          chitReceivingMonth: !isValueAvailable ? "" : prev.chitReceivingMonth,
        }));
      } else {
        setChitReceivingMonthOptions(result);
      }
    };

    generateData();
  }, [formValues.months, formValues.chitReceivingMonth]);

  const handleSwitchChange = (name, value) => {
    if (name === "isChitReceiving") {
      setFormValues((prev) => ({
        ...prev,
        chitReceivingMonth: value == true ? "" : prev.chitReceivingMonth,
        [name]: value,
      }));
    } else {
      setFormValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleValueChange = (name, value) => {
    const { totalChitValue, months } = formValues;
    let updatedValues = { ...formValues, [name]: value };

    if (
      [
        "totalChitValue",
        "interest",
        "interestAmount",
        "multipleAuctionValue",
        "commision",
        "commisionAmount",
      ].includes(name)
    ) {
      const numericValue = value.replace(/[^0-9.]/g, "");
      updatedValues[name] = numericValue;
    }

    if (name === "interest" && totalChitValue) {
      const process = parseFloat(totalChitValue) || 0;
      const aper = parseFloat(value) || 0;
      const nu = parseInt(months, 10);
      const valuefor = (((process * nu) / 12) * aper) / 100;

      updatedValues.interestAmount = valuefor.toFixed(2);
    } else if (name === "interestAmount" && totalChitValue) {
      const process = parseFloat(totalChitValue) || 0;
      const avalue = parseFloat(value) || 0;
      const nu = parseInt(formValues.months, 10);
      const temp = (avalue * 12) / (process * nu);
      let per = temp * 100;
      updatedValues.interest = isNaN(per) ? "0" : per.toFixed(2);
    } else if (name === "commision" && totalChitValue) {
      const cpercentage = isNaN(parseFloat(value)) ? 0 : parseFloat(value);
      const cvaluefor = (cpercentage * parseFloat(totalChitValue)) / 100;

      updatedValues.commisionAmount = cvaluefor.toFixed(2);
    } else if (name === "commisionAmount" && totalChitValue) {
      const cvalue = parseFloat(value) || 0;
      let cper = (cvalue / parseFloat(totalChitValue)) * 100;
      cper = isNaN(cper) ? 0 : parseFloat(cper);

      updatedValues.commision = cper.toFixed(2);
    }

    setFormValues(updatedValues);
  };

  // Increase Months
  const increaseMonths = () => {
    if (formValues.months >= 24) {
      return false;
    }
    setFormValues((prev) => ({
      ...prev,
      months: prev.months + 1,
    }));
  };

  // Decrease Months
  const decreaseMonths = () => {
    if (formValues.months <= 6) {
      return false;
    }
    if (formValues.months > 1) {
      setFormValues((prev) => ({
        ...prev,
        months: prev.months - 1,
      }));
    }
  };

  // Increase Months
  const increaseIntervals = () => {
    if (formValues.intervals >= 6) {
      return false;
    }
    setFormValues((prev) => ({
      ...prev,
      intervals: prev.intervals + 1,
    }));
  };

  // Decrease Months
  const decreaseIntervals = () => {
    if (formValues.intervals <= 1) {
      return false;
    }
    if (formValues.months > 1) {
      setFormValues((prev) => ({
        ...prev,
        intervals: prev.intervals - 1,
      }));
    }
  };


  // Increase Months
  const increaseCompletedMonth = () => {
    if (formValues.completedMonth >= formValues.months) {
      return false;
    }
    setFormValues((prev) => ({
      ...prev,
      completedMonth: prev.completedMonth + 1,
    }));
  };

  // Decrease Months
  const decreaseCompletedMonth = () => {
    if (formValues.completedMonth <= 1) {
      return false;
    }
    if (formValues.months > 1) {
      setFormValues((prev) => ({
        ...prev,
        completedMonth: prev.completedMonth - 1,
      }));
    }
  };

  // Handle Form Submission
  const handleSubmit = async () => {
    // Validate form inputs
    const newErrors = validateAddChitForm(formValues);
    const isValid = Object.values(newErrors).every((error) => error === "");
    setErrors(newErrors);
    if (!isValid) return;
 
    setIsLoading(true);

    try {
      const {
        chitType,
        totalChitValue,
        months,
        interest,
        multipleAuctionValue,
        isAgent,
        commisionAmount,
        isChitReceiving,
        chitReceivingMonth,
        isDividend,
        startDate,
        interestAmount,
        initialAmount,
        commision,
        intervals,
        chitName,
        completedMonth
      } = formValues;

      // Prepare request data
      const monthlyAmount = (totalChitValue / months).toFixed(2);
      const startMonth = moment(new Date(startDate)).format("YYYY-MM-DD");

      const requestData = {
        chit_name:chitName,
        chit_type_id: chitType,
        cumulative_amount: totalChitValue,
        no_members: months,
        time_period: months,
        min_auction_per: interest,
        min_auction_value: interestAmount,
        monthly_amount: monthlyAmount,
        auction_multiple: multipleAuctionValue,
        agent_com: isAgent ? "yes" : "no",
        agent_com_per: commision,
        agent_com_value: commisionAmount,
        agent_chit: isChitReceiving ? "yes" : "no",
        agent_chit_install: chitReceivingMonth,
        dividend_after_chit: isDividend ? "yes" : "no",
        start_month: startMonth,
        auction_date: startMonth,
        auction_order: initialAmount,
        remarks: "",
        last_pay_date: 25,
        intervals: intervals,
      };


      // API call
      if(isUpdate){
        let updateRequestData = {
          ...requestData,
          chit_id:updateChitId
        }
        const response = await postData("/chit-group-update", updateRequestData);

        if (response?.status === "success") {
          Alert.alert(
            '', 
            'Chit Group successfully!!!.', 
            [
              {
                text: 'OK',
                onPress: () => {
                  navigation.navigate("LiveChit", {
                    isUpdateNewChit:true
                  });
                }, 
              },
            ],
            { cancelable: false } 
          );
          
        } else {
          Alert.alert("Failed", "Chit Group update failed.");
        }
      } else {
        let url = "/chit-group-store";
        if(isExistingChit){
          requestData.completed_month = completedMonth;
          url = "/exist-chit-group-store"
        }
        const response = await postData(url, requestData);

        if (response?.status === "success") {
          navigation.navigate("SelectMembers", {
            chitId: response?.chit_id,
            isExistingChit: isExistingChit,
            completedMonth:completedMonth
          });
        } else {
          Alert.alert("Failed", "Chit Group is not Created.");
        }
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
  };

  return {
    isLoading,
    formValues,
    setFormValues,
    errors,
    handleSwitchChange,
    handleValueChange,
    increaseMonths,
    decreaseMonths,
    chitTypeOptions,
    chitReceivingMonthOptions,
    handleSubmit,
    minDate,
    maxDate,
    increaseIntervals,
    decreaseIntervals,
    increaseCompletedMonth,
    decreaseCompletedMonth
  };
};

export default useAddChit;
