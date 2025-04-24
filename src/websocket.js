// import Echo from 'laravel-echo';
// import Pusher from 'pusher-js';

// // Configure Echo to use WebSockets
// window.Pusher = Pusher;

// const echo = new Echo({
//   broadcaster: 'pusher',
//   key: 'mctsocket',
//   wsHost: '192.206.141.151',   // WebSocket server IP
//   wsPort: 6001,          // WebSocket port
//   forceTLS: false,
//   disableStats: true,
// });

// export default echo;

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: 'pusher',
  key: 'qazxswedc',
  cluster: 'mt1', // Add the appropriate cluster here
  wsHost: '192.206.141.151',
  wsPort: 6001,
  forceTLS: false,
  disableStats: true,
});

 export default echo;
