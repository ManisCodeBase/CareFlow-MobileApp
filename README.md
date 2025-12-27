# 🏥 CareFlow - Medical SOAP Assistant

> **Transform clinical consultations into professional SOAP notes with AI-powered voice documentation**

CareFlow is a modern mobile application designed for healthcare professionals to streamline their clinical documentation workflow. Simply record your patient consultation, and let AI handle the transcription and SOAP note formatting—saving you valuable time while maintaining professional medical documentation standards.

---

## 📋 What is CareFlow?

CareFlow eliminates the time-consuming task of manual medical note-taking by:

1. **Recording** patient consultations with a single tap
2. **Transcribing** audio to text using advanced speech recognition
3. **Formatting** transcriptions into structured SOAP notes automatically
4. **Organizing** patient records and consultation history in one place

Built for doctors, nurses, and healthcare professionals who need accurate documentation without sacrificing patient interaction time.

---

## ✨ Key Features

### 🎤 **Smart Voice Recording**
- One-tap recording with real-time audio visualization
- Pause and resume capability for interrupted consultations
- Live timer to track consultation duration
- Clear visual feedback during recording sessions

### 📝 **AI-Powered Documentation**
- Automatic transcription using OpenAI Whisper (medical-grade accuracy)
- Intelligent SOAP note generation (Subjective, Objective, Assessment, Plan)
- Follows AMA medical documentation standards
- Professional formatting ready for EHR systems

### 👥 **Patient Management**
- Quick access to patient demographics and medical history
- View all past consultations and SOAP notes
- Upcoming and completed appointments dashboard
- Search and filter patient records

### 🎨 **Modern Healthcare Design**
- Clean, professional interface following iOS design guidelines
- WCAG AA compliant for accessibility
- Color-coded status indicators (pending, in-progress, completed)
- Intuitive navigation optimized for clinical workflows

### 🔒 **Privacy & Security**
- Local storage for sensitive patient data
- HIPAA-compliant design principles
- No unnecessary data transmission
- Secure patient information handling

---

## 🎯 How It Works

### Clinical Workflow (4 Simple Steps)

```
📱 Dashboard → 👤 Patient Detail → 🎙️ Recording → ✅ Review
```

#### **1. Dashboard Screen**
Start your day with a clear overview of your schedule:
- View upcoming appointments organized by date
- See patient names, appointment times, and reasons for visit
- Quick access to completed consultations
- Pull to refresh for latest updates

#### **2. Patient Detail Screen**
Review patient information before the consultation:
- Patient demographics (name, age, gender, MRN)
- Chief complaint and reason for visit
- Past consultation history
- "Start Consultation" button to begin recording

#### **3. Recording Screen**
Capture the consultation effortlessly:
- Visual waveform shows audio levels in real-time
- Pause button for interruptions (phone calls, emergencies)
- Timer displays consultation duration
- Cancel or Complete options with confirmation dialogs

#### **4. Review Screen**
Finalize your documentation:
- Read the AI-generated SOAP note
- Listen to original audio recording if needed
- Review transcription accuracy
- Save to patient record or edit as needed

---

## 🚀 Quick Start

### For Users (Healthcare Professionals)

1. **Install the App**
   - Download CareFlow from App Store or Google Play
   - Grant microphone and storage permissions when prompted

2. **Set Up Your Account**
   - Configure your OpenAI API key in settings (for transcription)
   - Review demo patient data or add your own patients

3. **Start Recording**
   - Select a patient from your dashboard
   - Tap "Start Consultation" 
   - Have your patient conversation naturally
   - Complete when finished

4. **Review & Save**
   - AI generates your SOAP note automatically
   - Review for accuracy
   - Save to patient record

---

## 💡 Use Cases

### **Primary Care Physicians**
- Document routine check-ups and follow-up visits
- Track chronic disease management conversations
- Generate visit summaries quickly

### **Specialists**
- Capture detailed diagnostic consultations
- Document treatment plan discussions
- Maintain thorough specialty notes

### **Urgent Care/ER Physicians**
- Quick documentation for high-volume patient flow
- Accurate capture under time pressure
- Standardized formatting for handoffs

