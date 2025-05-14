class PusherForegroundService : Service() {

    private var pusher: Pusher? = null
    private var channel: Channel? = null

    private val CHANNEL_ID = "task_channel"
    private val PUSHER_APP_KEY = "qazxswedc"
    private val PUSHER_CHANNEL = "tasknotification"
    private val EVENT_NAME = "task.sent"

    private var isConnected = false

    override fun onCreate() {
        super.onCreate()
        Log.d("PusherService", "onCreate called")
        createNotificationChannel()
        startForeground(1, createNotification("Listening for tasks..."))
        connectToPusher()
    }

    private fun createNotification(contentText: String): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("ERP Notifications")
            .setContentText(contentText)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .build()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val serviceChannel = NotificationChannel(
                CHANNEL_ID,
                "Task Notification Channel",
                NotificationManager.IMPORTANCE_DEFAULT
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(serviceChannel)
        }
    }

    private fun connectToPusher() {
        if (isConnected) {
            Log.d("PusherService", "Pusher already connected")
            return
        }

        val options = PusherOptions()
            .setCluster("mt1")
            .setWsPort(6001)
            .setWssPort(6001)
            .setEncrypted(false)
            .setHost("soketi.proz.in")

        pusher = Pusher(PUSHER_APP_KEY, options)

        channel = pusher?.subscribe(PUSHER_CHANNEL)
        channel?.bind(EVENT_NAME, SubscriptionEventListener { event ->
            Log.d("PusherService", "Event received: ${event.data}")
            showIncomingNotification("New Task Assigned", event.data)
        })

        pusher?.connect()
        isConnected = true
        Log.d("PusherService", "Pusher connection initiated")
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // Check if service is already running
        Log.d("PusherService", "onStartCommand called")

        if (!isConnected) {
            connectToPusher()
        }
        
        // Ensure the service continues running
        return START_STICKY
    }

    override fun onDestroy() {
        Log.d("PusherService", "onDestroy called, disconnecting Pusher")
        channel?.unbind(EVENT_NAME)
        pusher?.unsubscribe(PUSHER_CHANNEL)
        pusher?.disconnect()
        isConnected = false
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
