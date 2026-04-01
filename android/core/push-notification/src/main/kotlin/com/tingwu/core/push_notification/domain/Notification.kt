package com.tingwu.core.push_notification.domain

data class Notification(
    val id: String,
    val title: String,
    val body: String,
    val data: Map<String, String> = emptyMap(),
    val timestamp: Long = System.currentTimeMillis()
)
