import { useEffect, useRef ,useContext} from 'react';
import { AppState, Alert } from 'react-native';
import PushNotification from 'react-native-push-notification';
import BackgroundFetch from 'react-native-background-fetch';
import Pusher from 'pusher-js/react-native';
import { AuthContext } from './component/AuthContext/AuthContext';
import { getValue } from "./component/AsyncStorage/AsyncStorage";

const PUSHER_APP_KEY = 'qazxswedc';
const CHANNEL_NAME = 'tasknotification';
const EVENT_NAME = 'task.sent';

export const usePusher = () => {
  const pusherRef = useRef(null);
  const retryTimeoutRef = useRef(null);
  const appState = useRef(AppState.currentState);
 

  useEffect(() => {
    // Set up Pusher connection

  

    const testData ={"data": {"message": {"emp_no": "AV-30", "message": "New Task has been assigned for you and Your position for this task is Employee.", "notification_type": "assign_task", "user_type": "employee"}}, "event": "task.sent"};


   
    const connectPusher = () => {
      console.log('🔌 Connecting to Pusher...');

      const pusher = new Pusher(PUSHER_APP_KEY, {
        cluster: 'mt1',
        wsHost: 'soketi.proz.in',
        wsPort: 6001,
        forceTLS: false,
        disableStats: true,
        enabledTransports: ['ws'],
      });


      pusher.connection.bind('connected', () => {
        console.log('✅ Pusher connected');
       //showNotification(testData);
      });
    
      pusher.connection.bind('disconnected', () => {
        console.log('❌ Pusher disconnected');
      });
    
      pusher.connection.bind('error', (err) => {
        console.log('⚠️ Pusher connection error:', err);
      });
    

      const channel = pusher.subscribe(CHANNEL_NAME);

      channel.bind(EVENT_NAME, (data) => {
        console.log('📩 New Pusher Message:', data);
        // When message is received, show notification
        showNotification(data);
      });

      pusherRef.current = { pusher, channel };
    };

  
    const showNotification = async (data) => {
        console.log("show notification called");
        try {
          console.log("try block");
          const user = await getValue('userInfo');
      
          if (!user?.role) return; // Early return if role is null
      
          const messagePayload = data?.data?.message;
      
          if (user?.role === 10 && messagePayload?.user_type === 'employee') {
            PushNotification.localNotification({
              title: messagePayload?.notification_type,
              message: messagePayload?.message || 'You have a new task!',
              playSound: true,
              soundName: 'default',
              userInfo: {
                screen: 'TaskList',
                data: messagePayload, // passing actual task message data
              },
              channelId: 'task-channel',
            });
          }
        } catch (error) {
          console.error('Notification Error:', error);
        }
      };
      
    
   

    const retryConnection = () => {
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = setTimeout(() => {
        disconnectPusher();
        connectPusher();
      }, 5000);
    };

    const disconnectPusher = () => {
      const { pusher, channel } = pusherRef.current || {};
      if (channel) {
        channel.unbind_all();
        channel.unsubscribe();
      }
      if (pusher) {
        pusher.disconnect();
      }
      pusherRef.current = null;
    };

    // Start background fetch task
    const configureBackgroundFetch = () => {
      BackgroundFetch.configure(
        {
          minimumFetchInterval: 15, // Fetch interval (15 mins)
          stopOnTerminate: false, // Keep running when app is killed
          startOnBoot: true, // Restart on app reboot
          enableHeadless: true, // Run in the background
        },
        async (taskId) => {
          console.log('[BackgroundFetch] task started: ', taskId);

          // You can check if you need to reconnect to Pusher here.
          connectPusher();

          // Notify the system that background task is completed
          BackgroundFetch.finish(taskId);
        },
        (error) => {
          console.log('[BackgroundFetch] failed to start: ', error);
        }
      );
    };

    // Handle app state changes (foreground, background, or killed)
    const handleAppStateChange = (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // Reconnect to Pusher when the app comes to the foreground
        connectPusher();
      }
      appState.current = nextAppState;
    };

    configureBackgroundFetch();
    connectPusher();

    // Listen for app state changes
    const appStateListener = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      appStateListener.remove();
      disconnectPusher();
    };
  }, []);

  return null;
};
