import React from 'react'
import { StatusBar, useColorScheme } from 'react-native';

function StatusBarComponent() {
  const Colors = {
    white: '#ffffff',
    black: '#000000',
    light: '#f4f4f4',
    dark: '#333333',
    lighter: '#2862EC',
    darker: '#2862EC',
  };

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: '#2862EC'//isDarkMode ? Colors.darker : Colors.lighter,
  };
  return (
    <StatusBar
      barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      backgroundColor={backgroundStyle.backgroundColor}
    />
  )
}
export default StatusBarComponent;