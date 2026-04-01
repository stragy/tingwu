package com.tingwu.core.session.domain

data class Session(
    val id: String,
    val userId: String,
    val exerciseId: String,
    val startTime: Long,
    val endTime: Long? = null,
    val status: String = "in_progress",
    val sessionData: String = "",
    val createdAt: Long = System.currentTimeMillis()
)
