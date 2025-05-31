package com.uddco

import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.PermissionRequest
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import android.webkit.WebView

class MainActivity : ReactActivity() {

    override fun getMainComponentName(): String = "UDDCo"

    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Enable WebView debugging (optional)
        WebView.setWebContentsDebuggingEnabled(true)

        // WARNING: This only works if you create the WebView manually.
        // Since React Native WebView creates it natively, you'll need to patch WebView config there
        // OR handle permissions in JavaScript by capturing the permission request.
    }
}
