package com.tingwu.core.session.domain

import com.tingwu.core.session.data.SessionRepository
import javax.inject.Inject

class SessionUseCase @Inject constructor(
    private val repository: SessionRepository
) {
    suspend fun createSession(exerciseId: String) = repository.createSession(exerciseId)
    suspend fun saveSession(session: Session) = repository.saveSession(session)
    suspend fun loadSession(sessionId: String) = repository.loadSession(sessionId)
    suspend fun completeSession(session: Session) = repository.completeSession(session)
    suspend fun pauseSession() = repository.pauseSession()
    suspend fun resumeSession() = repository.resumeSession()
    fun enableAutoSave(interval: Long) = repository.enableAutoSave(interval)
    fun disableAutoSave() = repository.disableAutoSave()
}
