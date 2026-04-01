package com.tingwu.core.push_notification.domain

import com.tingwu.core.push_notification.data.PushNotificationRepository
import javax.inject.Inject

class PushNotificationUseCase @Inject constructor(
    private val repository: PushNotificationRepository
) {
    suspend fun requestPermission() = repository.requestPermission()
    suspend fun registerDeviceToken() = repository.registerDeviceToken()
    suspend fun unregisterDeviceToken() = repository.unregisterDeviceToken()
    fun onNotificationReceived(callback: (notification: Notification) -> Unit) = repository.onNotificationReceived(callback)
    fun onNotificationTapped(callback: (notification: Notification) -> Unit) = repository.onNotificationTapped(callback)
    suspend fun handleDeepLink(url: String) = repository.handleDeepLink(url)
}
