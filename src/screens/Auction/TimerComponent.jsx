import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import TimerIcon from "../../assets/svg-component/TimerIcon";

const TimerComponent = ({ startTimer, ongoingTime }) => {
    const [timer, setTimer] = useState(null); // State for the timer display

    useEffect(() => {
      
        // Parse the `startTimer` string into a Date object
        const startTime = new Date(startTimer);

        // Function to calculate the time difference
        const calculateDifference = () => {
            const now = new Date();
            const diff = Math.floor((now - startTime) / 1000); // Difference in seconds
            return diff;
        };

        let interval;

        if (ongoingTime === null) {
            // Start the timer from 00:01 (1 second)
            let secondsElapsed = 1;

            interval = setInterval(() => {
                secondsElapsed += 1;
                const minutes = String(Math.floor(secondsElapsed / 60)).padStart(2, "0");
                const seconds = String(secondsElapsed % 60).padStart(2, "0");
                setTimer(`${minutes}:${seconds}`);
            }, 1000);
        } else {
            // Calculate difference and start the timer
            let secondsElapsed = calculateDifference();

            interval = setInterval(() => {
                secondsElapsed += 1;
                const minutes = String(Math.floor(secondsElapsed / 60)).padStart(2, "0");
                const seconds = String(secondsElapsed % 60).padStart(2, "0");
                setTimer(`${minutes}:${seconds}`);
            }, 1000);
        }

        // Clean up the interval on component unmount
        return () => clearInterval(interval);
    }, [startTimer, ongoingTime]);

    const convertMinutesToHoursMinutesSeconds = (input) => {
        const [totalMinutes, extraSeconds] = input.split(':').map(Number);
        if(totalMinutes < 60){
            return  `${input} min`;
        } else {
            const hours = Math.floor(totalMinutes / 60); // Get total hours
            const minutes = Math.floor(totalMinutes % 60); // Remaining minutes
            const seconds = extraSeconds; // Provided seconds
    
            return `${hours}:${minutes}:${seconds}`;
        }
        
    }

    return (
        <View>
            {timer != null ? (<View className="flex-row justify-end items-center space-x-1">
                <TimerIcon />
                <Text className="text-custom-blackLight text-xs font-normal text-right">
                    {convertMinutesToHoursMinutesSeconds(timer)} </Text>
            </View>) : (null)}
        </View>
    )
};
export default TimerComponent;
