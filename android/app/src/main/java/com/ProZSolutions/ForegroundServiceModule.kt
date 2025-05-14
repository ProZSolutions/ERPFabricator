package com.ProZSolutions.erp

import android.content.Intent
import android.os.Build
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ForegroundServiceModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    init {
        Log.d("PusherService", "Module initialized")
    }

    override fun getName(): String {
        Log.d("PusherService", "getName() called")
        return "ForegroundService"
    }

    @ReactMethod
    fun startService() {
        Log.d("PusherService", "startService() called")

        val intent = Intent(reactApplicationContext, PusherForegroundService::class.java)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Log.d("PusherService", "Starting service with startForegroundService")
            reactApplicationContext.startForegroundService(intent)
        } else {
            Log.d("PusherService", "Starting service with startService")
            reactApplicationContext.startService(intent)
        }
    }
}
