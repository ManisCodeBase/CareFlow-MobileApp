// ============================================================================
// DEPRECATED: This endpoint has been replaced by the CareFlow Backend API
// ============================================================================
// The mobile app now connects to the centralized backend at:
// http://localhost:8000/api/speech-to-text
//
// This file is kept for reference but is no longer used.
// The backend implementation provides:
// - Centralized audio processing
// - Better error handling and logging
// - Consistent API across all clients
// - Database integration for consultations
//
// See: CareFlow-Agentic-AI-System/app/api/v1/endpoints/transcription.py
// ============================================================================

/*
import OpenAI from 'openai';

const API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY) {
  throw new Error('Missing OpenAI API Key. Please set OPENAI_API_KEY in your .env');
}

/**
 * API route for transcribing audio files using OpenAI's Whisper model
 *//*
export async function POST(request: Request): Promise<Response> {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('file') as any;

    const openai = new OpenAI({ apiKey: API_KEY });
    const response = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
    });
    return Response.json({ text: response.text });
  } catch (error) {
    console.error('🚀 ~ POST ~ error:', error);
    return Response.json({ error: 'Failed to transcribe audio' }, { status: 500 });
  }
}
*/
