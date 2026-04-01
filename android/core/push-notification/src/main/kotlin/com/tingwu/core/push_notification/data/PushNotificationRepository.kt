package com.tingwu.core.push_notification.data

import com.tingwu.core.push_notification.domain.Notification

interface PushNotificationRepository {
    suspend fun requestPermission(): Result<Boolean>
    suspend fun registerDeviceToken(): Result<Unit>
    suspend fun unregisterDeviceToken(): Result<Unit>
    fun onNotificationReceived(callback: (notification: Notification) -> Unit)
    fun onNotificationTapped(callback: (notification: Notification) -> Unit)
    suspend fun handleDeepLink(url: String): Result<Unit>
}
