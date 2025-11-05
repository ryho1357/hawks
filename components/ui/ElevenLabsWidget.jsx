// components/ui/ElevenLabsWidget.jsx
import React, { useEffect } from 'react';
import { View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

export default function ElevenLabsWidget({ 
  agentId = "agent_01k0b7xka9ftrs5224xg0s6h06",
  visible = true 
}) {
  if (!visible) return null;

  // For web platform, inject the script directly
  if (Platform.OS === 'web') {
    useEffect(() => {
      // Create the widget element
      const widgetElement = document.createElement('elevenlabs-convai');
      widgetElement.setAttribute('agent-id', agentId);
      
      // Style it to be fixed in bottom right
      widgetElement.style.position = 'fixed';
      widgetElement.style.bottom = '100px !important';
      widgetElement.style.right = '20px';
      widgetElement.style.zIndex = '9999';
      
      // Add to document body
      document.body.appendChild(widgetElement);
      
      // Load the script if not already loaded
      if (!document.querySelector('script[src*="convai-widget-embed"]')) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
        script.async = true;
        script.type = 'text/javascript';
        document.head.appendChild(script);
      }
      
      // Cleanup
      return () => {
        try {
          document.body.removeChild(widgetElement);
        } catch (e) {
          // Element might already be removed
        }
      };
    }, [agentId]);

    // Return null since we're adding to document body directly
    return null;
  }

  // For mobile platforms, use WebView with the widget
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          margin: 0;
          padding: 0;
          background: transparent;
          overflow: hidden;
        }
      elevenlabs-convai {
        position: fixed !important;
        bottom: 80px !important;
        right: 0 !important;
      }
      </style>
    </head>
    <body>
      <elevenlabs-convai agent-id="${agentId}"></elevenlabs-convai>
      <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>
    </body>
    </html>
  `;

  return (
      <View style={{
        position: 'absolute',
        bottom: 100, // Move this higher
        right: 20,
        width: 80,
        height: 80,
        zIndex: 9999,
      }}>
      <WebView
        source={{ html: htmlContent }}
        style={{ 
          backgroundColor: 'transparent',
          flex: 1
        }}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        mixedContentMode="compatibility"
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
      />
    </View>
  );
}