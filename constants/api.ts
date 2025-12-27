/**
 * API Configuration
 * Central configuration for all API endpoints
 */

import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Get environment variables - works differently on web vs native
// Web: Uses process.env directly from .env file
// Native (iOS/Android): Uses expo-constants from app.config.js
const getEnvVar = (key: string, fallback: string = ''): string => {
  // On web, use process.env
  if (Platform.OS === 'web') {
    return process.env[key] || fallback;
  }
  
  // On native, use expo-constants extra config
  const envMap: Record<string, string | undefined> = {
    'EXPO_PUBLIC_AZURE_SPEECH_TO_TEXT_URL': Constants.expoConfig?.extra?.azureSpeechToTextUrl,
    'EXPO_PUBLIC_AZURE_SPEECH_TO_TEXT_KEY': Constants.expoConfig?.extra?.azureSpeechToTextKey,
    'EXPO_PUBLIC_AZURE_FORMAT_NOTE_URL': Constants.expoConfig?.extra?.azureFormatNoteUrl,
    'EXPO_PUBLIC_AZURE_FORMAT_NOTE_KEY': Constants.expoConfig?.extra?.azureFormatNoteKey,
  };
  
  return envMap[key] || fallback;
};

// Azure Functions Configuration
const AZURE_SPEECH_TO_TEXT_URL = getEnvVar('EXPO_PUBLIC_AZURE_SPEECH_TO_TEXT_URL', 'https://careflow-funcapp.azurewebsites.net/api/speech_to_text');
const AZURE_SPEECH_TO_TEXT_KEY = getEnvVar('EXPO_PUBLIC_AZURE_SPEECH_TO_TEXT_KEY', '');

const AZURE_FORMAT_NOTE_URL = getEnvVar('EXPO_PUBLIC_AZURE_FORMAT_NOTE_URL', 'https://careflow-funcapp.azurewebsites.net/api/format_medical_note');
const AZURE_FORMAT_NOTE_KEY = getEnvVar('EXPO_PUBLIC_AZURE_FORMAT_NOTE_KEY', '');

// Backend API Base URL (legacy - for future backend endpoints)
// Change this to your deployed backend URL in production
export const API_BASE_URL = 'http://localhost:8000';

// API Endpoints
export const API_ENDPOINTS = {
  // Azure Functions - Transcription & Formatting
  SPEECH_TO_TEXT: AZURE_SPEECH_TO_TEXT_URL,
  FORMAT_MEDICAL_NOTE: AZURE_FORMAT_NOTE_URL,
  
  // Future endpoints (when implemented)
  // PATIENTS: `${API_BASE_URL}/api/patients`,
  // APPOINTMENTS: `${API_BASE_URL}/api/appointments`,
  // CONSULTATIONS: `${API_BASE_URL}/api/consultations`,
} as const;

// API Keys for Azure Functions
export const API_KEYS = {
  SPEECH_TO_TEXT: AZURE_SPEECH_TO_TEXT_KEY,
  FORMAT_MEDICAL_NOTE: AZURE_FORMAT_NOTE_KEY,
} as const;

// API Configuration
export const API_CONFIG = {
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

// Debug logging to verify configuration
console.log('🔧 ========================================');
console.log('🔧 API Configuration Loaded');
console.log('🔧 ========================================');
console.log('📱 Platform:', Platform.OS);
console.log('🌐 Speech-to-Text URL:', API_ENDPOINTS.SPEECH_TO_TEXT);
console.log('🌐 Format Note URL:', API_ENDPOINTS.FORMAT_MEDICAL_NOTE);
console.log('🔑 Speech-to-Text Key Present:', !!API_KEYS.SPEECH_TO_TEXT);
console.log('🔑 Format Note Key Present:', !!API_KEYS.FORMAT_MEDICAL_NOTE);
console.log('📏 Speech-to-Text Key Length:', API_KEYS.SPEECH_TO_TEXT?.length || 0);
console.log('📏 Format Note Key Length:', API_KEYS.FORMAT_MEDICAL_NOTE?.length || 0);

if (Platform.OS !== 'web') {
  console.log('📦 Expo Config Available:', !!Constants.expoConfig);
  console.log('📦 Extra Config Available:', !!Constants.expoConfig?.extra);
  console.log('🔍 Extra Config Keys:', Object.keys(Constants.expoConfig?.extra || {}));
  console.log('🏗️ Build Info:', JSON.stringify(Constants.expoConfig?.extra?.buildInfo, null, 2));
  
  // Log first/last 5 chars of keys for verification (security safe)
  if (API_KEYS.SPEECH_TO_TEXT) {
    const key = API_KEYS.SPEECH_TO_TEXT;
    console.log('🔐 Speech Key Preview:', `${key.substring(0, 5)}...${key.substring(key.length - 5)}`);
  }
  if (API_KEYS.FORMAT_MEDICAL_NOTE) {
    const key = API_KEYS.FORMAT_MEDICAL_NOTE;
    console.log('🔐 Format Key Preview:', `${key.substring(0, 5)}...${key.substring(key.length - 5)}`);
  }
}

if (!API_KEYS.SPEECH_TO_TEXT || !API_KEYS.FORMAT_MEDICAL_NOTE) {
  console.error('❌ ========================================');
  console.error('❌ CRITICAL: API KEYS MISSING!');
  console.error('❌ ========================================');
  console.error('❌ This build will NOT work!');
  console.error('❌ Check eas.json env configuration');
  console.error('❌ ========================================');
}

console.log('🔧 ========================================');
