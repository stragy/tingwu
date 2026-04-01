package com.tingwu.core.push_notification.data

import android.Manifest
import android.app.Activity
import android.content.Context
import android.content.pm.PackageManager
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlin.coroutines.resume
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class PermissionManager @Inject constructor(
    private val context: Context
) {
    
    companion object {
        const val REQUEST_NOTIFICATION_PERMISSION = 1001
    }
    
    fun hasNotificationPermission(): Boolean {
        return if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
            ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.POST_NOTIFICATIONS
            ) == PackageManager.PERMISSION_GRANTED
        } else {
            true // Android 12 以下不需要显式权限
        }
    }
    
    fun shouldShowNotificationRationale(activity: Activity): Boolean {
        return if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
            ActivityCompat.shouldShowRequestPermissionRationale(
                activity,
                Manifest.permission.POST_NOTIFICATIONS
            )
        } else {
            false
        }
    }
    
    fun requestNotificationPermission(activity: Activity) {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
            ActivityCompat.requestPermissions(
                activity,
                arrayOf(Manifest.permission.POST_NOTIFICATIONS),
                REQUEST_NOTIFICATION_PERMISSION
            )
        }
    }
    
    suspend fun requestNotificationPermissionWithResult(activity: Activity): Boolean {
        return suspendCancellableCoroutine { continuation ->
            if (hasNotificationPermission()) {
                continuation.resume(true)
                return@suspendCancellableCoroutine
            }
            
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
                val permissionRequestListener = object : ActivityCompat.OnRequestPermissionsResultCallback {
                    override fun onRequestPermissionsResult(
                        requestCode: Int,
                        permissions: Array<String>,
                        grantResults: IntArray
                    ) {
                        if (requestCode == REQUEST_NOTIFICATION_PERMISSION) {
                            val granted = grantResults.isNotEmpty() && 
                                        grantResults[0] == PackageManager.PERMISSION_GRANTED
                            continuation.resume(granted)
                        }
                    }
                }
                
                // 这里简化处理，实际应该使用 Fragment 或 Activity 的结果回调
                ActivityCompat.requestPermissions(
                    activity,
                    arrayOf(Manifest.permission.POST_NOTIFICATIONS),
                    REQUEST_NOTIFICATION_PERMISSION
                )
                
                // 简化：假设权限被授予（实际项目中需要完整的回调处理）
                continuation.resume(false)
            } else {
                continuation.resume(true) // Android 12 以下默认有权限
            }
        }
    }
}