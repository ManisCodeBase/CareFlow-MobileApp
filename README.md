# 🏥 CareFlow Mobile App

**AI-powered medical documentation assistant for healthcare professionals**

CareFlow is a React Native mobile application that transforms patient consultations into professional SOAP notes. Record consultations with a single tap, and let AI handle transcription and formatting—saving time while maintaining documentation standards.

## Overview

CareFlow streamlines clinical documentation by:

1. **Recording** consultations with real-time audio visualization
2. **Transcribing** audio using AI speech recognition
3. **Formatting** transcriptions into structured SOAP notes
4. **Managing** patient records and consultation history

## ✨ Key Features

- **Smart Voice Recording**: Real-time waveform visualization, pause/resume, live timer
- **AI Documentation**: Automatic transcription and SOAP note formatting via Azure Functions
- **Patient Management**: Dashboard for appointments, consultation history, patient demographics
- **Modern UI**: iOS-style design, WCAG AA accessibility, intuitive navigation
- **Privacy-First**: Local data storage, secure API communications

## 📱 Clinical Workflow

```
Dashboard → Patient Details → Record Consultation → Review SOAP Note
```

1. **Dashboard**: View upcoming appointments and patient schedule
2. **Patient Details**: Review demographics, history, and chief complaint
3. **Recording**: Capture consultation with visual feedback and timer
4. **Review**: Verify AI-generated SOAP note and save to patient record

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Android Studio or iOS Simulator

### Installation

```bash
# Clone and install
git clone <repository-url>
cd CareFlow-MobileApp
npm install

# Configure environment

# Edit .env and add your Azure Function URLs and keys

# Start development server
npx expo start
```

### Building for Production

**Using EAS Build (Recommended):**
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for Android
eas build --platform android --profile preview

# Build for iOS
eas build --platform ios --profile preview
```

## 🛠️ Technology Stack

- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **Backend**: Azure Functions (Speech-to-Text, SOAP formatting)
- **Storage**: AsyncStorage (local)
- **Audio**: expo-av
- **Navigation**: Expo Router (file-based)
- **State**: React Hooks

## 📁 Project Structure

```
app/
├── (doctor)/              # Clinical workflow screens
│   ├── dashboard.tsx      # Appointments overview
│   ├── patient/[id].tsx   # Patient details
│   ├── recording/[appointmentId].tsx
│   └── review/[consultationId].tsx
├── api/                   # API route handlers
components/
├── clinical/              # Domain components
└── common/                # Reusable UI
hooks/                     # Custom hooks (useRecording, usePatient)
services/                  # Business logic (TranscriptionService)
constants/                 # Theme & API config
types/                     # TypeScript definitions
```

## 🔑 Environment Variables

Create `.env` file in project root:

```env
# Azure Function Endpoints
EXPO_PUBLIC_AZURE_SPEECH_TO_TEXT_URL=https://your-function-app.azurewebsites.net/api/speech_to_text
EXPO_PUBLIC_AZURE_SPEECH_TO_TEXT_KEY=your-function-key

EXPO_PUBLIC_AZURE_FORMAT_NOTE_URL=https://your-function-app.azurewebsites.net/api/format_medical_note
EXPO_PUBLIC_AZURE_FORMAT_NOTE_KEY=your-function-key
```

See `.env.example` for complete template.

## 📱 Backend Integration

CareFlow integrates with Azure Functions for AI processing:

- **Speech-to-Text**: `/api/speech-to-text` - Transcribes audio using OpenAI Whisper
- **Format Note**: `/api/format-medical-note` - Generates SOAP notes using GPT-4

Audio recordings are sent to Azure Functions, processed, and returned as formatted SOAP notes. The backend handles OpenAI API integration centrally.

## 🐛 Troubleshooting

**Recording issues**: Check microphone permissions in device settings

**Transcription fails**: Verify Azure Function URLs and keys in `.env`

**Build errors**: Clear cache with `npx expo start --clear` or reinstall `node_modules`

**Poor audio quality**: Ensure quiet environment, check microphone not obstructed

## 📝 Available Scripts

```bash
npm start              # Start development server
npm run android        # Run on Android
npm run ios            # Run on iOS
npx expo start --clear # Clear Metro cache
```

## 🔐 Security Notes

- Patient data stored locally using AsyncStorage
- All API calls use HTTPS
- Audio files temporarily stored during processing
- Never commit `.env` to version control
- Consult compliance team before production use

---

**Built for Healthcare Professionals** 

For issues or questions, please open a GitHub issue.
