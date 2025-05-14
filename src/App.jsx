// App.jsx
import React,{useContext,useEffect} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigations from './screens/navigations/Navigations';
import { AuthProvider,AuthContext  } from './component/AuthContext/AuthContext';
import { usePusher } from './usePusher';
import { navigate,navigationRef  } from './screens/navigations/NavigationService'; // Adjust path
import PushNotification from 'react-native-push-notification';
 
 
function App() {
  //usePusher(); // start as early as possible

 

   useEffect(() => {
 
 
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('Notification opened:', notification);
  
        console.log("navigation screen "+notification.data.screen);
        // FIXED: check data.screen instead of userInfo.screen
        if (
          notification.data &&
          notification.data.screen === 'TaskList'
        ) {
            console.log("come to true ");
            if (navigationRef.isReady()) {
              navigate('TaskList', { data: notification.data.data });
            } else {
              setTimeout(() => {
                navigate('TaskList', { data: notification.data.data });
              }, 500);
            }
        }
      },
      requestPermissions: Platform.OS === 'ios',
    });
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Navigations />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
