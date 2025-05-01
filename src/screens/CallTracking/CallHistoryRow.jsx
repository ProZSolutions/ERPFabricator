import {View, Text, TouchableOpacity,Modal } from 'react-native';
import { useState,useEffect  } from 'react';
import { CalendarIcon } from 'react-native-heroicons/outline'; // Optional icon
import { styled } from 'nativewind'; 
import { Swipeable } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
 import FontAwesome from 'react-native-vector-icons/FontAwesome';
 import Feather from 'react-native-vector-icons/Feather';
 import moment, { duration } from 'moment';
 import Sound from 'react-native-sound';
 import Slider from '@react-native-community/slider';





const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StockAlertItem = ({ details }) => {
    const navigation = useNavigation();
    const [visible, setVisible] = useState(false);
    const [sound, setSound] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [intervalId, setIntervalId] = useState(null);

    const isIncoming = details?.call_type === 'incoming';
    const iconName = isIncoming ? 'phone-incoming' : 'phone-outgoing';
    const bgColor = isIncoming ? 'bg-red-100' : 'bg-green-100';
 
    const callFormat = (input) => {
        if (!input) return '';
      
        const formattedDate = moment(input, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY hh:mm A');
         return formattedDate;
      };
      const formatDuration = (duration) => {
        try {
          const parts = duration.split(':');
          const hours = parseInt(parts[0], 10);
          const minutes = parseInt(parts[1], 10);
          const seconds = parseInt(parts[2], 10);
      
          let result = '';
          if (hours > 0) result += `${hours} hr `;
          if (minutes > 0) result += `${minutes} min `;
          if (seconds > 0) result += `${seconds} sec`;
      
          return result.trim();
        } catch (error) {
          console.error(error);
          return duration;
        }
      };
      const playSound = (audioUrl) => {
        const audio = new Sound(audioUrl, null, (error) => {
          if (error) {
             return;
          }
          setSound(audio);
          setDuration(audio.getDuration());
      
          audio.play((success) => {
            if (success) {
             } else {
             }
            clearInterval(intervalId);
          });
      
          const id = setInterval(() => {
            audio.getCurrentTime(setCurrentTime);
          }, 500);
      
          setIntervalId(id);
        });
      };
      
      const closeModal = () => {
        if (sound) {
          sound.stop(() => sound.release());
        }
        clearInterval(intervalId);
        setCurrentTime(0);
        setVisible(false);
      };
return (
    <StyledView className="bg-white flex-row items-center justify-between p-4 m-3 rounded-lg shadow-sm border border-gray-200">
      {/* Left - Avatar and Info */}
      <StyledView className="flex-row items-center space-x-3">
        {/* Avatar */}
        <StyledView className={`${bgColor} w-12 h-12 rounded-full justify-center items-center`}>
                 <Feather name={isIncoming ? 'phone-incoming' : 'phone-outgoing'} size={18} color="#000" />
        </StyledView>

        {/* Name and ID */}
        <StyledView className="flex-col">
          <StyledText className="text-black font-semibold text-xs">{details.mobile_no}</StyledText>
          <StyledText className="text-[11px] text-gray-500">{details?.call_start_time ? callFormat(details.call_start_time) : ' '}</StyledText>
          <StyledText className="text-[11px] text-gray-500 ">{details?.duration? formatDuration(details.duration) :' ' }</StyledText>

        </StyledView>
      </StyledView>

      <StyledView className="flex-row items-start space-x-2">
                {details?.attachment ? (
                    <StyledTouchableOpacity   onPress={() => {
                                            setVisible(true);
                                            playSound(details.attachment);
                             }}
                     className="flex-row items-center px-2 py-1 bg-gray-100 rounded-md">
                    <FontAwesome name="play" size={10} color="black" />
                    <StyledText className="text-xs text-blue-600 ml-1">Play recording</StyledText>
                    </StyledTouchableOpacity>
                ) : (
                    <StyledView className="flex-row items-center px-2 py-1 bg-gray-100 rounded-md">
                    <StyledText className="text-xs text-gray-400">No recording</StyledText>
                    </StyledView>
                )}
    </StyledView>

    <Modal visible={visible} transparent animationType="slide">
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
    <View className="bg-white p-5 rounded-xl w-10/12 max-h-[300px] relative">
      
      {/* Close Icon */}
      <TouchableOpacity onPress={closeModal} className="absolute top-2 right-2 z-10">
        <FontAwesome name="close" size={20} color="black" />
      </TouchableOpacity>

      <Text className="text-lg font-semibold mb-4 text-center">Audio Player</Text>

      {/* Seekbar */}
      <Slider
        style={{ width: '100%', height: 40 }}
        minimumValue={0}
        maximumValue={duration}
        value={currentTime}
        onSlidingComplete={(value) => {
          if (sound) sound.setCurrentTime(value);
        }}
        minimumTrackTintColor="#1E90FF"
        maximumTrackTintColor="#ccc"
        thumbTintColor="#1E90FF"
      />

      {/* Seek Controls */}
      <View className="flex-row justify-around items-center mt-4">
        {/* Backward 10s */}
        <TouchableOpacity
          className="bg-gray-500 px-3 py-2 rounded-full"
          onPress={() => {
            if (sound) {
              sound.getCurrentTime((seconds) => {
                sound.setCurrentTime(Math.max(seconds - 10, 0));
              });
            }
          }}
        >
          <Text>◀︎ 10s</Text>
        </TouchableOpacity>

        {/* Play/Pause */}
        <TouchableOpacity
          className="bg-blue-500 px-4 py-3 rounded-full"
          onPress={() => {
            if (sound) {
              sound.isPlaying() ? sound.pause() : sound.play();
            }
          }}
        >
          <FontAwesome name={sound?.isPlaying() ? 'pause' : 'play'} size={20} color="white" />
        </TouchableOpacity>

        {/* Forward 10s */}
        <TouchableOpacity
          className="bg-gray-500 px-3 py-2 rounded-full"
          onPress={() => {
            if (sound) {
              sound.getCurrentTime((seconds) => {
                sound.setCurrentTime(Math.min(seconds + 10, duration));
              });
            }
          }}
        >
          <Text>10s ▶︎</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

    </StyledView>
    

);
};
export default StockAlertItem;
