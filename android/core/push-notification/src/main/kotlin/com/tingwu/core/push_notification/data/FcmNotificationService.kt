package com.tingwu.core.push_notification.data

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
import com.tingwu.core.push_notification.domain.Notification
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.util.UUID
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class FcmNotificationService @Inject constructor(
    private val context: Context,
    private val repository: PushNotificationRepository
) : FirebaseMessagingService() {
    
    companion object {
        const val CHANNEL_ID = "tingwu_notifications"
        const val CHANNEL_NAME = "听悟通知"
        const val CHANNEL_DESCRIPTION = "接收练习提醒、成绩通知等"
        
        fun createNotificationChannel(context: Context) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val importance = NotificationManager.IMPORTANCE_HIGH
                val channel = NotificationChannel(
                    CHANNEL_ID,
                    CHANNEL_NAME,
                    importance
                ).apply {
                    description = CHANNEL_DESCRIPTION
                    enableVibration(true)
                    vibrationPattern = longArrayOf(0, 250, 250, 250)
                    enableLights(true)
                    lightColor = 0xFF1976D2.toInt()
                }
                
                val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
                notificationManager.createNotificationChannel(channel)
            }
        }
    }
    
    override fun onNewToken(token: String) {
        super.onNewToken(token)
        
        // 在新线程中处理令牌注册
        CoroutineScope(Dispatchers.IO).launch {
            repository.registerDeviceToken()
        }
    }
    
    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)
        
        val notification = createNotificationFromRemoteMessage(remoteMessage)
        
        // 触发回调
        (repository as? PushNotificationRepositoryImpl)?.triggerNotificationReceived(notification)
        
        // 显示通知
        showNotification(notification)
        
        // 处理数据消息（如果存在）
        remoteMessage.data.let { data ->
            if (data.isNotEmpty()) {
                // 处理深层链接等
                val deepLink = data["deep_link"]
                if (!deepLink.isNullOrEmpty()) {
                    CoroutineScope(Dispatchers.IO).launch {
                        repository.handleDeepLink(deepLink)
                    }
                }
            }
        }
    }
    
    private fun createNotificationFromRemoteMessage(remoteMessage: RemoteMessage): Notification {
        return Notification(
            id = remoteMessage.messageId ?: UUID.randomUUID().toString(),
            title = remoteMessage.notification?.title ?: "听悟",
            body = remoteMessage.notification?.body ?: "新消息",
            data = remoteMessage.data,
            timestamp = System.currentTimeMillis()
        )
    }
    
    private fun showNotification(notification: Notification) {
        createNotificationChannel(context)
        
        // 创建点击意图（动态查找 MainActivity，避免跨模块依赖）
        val launchIntent = context.packageManager.getLaunchIntentForPackage(context.packageName)
        val intent = (launchIntent ?: Intent(Intent.ACTION_MAIN).apply {
            addCategory(Intent.CATEGORY_LAUNCHER)
            `package` = context.packageName
        }).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            // 可以添加额外数据
            notification.data.forEach { (key, value) ->
                putExtra(key, value)
            }
        }
        
        val pendingIntent = PendingIntent.getActivity(
            context,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        
        val builder = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_dialog_info) // 需要替换为应用图标
            .setContentTitle(notification.title)
            .setContentText(notification.body)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .setVibrate(longArrayOf(0, 250, 250, 250))
            .setLights(0xFF1976D2.toInt(), 1000, 1000)
        
        NotificationManagerCompat.from(context).notify(notification.id.hashCode(), builder.build())
    }
}