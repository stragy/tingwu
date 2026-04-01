package com.tingwu.app.ui

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class DeepLinkActivity : AppCompatActivity() {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        val intent = intent
        val data = intent.data
        
        if (data != null) {
            val deepLink = data.toString()
            // Handle deep link routing
            handleDeepLink(deepLink)
        }
        
        finish()
    }
    
    private fun handleDeepLink(deepLink: String) {
        // Route to appropriate activity based on deep link
        val mainIntent = Intent(this, com.tingwu.app.MainActivity::class.java)
        mainIntent.data = intent.data
        startActivity(mainIntent)
    }
}
