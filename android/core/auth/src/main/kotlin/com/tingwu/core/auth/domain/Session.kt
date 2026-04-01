package com.tingwu.core.auth.domain

data class Session(
    val userId: String,
    val phoneNumber: String,
    val createdAt: Long,
    val expiresAt: Long
)
