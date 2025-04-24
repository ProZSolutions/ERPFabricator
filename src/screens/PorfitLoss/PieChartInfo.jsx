import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import DownloadWhiteIcon from '../../assets/svg-component/DownloadWhiteIcon';
import { formatAmount } from '../../utils';

function PieChartInfo({ piechartData }) {
    const data = [piechartData?.profit_percentage, piechartData?.loss_percentage];

    const colors = ['#FF4E4E', '#0DBF88'];

    const pieData = data
        .filter((value) => value > 0)
        .map((value, index) => ({
            value,
            svg: {
                fill: colors[index],
                onPress: () => console.log('press', index),
            },
            key: `pie-${index}`,
        }));
        
    const legendData = [
        { label: 'Profile', color: '#0DBF88', amount: piechartData?.profit_amount },
        { label: 'Loss', color: '#FF4E4E', amount: piechartData?.loss_amount },
    ];

    return (
        <View className="px-2 py-2">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg text-custom-heading font-bold mb-4">P/L Overall Summary</Text>
                
            </View>
            <PieChart
                innerRadius={'80%'}
                outerRadius={'100%'}
                style={{ height: 280 }}
                data={pieData}
            />
            <View className="flex-1 justify-end  w-[40%] ml-auto">
                {legendData.map((item, index) => (
                    <View key={index} className="flex-row items-center mb-2">
                        <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                        <Text className="text-custom-heading text-sm font-normal">{item.label}: {formatAmount(item.amount)}</Text>
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

export default PieChartInfo;
