package com.tingwu.core.session.data

import com.tingwu.core.session.domain.Session

interface SessionRepository {
    suspend fun createSession(exerciseId: String): Result<Session>
    suspend fun saveSession(session: Session): Result<Unit>
    suspend fun loadSession(sessionId: String): Result<Session>
    suspend fun completeSession(session: Session): Result<Unit>
    suspend fun pauseSession(): Result<Unit>
    suspend fun resumeSession(): Result<Unit>
    fun enableAutoSave(interval: Long)
    fun disableAutoSave()
}
