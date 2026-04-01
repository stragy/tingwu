package com.tingwu.app.service

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import com.tingwu.app.MainActivity
import com.tingwu.core.push_notification.data.PushNotificationRepositoryImpl
import com.tingwu.core.push_notification.domain.Notification
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.util.UUID
import javax.inject.Inject

/**
 * 真实的 Firebase Cloud Messaging 服务
 *
 * 与 [PushNotificationRepositoryImpl] 配合，实现：
 * - 新 FCM token 到来时自动上报后端
 * - 接收到消息时触发应用内回调，并展示系统通知
 * - 支持 data payload 中的 deep_link 字段
 */
@AndroidEntryPoint
class TingwuMessagingService : FirebaseMessagingService() {

    @Inject
    lateinit var pushNotificationRepository: PushNotificationRepositoryImpl

    private val scope = CoroutineScope(Dispatchers.IO)

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        // FCM Token 刷新时，立即上报后端
        scope.launch {
            try {
                pushNotificationRepository.registerDeviceToken()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)

        val notification = Notification(
            id = remoteMessage.messageId ?: UUID.randomUUID().toString(),
            title = remoteMessage.notification?.title ?: getString(android.R.string.untitled),
            body = remoteMessage.notification?.body ?: "",
            data = remoteMessage.data,
            timestamp = System.currentTimeMillis()
        )

        // 触发应用内通知回调
        pushNotificationRepository.triggerNotificationReceived(notification)

        // 展示系统通知
        showSystemNotification(notification)

        // 处理 deep_link 数据字段
        remoteMessage.data["deep_link"]?.takeIf { it.isNotEmpty() }?.let { deepLink ->
            scope.launch {
                try {
                    pushNotificationRepository.handleDeepLink(deepLink)
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        }
    }

    // ---- 系统通知展示 ----

    private fun showSystemNotification(notification: Notification) {
        createNotificationChannel()

        val intent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            notification.data.forEach { (key, value) -> putExtra(key, value) }
        }

        val pendingIntent = PendingIntent.getActivity(
            this, notification.id.hashCode(), intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val builder = NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle(notification.title)
            .setContentText(notification.body)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .setVibrate(longArrayOf(0, 250, 250, 250))
            .setLights(0xFF1976D2.toInt(), 1000, 1000)

        try {
            NotificationManagerCompat.from(this)
                .notify(notification.id.hashCode(), builder.build())
        } catch (e: SecurityException) {
            // POST_NOTIFICATIONS 权限未获取时静默忽略
            e.printStackTrace()
        }
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "接收练习提醒、成绩通知等"
                enableVibration(true)
                vibrationPattern = longArrayOf(0, 250, 250, 250)
                enableLights(true)
                lightColor = 0xFF1976D2.toInt()
            }
            val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(channel)
        }
    }

    companion object {
        const val CHANNEL_ID = "tingwu_notifications"
        const val CHANNEL_NAME = "听悟通知"
    }
}