### **Medical Students & Residents**
- Learn proper SOAP note structure
- Practice clinical documentation
- Review and improve note-writing skills

---

## 🛠️ Technical Overview

### **Technology Stack**

- **Framework**: React Native (Expo) - Cross-platform mobile development
- **Language**: TypeScript - Type-safe code
- **State Management**: Custom React Hooks (useRecording, usePatient, useAppointments)
- **Storage**: AsyncStorage - Local encrypted storage
- **AI Services**: OpenAI API (Whisper + GPT-4o-mini)
- **Audio**: expo-av - Professional audio recording
- **Navigation**: Expo Router - File-based routing

### **Architecture**

```
app/
├── (doctor)/           # Clinical workflow screens
│   ├── dashboard.tsx   # Appointments overview
│   ├── patient/        # Patient details
│   ├── recording/      # Active consultation recording
│   └── review/         # SOAP note review
components/
├── clinical/           # Domain-specific components
│   ├── PatientCard.tsx
│   ├── AudioPlayer.tsx
│   ├── ConsultationTimer.tsx
│   └── WaveformVisualizer.tsx
├── common/             # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   └── Input.tsx
hooks/                  # Custom React hooks
├── useRecording.ts     # Recording lifecycle management
├── usePatient.ts       # Patient data loading
└── useAppointments.ts  # Dashboard data
services/               # Business logic layer
├── PatientService.ts   # CRUD operations
└── TranscriptionService.ts  # OpenAI integration
utils/                  # Helper functions
├── formatters.ts       # Date/time formatting
└── validators.ts       # Input validation
constants/
└── theme.ts            # iOS design system
```

### **Design System**

