/**
 * @format
 */
console.log("App starting...");
import 'react-native-reanimated';  
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
console.log("App name: ", appName);  // Check app name

AppRegistry.registerComponent(appName, () => App);
