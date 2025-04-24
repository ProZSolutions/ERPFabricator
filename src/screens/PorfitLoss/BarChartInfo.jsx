import { BarChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import DownloadWhiteIcon from '../../assets/svg-component/DownloadWhiteIcon';
import { StyleSheet, Text, View } from 'react-native';
import { Rect, G } from 'react-native-svg';

function BarChartInfo({ rawData }) {
   const colors = ['#0DBF88', '#FF4E4E']; // First color for positive, second for negative
    //  rawData = {
    //     '2024-12-01': { profit: 10, loss: 0 },
    //    '2024-02-01': { profit: 0, loss: 10 },
    //    '2024-03-01': { profit: 30, loss: 0 },
    //     '2024-04-01': { profit: 60, loss: 0 },
    //     '2024-01-01': { profit: 0, loss: 30 },
    //     '2024-06-01': { profit: 0, loss: 30 },
    //     '2024-07-01': { profit: 0, loss: 30 },
    //     '2024-08-01': { profit: 0, loss: 30 },
    //     '2024-09-01': { profit: 0, loss: 30 },
    //     '2024-10-01': { profit: 0, loss: 30 },
    // };

    // Sort the data by date (ascending)
    const sortedData = Object.entries(rawData).sort(([a], [b]) => new Date(a) - new Date(b));

   
    // Transform the sorted data into a format suitable for the chart
    const data = sortedData.map(([, { profit, loss }]) => profit - loss);
    const xLabels = sortedData.map(([date]) => date);

    // Function to format the date to "Jan 24"
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: '2-digit', month: 'short' };
        return date.toLocaleDateString('en-US', options);
    };

    const legendData = [
        { label: 'Profit', color: '#0DBF88' },
        { label: 'Loss', color: '#FF4E4E' },
    ];

    const CustomBar = ({ x, y, bandwidth, data }) => (
        <G>
            {data.map((value, index) => {
                const fillColor = value > 0 ? colors[0] : colors[1];
                return (
                    <Rect
                        key={index}
                        x={x(index)} // Position on X axis
                        y={value >= 0 ? y(value) : y(0)} // Top position
                        width={bandwidth} // Bar width
                        height={Math.abs(y(value) - y(0))} // Bar height
                        fill={fillColor}
                    />
                );
            })}
        </G>
    );

    return (
        <View className="px-2 py-2">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg text-custom-heading font-bold mb-4">P/L Overall Summary</Text>
                
            </View>
            <View style={{ flexDirection: 'row', height: 300 }}>
                {/* Y-Axis */}
                <YAxis
                    data={data}
                    contentInset={{ top: 10, bottom: 10 }}
                    svg={{ fontSize: 12, fill: 'gray' }}
                    style={{ marginRight: 10 }}
                />

                <View style={{ flex: 1 }}>
                    {/* Bar Chart */}
                    <BarChart
                        style={{ flex: 1 }}
                        data={data}
                        svg={{ fill: 'transparent' }}
                        contentInset={{ top: 10, bottom: 10 }}
                        spacingInner={0.3}
                    >
                        <CustomBar />
                        <Grid />
                    </BarChart>

                    {/* X-Axis */}
                    <XAxis
                        style={{ marginTop: 10 }}
                        data={data}
                        formatLabel={(value, index) => formatDate(xLabels[index])}
                        contentInset={{ left: 10, right: 10 }}
                        svg={{ fontSize: 12, fill: 'gray' }}
                    />
                </View>
            </View>
            <View className="flex-row justify-between py-4">
                {legendData.map((item, index) => (
                    <View key={item.label} className="flex-row items-center mb-2">
                        <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                        <Text className="text-right">{item.label}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    legendColor: {
        width: 10,
        height: 10,
        borderRadius: 10,
        marginRight: 8,
    }
});

export default BarChartInfo;
