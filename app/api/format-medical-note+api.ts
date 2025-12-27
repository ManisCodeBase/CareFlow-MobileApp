// ============================================================================
// DEPRECATED: This endpoint has been replaced by the CareFlow Backend API
// ============================================================================
// The mobile app now connects to the centralized backend at:
// http://localhost:8000/api/format-medical-note
//
// This file is kept for reference but is no longer used.
// The backend implementation provides:
// - Centralized GPT-4o-mini processing
// - Consistent SOAP formatting across all clients
// - Better error handling and logging
// - Token usage tracking
// - Database integration for consultations
//
// See: CareFlow-Agentic-AI-System/app/api/v1/endpoints/formatting.py
// ============================================================================

/*
import OpenAI from 'openai';

const API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY) {
  throw new Error('Missing OpenAI API Key. Please set OPENAI_API_KEY in your .env');
}

/**
 * API route for formatting medical transcriptions into professional SOAP note format
 * Uses GPT-4o-mini for cost-effective formatting
 *//*
export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text) {
      return Response.json({ error: 'Missing text field' }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey: API_KEY });
    
    // Use GPT-4o-mini - cost-effective and efficient for formatting tasks
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a medical documentation assistant. Format the provided medical transcription into a clear, professional SOAP note format following US medical standards.

SOAP Format:
- **SUBJECTIVE (S):** Patient's reported symptoms, concerns, and history
- **OBJECTIVE (O):** Observable findings, vital signs, examination results
- **ASSESSMENT (A):** Diagnosis or clinical impression
- **PLAN (P):** Treatment plan, prescriptions, follow-up

Rules:
1. DO NOT modify, add, or remove any medical information
2. Only reorganize existing content into proper sections
3. Use clear section headers with proper formatting
4. Maintain all original details and terminology
5. If information for a section is missing, write "Not documented"
6. Use bullet points for readability within each section
7. Keep the formatting clean and professional

Return only the formatted SOAP note.`
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.3, // Low temperature for consistent formatting
      max_tokens: 2000,
    });

    const formattedText = response.choices[0]?.message?.content || text;

    return Response.json({ formattedText });
  } catch (error) {
    console.error('Error formatting medical note:', error);
    return Response.json({ error: 'Failed to format medical note' }, { status: 500 });
  }
}
*/
