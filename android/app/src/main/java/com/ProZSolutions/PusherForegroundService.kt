package com.ProZSolutions.erp

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import com.pusher.client.Pusher
import com.pusher.client.PusherOptions
import com.pusher.client.channel.Channel
import com.pusher.client.channel.SubscriptionEventListener
import com.pusher.client.channel.PusherEvent
import android.content.pm.ServiceInfo
import org.json.JSONObject


class PusherForegroundService : Service() {

    private var pusher: Pusher? = null
    private var channel: Channel? = null
    private lateinit var subscriptionEventListener: SubscriptionEventListener

    private val CHANNEL_ID = "task_channel"
    private val PUSHER_APP_KEY = "qazxswedc"
    private val PUSHER_CHANNEL = "tasknotification"
    private val EVENT_NAME = "task.sent"

    private var isConnected = false

    override fun onCreate() {
        super.onCreate()
        Log.d("PusherService", "Service started, creating notification and connecting to Pusher.")

        Log.d("PusherService", "onCreate called")

        // Create the notification channel before starting the foreground service
        createNotificationChannel()

        // Start the foreground service with appropriate type for Android 10 and above
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            Log.d("PusherService", "Starting foreground service with data sync type")
            startForeground(
                1,
                createNotification("Listening for tasks..."),
                ServiceInfo.FOREGROUND_SERVICE_TYPE_DATA_SYNC // Use this type for data sync services (appropriate for Pusher)
            )
        } else {
            Log.d("PusherService", "Starting foreground service")
            startForeground(1, createNotification("Listening for tasks..."))
        }

        // Connect to Pusher service
        connectToPusher()
    }

    // Create a notification to show when the service is running
    private fun createNotification(contentText: String): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("ERP Notifications")
            .setContentText(contentText)
            .setSmallIcon(android.R.drawable.ic_dialog_info)  // You can replace this with a custom icon
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setOngoing(true) // This keeps the notification in the foreground
            .setAutoCancel(false) // The notification will not be dismissed automatically
            .build()
    }

    // Create the notification channel for Android Oreo (API 26) and above
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

    // Connect to the Pusher service
    private fun connectToPusher() {
        Log.d("PusherService", "Connecting to Pusher...")

        if (isConnected) {
            Log.d("PusherService", "Pusher already connected")
            return
        }

        // Configure Pusher
        val options = PusherOptions()
            .setCluster("mt1")
            .setWsPort(6001)
            .setWssPort(6001)
            .setEncrypted(false)
            .setHost("soketi.proz.in")

        pusher = Pusher(PUSHER_APP_KEY, options)
        channel = pusher?.subscribe(PUSHER_CHANNEL)

        // Define the event listener for incoming events
        subscriptionEventListener = object : SubscriptionEventListener {
            override fun onEvent(event: PusherEvent) {
                Log.d("PusherService", "Event received: ${event.data}")
               // showIncomingNotification("New Task Assigned", event.data)
                  try {
                    
                    val json = JSONObject(event.data)
    val innerData = json.getJSONObject("data")
    val messageObj = innerData.getJSONObject("message")
    val message = messageObj.getString("message")



                    showIncomingNotification("New Task Assigned", message)
                    } catch (e: Exception) {
                        Log.e("PusherService", "Failed to parse message: ${e.message}")
                        showIncomingNotification("New Task Assigned", "You have a new task.") // Fallback
                    }
            }
        }

        // Bind the event listener to the channel
        channel?.bind(EVENT_NAME, subscriptionEventListener)

        // Connect to Pusher
        pusher?.connect()
        isConnected = true
        Log.d("PusherService", "Pusher connection initiated")
    }

    // Show an incoming notification when a task is assigned
    private fun showIncomingNotification(title: String, message: String) {
        Log.d("PusherService", "Displaying incoming notification: $title - $message")
        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle(title)
            .setContentText(message)
            .setSmallIcon(android.R.drawable.ic_dialog_info) // Replace with your custom icon if needed
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .build()

        // Show the notification using the Notification Manager
        val notificationManager = getSystemService(NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify(2, notification)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d("PusherService", "onStartCommand called")
        if (!isConnected) {
            connectToPusher()
        }
        return START_STICKY
    }

    override fun onDestroy() {
        Log.d("PusherService", "onDestroy called, disconnecting Pusher")
        channel?.unbind(EVENT_NAME, subscriptionEventListener)
        pusher?.unsubscribe(PUSHER_CHANNEL)
        pusher?.disconnect()
        isConnected = false
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }
}