- **Colors**: iOS standard palette (#007AFF primary)
- **Typography**: SF Pro Display/Text font scale
- **Spacing**: 8pt grid system
- **Shadows**: iOS elevation levels
- **Accessibility**: WCAG AA compliant contrast ratios

---

## 🔧 Developer Setup

### **Prerequisites**

- Node.js 18+ and npm/yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Studio (Windows/Mac/Linux)
- OpenAI API key (for transcription and SOAP formatting)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/careflow-mobile.git
   cd careflow-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-api-key-here
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on your device**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

### **Available Scripts**

```bash
npm start              # Start Expo development server
npm run android        # Run on Android
npm run ios            # Run on iOS
npm run web            # Run in web browser
npx expo start --clear # Clear Metro bundler cache
```

---

## 📁 Project Structure

### **Key Directories**

- **`/app`** - Screen components and routing (Expo Router)
- **`/components`** - Reusable UI components
- **`/hooks`** - Custom React hooks for business logic
- **`/services`** - API integrations and data operations
- **`/utils`** - Pure helper functions
- **`/constants`** - Theme and configuration
- **`/types`** - TypeScript type definitions

### **Important Files**

- **`app.json`** - Expo configuration
- **`tsconfig.json`** - TypeScript configuration
- **`.env.example`** - Environment variables template
- **`package.json`** - Dependencies and scripts

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
# OpenAI API Configuration
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL_TRANSCRIPTION=whisper-1
OPENAI_MODEL_COMPLETION=gpt-4o-mini

# Optional: Custom API Base URL
# OPENAI_API_BASE_URL=https://api.openai.com/v1
```

**Security Note**: Never commit your `.env` file to version control. The `.gitignore` is configured to exclude it.

---

## 📦 Key Dependencies

### **Production**
- `expo` - ^52.x - Expo SDK
- `react-native` - Latest stable
- `expo-router` - File-based routing
- `expo-av` - Audio recording and playback
- `@react-native-async-storage/async-storage` - Local storage
- `openai` - OpenAI API client

### **Development**
- `typescript` - Type safety
- `@types/react` - React type definitions
- `eslint` - Code linting
- `prettier` - Code formatting

---

## 🎨 Design Principles

### **Healthcare-First Design**
- Clean, professional interface suitable for clinical environments
- High contrast for readability in various lighting conditions
- Large touch targets for easy use during patient consultations
- Minimal distractions to maintain focus on patient care

### **iOS Human Interface Guidelines**
- Native iOS feel and behavior
- Smooth animations and transitions
- Consistent spacing and typography
- Platform-appropriate patterns

### **Accessibility**
- WCAG AA compliant color contrast
- Screen reader support
- Large, tappable buttons (44x44pt minimum)
- Clear visual hierarchy

---

## 🔐 Privacy & Compliance

### **HIPAA Considerations**
While CareFlow is designed with HIPAA compliance in mind, please note:

- ✅ Local storage encryption
- ✅ Secure API communications (HTTPS)
- ✅ No unnecessary data retention
- ⚠️ OpenAI API usage requires Business Associate Agreement (BAA)
- ⚠️ Consult your organization's compliance team before production use

### **Data Storage**
- Patient data stored locally on device using AsyncStorage
- Audio recordings temporarily stored during processing
- SOAP notes saved to local database
- No cloud backup by default (configurable)

---

## 🧪 Testing

### **Manual Testing**
1. Test recording with background noise
2. Verify pause/resume functionality
3. Test with various consultation lengths (1-30 minutes)
4. Validate SOAP note accuracy with medical terminology

### **Demo Data**
The app includes sample patients for testing:
- Dr. Sarah Johnson - General Check-up
- Michael Chen - Diabetes Follow-up
- Emma Williams - Hypertension Review

---

## 🚧 Roadmap

### **Upcoming Features**
- [ ] Offline mode with sync capability
- [ ] Multi-language support
- [ ] Voice command controls ("Save note", "Pause recording")
- [ ] Template-based SOAP notes for common visits
- [ ] Integration with major EHR systems (Epic, Cerner)
- [ ] Tablet optimization for larger screens
- [ ] Apple Watch companion app for quick recordings

### **Planned Improvements**
- [ ] Enhanced audio quality with noise cancellation
- [ ] Custom medical vocabulary training
- [ ] Batch processing for multiple recordings
- [ ] Analytics dashboard for consultation metrics
- [ ] Team collaboration features

---

## 🐛 Troubleshooting

### **Common Issues**

**Problem**: Recording doesn't start
- **Solution**: Check microphone permissions in device settings

**Problem**: Transcription fails
- **Solution**: Verify OpenAI API key is correct in `.env` file

**Problem**: App crashes on recording screen
- **Solution**: Clear Metro cache with `npx expo start --clear`

**Problem**: Poor transcription quality
- **Solution**: Ensure quiet environment, speak clearly, check mic isn't obstructed

**Problem**: Build errors after updates
- **Solution**: Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

### **How to Contribute**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 👨‍⚕️ For Healthcare Professionals

### **Clinical Documentation Tips**

1. **Speak Naturally**: The AI is trained on medical conversations—use your normal clinical language
2. **Include Context**: Mention the patient's name and chief complaint early in the recording
3. **Be Thorough**: The more detail you provide, the better the SOAP note
4. **Review Carefully**: Always review AI-generated notes for accuracy before finalizing
5. **Use Pause**: Don't hesitate to pause for phone calls or privacy discussions

### **SOAP Note Quality**

CareFlow is optimized for standard medical documentation:
- **Subjective**: Patient's chief complaint and history
- **Objective**: Physical exam findings and vital signs
- **Assessment**: Diagnosis and clinical impression
- **Plan**: Treatment, medications, follow-up

---

## 📞 Support

For questions, issues, or feature requests:
- 📧 Email: support@careflow.app
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/careflow-mobile/issues)
- 📖 Docs: [Documentation](https://docs.careflow.app)

---

## 🙏 Acknowledgments

- **OpenAI** for Whisper and GPT models
- **Expo Team** for the amazing framework
- **React Native Community** for continuous support
- **Healthcare Professionals** who provided feedback and testing

---

## ⚕️ Medical Disclaimer

CareFlow is a documentation tool to assist healthcare professionals. It does not provide medical advice, diagnosis, or treatment. All AI-generated content should be reviewed by a qualified healthcare professional before use in patient care. Users are responsible for ensuring accuracy and compliance with local regulations.

---

<div align="center">

**Built with ❤️ for Healthcare Professionals**

[Website](https://careflow.app) • [Documentation](https://docs.careflow.app) • [Support](mailto:support@careflow.app)

</div>
