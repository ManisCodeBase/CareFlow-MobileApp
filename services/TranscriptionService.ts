/**
 * Transcription Service
 * Handles audio transcription and medical note formatting
 */

import { API_ENDPOINTS, API_KEYS } from '@/constants/api';

// Debug: Log API configuration on module load
console.log('🔧 API Config loaded:', {
  speechToTextUrl: API_ENDPOINTS.SPEECH_TO_TEXT,
  formatNoteUrl: API_ENDPOINTS.FORMAT_MEDICAL_NOTE,
  hasSpeechKey: !!API_KEYS.SPEECH_TO_TEXT,
  hasFormatKey: !!API_KEYS.FORMAT_MEDICAL_NOTE,
  speechKeyLength: API_KEYS.SPEECH_TO_TEXT?.length || 0,
  formatKeyLength: API_KEYS.FORMAT_MEDICAL_NOTE?.length || 0,
});

/**
 * Transcribe audio file using Whisper API via Azure Functions
 */
export const transcribeAudio = async (audioUri: string): Promise<string> => {
  console.log('🎤 ========================================');
  console.log('🎤 TRANSCRIPTION REQUEST STARTED');
  console.log('🎤 ========================================');
  console.log('📁 Audio URI:', audioUri);
  console.log('🌐 API Endpoint:', API_ENDPOINTS.SPEECH_TO_TEXT);
  console.log('🔑 API Key Present:', !!API_KEYS.SPEECH_TO_TEXT);
  console.log('📏 API Key Length:', API_KEYS.SPEECH_TO_TEXT?.length || 0);
  
  if (API_KEYS.SPEECH_TO_TEXT) {
    const key = API_KEYS.SPEECH_TO_TEXT;
    console.log('🔐 Key Preview:', `${key.substring(0, 5)}...${key.substring(key.length - 5)}`);
  }
  
  try {
    console.log('📤 Preparing to send request...');
    
    // Verify API key exists
    if (!API_KEYS.SPEECH_TO_TEXT) {
      console.error('❌ ========================================');
      console.error('❌ API KEY MISSING!');
      console.error('❌ ========================================');
      console.error('❌ Expected: EXPO_PUBLIC_AZURE_SPEECH_TO_TEXT_KEY');
      console.error('❌ Actual Length:', API_KEYS.SPEECH_TO_TEXT?.length || 0);
      console.error('❌ Check eas.json configuration');
      console.error('❌ ========================================');
      throw new Error('Azure Function API key not configured');
    }
    
    console.log('✅ API Key validated');
    console.log('🚀 Sending request to:', API_ENDPOINTS.SPEECH_TO_TEXT);
    
    // Create FormData
    const formData = new FormData();
    
    // Handle different URI types (web blob vs native file)
    if (audioUri.startsWith('blob:')) {
      // For web: fetch the blob and append it
      console.log('🌐 Web platform detected, fetching blob...');
      const audioBlob = await fetch(audioUri).then(r => r.blob());
      console.log('📦 Audio blob size:', audioBlob.size, 'bytes');
      formData.append('file', audioBlob, 'recording.m4a');
    } else {
      // For mobile: use native file object structure
      console.log('📱 Mobile platform detected, using native file structure');
      formData.append('file', {
        uri: audioUri,
        name: 'recording.m4a',
        type: 'audio/m4a',
      } as any);
    }

    console.log('⏳ Sending HTTP POST request...');
    
    const response = await fetch(API_ENDPOINTS.SPEECH_TO_TEXT, {
      method: 'POST',
      headers: {
        'x-functions-key': API_KEYS.SPEECH_TO_TEXT,
      },
      body: formData,
    });

    console.log('📥 Response received!');
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response OK:', response.ok);
    console.log('📊 Response Status Text:', response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ ========================================');
      console.error('❌ TRANSCRIPTION FAILED');
      console.error('❌ ========================================');
      console.error('❌ Status:', response.status, response.statusText);
      console.error('❌ Error Body:', errorText);
      console.error('❌ URL:', API_ENDPOINTS.SPEECH_TO_TEXT);
      console.error('❌ ========================================');
      throw new Error(`Transcription failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ ========================================');
    console.log('✅ TRANSCRIPTION SUCCESSFUL');
    console.log('✅ ========================================');
    console.log('📝 Transcription Length:', data.text?.length || 0);
    console.log('📝 Preview:', data.text?.substring(0, 100) || 'No text');
    console.log('✅ ========================================');
    return data.text || 'No transcription available';
  } catch (error) {
    console.error('❌ ========================================');
    console.error('❌ TRANSCRIPTION EXCEPTION');
    console.error('❌ ========================================');
    console.error('❌ Error:', error);
    console.error('❌ Error Message:', (error as Error).message);
    console.error('❌ Error Stack:', (error as Error).stack);
    console.error('❌ ========================================');
    throw error;
  }
};

/**
 * Format transcribed text into a medical note via Azure Functions
 */
export const formatMedicalNote = async (text: string): Promise<string> => {
  try {
    console.log('📋 Formatting medical note, text length:', text.length);
    console.log('🔑 Using API Key length:', API_KEYS.FORMAT_MEDICAL_NOTE?.length || 0);
    
    console.log('📤 Sending to Azure Function:', API_ENDPOINTS.FORMAT_MEDICAL_NOTE);
    
    // Verify API key exists
    if (!API_KEYS.FORMAT_MEDICAL_NOTE) {
      console.error('❌ API Key is missing! Check .env file and restart Expo.');
      throw new Error('Azure Function API key not configured');
    }
    
    const response = await fetch(API_ENDPOINTS.FORMAT_MEDICAL_NOTE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-functions-key': API_KEYS.FORMAT_MEDICAL_NOTE,
      },
      body: JSON.stringify({ text }),
    });

    console.log('📥 Format response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Formatting error:', errorText);
      throw new Error(`Formatting failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Formatting successful, length:', data.formattedText?.length || 0);
    return data.formattedText;
  } catch (error) {
    console.error('❌ Error formatting note:', error);
    // Return original text if formatting fails
    console.log('⚠️ Returning original text as fallback');
    return text;
  }
};

/**
 * Process audio: transcribe and format in one go
 */
export const processAudioToMedicalNote = async (audioUri: string): Promise<{
  transcription: string;
  formattedNote: string;
}> => {
  const transcription = await transcribeAudio(audioUri);
  const formattedNote = await formatMedicalNote(transcription);
  
  return {
    transcription,
    formattedNote,
  };
};
