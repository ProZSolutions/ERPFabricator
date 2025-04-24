import React, { useEffect, useState } from 'react'
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import CustomHeader from '../../component/Header/CustomHeader';
import dayjs from 'dayjs';
import CalenderIcon from '../../assets/svg-component/CalenderIcon';
import CalenderModal from '../../component/CalenderModal/CalenderModal';
import Spinner from '../../component/Spinner/Spinner';
import Container from '../../component/Container/Container';
import CustomFooter from '../../component/Footer/CustomFooter';
import { postData } from '../../api/ApiService';
import handleError from '../../component/ErrorHandler/ErrorHandler';
import moment from 'moment';
import TailInfo from './TailInfo';
import PieChartInfo from './PieChartInfo';
import BarChartInfo from './BarChartInfo';



function PorfitLoss() {
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(1);
    const [summaryData, setSummaryData] = useState("");
    const today = dayjs();
    const oneMonthsAgo = today.subtract(1, 'month');

    const [dateRange, setDateRange] = useState({
        startDate: oneMonthsAgo,
        endDate: today
    });
    const [openCal, setOpenCal] = useState(false);

    const options = [
        { id: 1, label: "All", type: "all" },
        { id: 2, label: "Live", type: "live" },
        { id: 3, label: "Closed", type: "closed" }
    ];

    const getSummaryDataFetch = async () => {

        let getOptions = options.find(item => item.id == selected);

        setLoading(true);
        try {
            let req =  {
                type: getOptions.type,
                from: moment(new Date(dateRange.startDate)).format("YYYY-MM-DD"),
                to: moment(new Date(dateRange.endDate)).format("YYYY-MM-DD")
            };
            const response = await postData('/profit-loss-summary', req);

            if (response && response.status === 'success') {
                setSummaryData(response);
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
        getSummaryDataFetch()
    }, [selected])



    return (
        <View className="flex-1 bg-white">
            <CustomHeader name="Profit / Loss Summary" isBackIcon={true} />
            <View className="flex-row justify-around mt-4 bg-white p-2 rounded-full shadow">
                {/* First 3 Options (80% Total) */}
                <View className="flex-row flex-[0.9] justify-around">
                    {options.map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            className={`flex-1 items-center justify-center py-2 mx-1 rounded-full ${selected === option.id ? 'bg-custom-hyperlink' : 'bg-custom-lightblue'
                                }`}
                            onPress={() => setSelected(option.id)}
                        >
                            <Text
                                className={`text-xs font-semibold ${selected === option.id ? 'text-white' : 'text-black'
                                    }`}
                            >
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Last Option (20%) */}
                <View className="flex-[0.1] items-center justify-center">
                    <TouchableOpacity
                        className="flex-1 items-center justify-center"
                        onPress={() => setOpenCal(true)}
                    >
                        <CalenderIcon />
                    </TouchableOpacity>
                </View>
            </View>


            {openCal && (
                <CalenderModal
                    dateRange={dateRange}
                    onChange={event => setDateRange(event)}
                    close={() => setOpenCal(false)}
                    maxDate={today}
                />
            )}

            <Container paddingBottom={80}>
                {loading ? (
                    <Spinner visible={loading} textContent="Loading..." />
                ) : (
                    <View className="mb-0">
                        <TailInfo summaryData={summaryData} />
                        <View className="w-full h-[1px] bg-gray-200 my-4" />
                        <PieChartInfo piechartData = {summaryData?.pie_chart}/>
                        <View className="w-full h-[1px] bg-gray-200 my-4" />
                        <BarChartInfo rawData = {summaryData?.barchart || {}} />
                    </View>
                )}
            </Container>
            <CustomFooter />
        </View>
    )
}
export default PorfitLoss;