package com.tingwu.core.evaluation.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

@Database(
    entities = [EvaluationEntity::class],
    version = 1,
    exportSchema = false
)
abstract class EvaluationDatabase : RoomDatabase() {
    abstract fun evaluationDao(): EvaluationDao

    companion object {
        @Volatile
        private var INSTANCE: EvaluationDatabase? = null

        fun getInstance(context: Context): EvaluationDatabase {
            return INSTANCE ?: synchronized(this) {
                Room.databaseBuilder(
                    context.applicationContext,
                    EvaluationDatabase::class.java,
                    "evaluation_database"
                ).fallbackToDestructiveMigration()
                 .build()
                    .also { INSTANCE = it }
            }
        }
    }
}
