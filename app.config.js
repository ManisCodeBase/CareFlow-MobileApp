/**
 * Expo App Configuration (with Environment Variables Support)
 * This file replaces app.json to enable dynamic environment variable loading for native builds
 */

// Load environment variables from .env file
// Note: On web, Expo automatically loads .env files
// On native (iOS/Android), we need to explicitly configure them here
const dotenv = require('dotenv');

// Load .env file
dotenv.config();

export default {
  expo: {
    name: "CareFlow",
    slug: "careflow",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/Care_flow_logo.jpg",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/Care_flow_logo.jpg",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.manifordev.careflow"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/Care_flow_logo.jpg",
        backgroundColor: "#ffffff"
      },
      permissions: [
        "android.permission.RECORD_AUDIO",
        "android.permission.MODIFY_AUDIO_SETTINGS"
      ],
      package: "com.careflow.mobileapp"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/Care_flow_logo.jpg"
    },
    plugins: [
      [
        "expo-router",
        {
          origin: "https://careflow.app"
        }
      ],
      "expo-localization",
      [
        "expo-av",
        {
          microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone."
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {
        origin: "https://careflow.app"
      },
      eas: {
        projectId: "2721d82e-bafa-4585-aec1-b6ed881c3dcf"
      },
      // Environment variables accessible via expo-constants
      // These will be bundled into the native builds
      azureSpeechToTextUrl: process.env.EXPO_PUBLIC_AZURE_SPEECH_TO_TEXT_URL || 'https://careflow-funcapp.azurewebsites.net/api/speech_to_text',
      azureSpeechToTextKey: process.env.EXPO_PUBLIC_AZURE_SPEECH_TO_TEXT_KEY || '',
      azureFormatNoteUrl: process.env.EXPO_PUBLIC_AZURE_FORMAT_NOTE_URL || 'https://careflow-funcapp.azurewebsites.net/api/format_medical_note',
      azureFormatNoteKey: process.env.EXPO_PUBLIC_AZURE_FORMAT_NOTE_KEY || '',
      // Build-time verification
      buildInfo: {
        timestamp: new Date().toISOString(),
        hasKeys: {
          speechToText: !!process.env.EXPO_PUBLIC_AZURE_SPEECH_TO_TEXT_KEY,
          formatNote: !!process.env.EXPO_PUBLIC_AZURE_FORMAT_NOTE_KEY,
        }
      }
    }
  }
};
