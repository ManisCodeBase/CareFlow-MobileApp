/**
 * Screen 4: Transcription Editor
 * Review and edit transcribed consultation notes
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Markdown from 'react-native-markdown-display';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from '@/constants/theme';
import { AudioPlayer } from '@/components/clinical/AudioPlayer';
import { Consultation } from '@/types/clinical';
import { getConsultationById, updateConsultation, updateAppointmentStatus } from '@/services/PatientService';
import { processAudioToMedicalNote } from '@/services/TranscriptionService';
import { startConsultationWorkflow } from '@/services/WorkflowService';
import { toast } from 'sonner-native';

export default function ReviewScreen() {
  const router = useRouter();
  const { consultationId } = useLocalSearchParams<{ consultationId: string }>();
  const { top, bottom } = useSafeAreaInsets();
  
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editedNote, setEditedNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadAndProcessConsultation();
  }, [consultationId]);

  const loadAndProcessConsultation = async () => {
    if (!consultationId) {
      console.log('⚠️ No consultationId provided');
      return;
    }

    console.log('📋 Loading consultation:', consultationId);

    try {
      const data = await getConsultationById(consultationId);
      console.log('📦 Consultation data:', data);
      
      if (!data) {
        throw new Error('Consultation not found');
      }

      setConsultation(data);

      // If already has transcription, use it
      if (data.formattedNote) {
        console.log('✅ Using existing formatted note');
        setEditedNote(data.formattedNote);
        setIsLoading(false);
        return;
      }

      // Otherwise, process the audio
      console.log('🎙️ Processing audio from:', data.audioUri);
      setIsProcessing(true);
      toast.loading('Transcribing consultation...');

      console.log('🔄 Calling Whisper API...');
      const { transcription, formattedNote } = await processAudioToMedicalNote(data.audioUri);
      
      console.log('📝 Transcription received:', transcription?.substring(0, 100) + '...');
      console.log('📄 Formatted note received:', formattedNote?.substring(0, 100) + '...');

      // Update consultation with results
      console.log('💾 Updating consultation with transcription...');
      await updateConsultation(consultationId, {
        transcription,
        formattedNote,
        status: 'completed',
      });

      setEditedNote(formattedNote);
      console.log('✅ Transcription complete!');
      toast.success('Transcription complete');
    } catch (error) {
      console.error('❌ Error processing consultation:', error);
      toast.error('Failed to transcribe audio');
      Alert.alert('Error', 'Failed to process consultation. Please try again.');
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
      toast.dismiss();
    }
  };

  const handleDiscard = () => {
    if (Platform.OS === 'web') {
      const confirmed = globalThis.confirm('Are you sure you want to discard this consultation note?');
      if (confirmed) {
        router.replace('/(doctor)/dashboard');
      }
    } else {
      Alert.alert(
        'Discard Changes',
        'Are you sure you want to discard this consultation note?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => router.replace('/(doctor)/dashboard'),
          },
        ]
      );
    }
  };

  const handleSave = async () => {
    if (!consultation) return;

    try {
      setIsSaving(true);

      // Step 1: Update consultation with edited note
      console.log('💾 Saving consultation note...');
      await updateConsultation(consultationId!, {
        formattedNote: editedNote,
        completedAt: new Date().toISOString(),
        status: 'completed',
      });

      // Step 2: Mark appointment as completed
      if (consultation.appointmentId) {
        console.log('✅ Marking appointment as completed...');
        await updateAppointmentStatus(
          consultation.appointmentId,
          'completed',
          consultationId!
        );
      }

      toast.success('Note saved successfully');

      // Step 3: Start the AI multi-agent workflow
      try {
        console.log('🤖 Starting AI workflow automation...');
        toast.loading('Starting AI workflow...');
        
        const workflowResult = await startConsultationWorkflow(consultationId!);
        
        console.log('✅ Workflow started:', workflowResult);
        toast.dismiss();
        toast.success('AI workflow started! Processing...');
        
        // Inform doctor about what's happening
        if (Platform.OS === 'web') {
          alert(
            '🤖 AI Workflow Started!\n\n' +
            'The system is now processing:\n\n' +
            '✅ Billing codes (CPT/ICD-10)\n' +
            '✅ Patient-friendly summary\n' +
            '✅ Follow-up recommendations\n' +
            '✅ Email & WhatsApp notifications\n\n' +
            'You can review and approve the plan from the dashboard.'
          );
        } else {
          Alert.alert(
            '🤖 Workflow Started',
            'The system is now processing:\n\n' +
            '✅ Generating billing codes\n' +
            '✅ Creating patient summary\n' +
            '✅ Analyzing follow-up needs\n' +
            '✅ Preparing notifications\n\n' +
            'You\'ll review the plan before it\'s sent to the patient.',
            [{ text: 'Got It', style: 'default' }]
          );
        }
      } catch (workflowError) {
        console.error('⚠️ Workflow failed (non-critical):', workflowError);
        toast.dismiss();
        
        // Don't block the user - workflow is optional automation
        toast.error('Note saved, but automated workflow failed. You can retry from dashboard.');
        
        if (Platform.OS !== 'web') {
          Alert.alert(
            'Workflow Error',
            'Your consultation note was saved successfully, but the automated workflow failed to start. You can try again from the dashboard.',
            [{ text: 'OK' }]
          );
        }
      }
      
      // Navigate back to dashboard
      setTimeout(() => {
        router.replace('/(doctor)/dashboard');
      }, 1500); // Increased delay to show workflow messages
      
    } catch (error) {
      console.error('❌ Error saving note:', error);
      toast.dismiss();
      Alert.alert('Error', 'Failed to save consultation note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered, { paddingTop: top }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>
          {isProcessing ? 'Transcribing consultation...' : 'Loading...'}
        </Text>
      </View>
    );
  }

  if (!consultation) {
    return (
      <View style={[styles.container, styles.centered, { paddingTop: top }]}>
        <Ionicons name="alert-circle-outline" size={64} color={Colors.error} />
        <Text style={styles.errorText}>Consultation not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleDiscard} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Consultation Note</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: bottom + 100 },
        ]}
      >
        {/* Audio Player */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Audio Recording</Text>
          <AudioPlayer audioUri={consultation.audioUri} />
        </View>

        {/* Transcription Editor */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Consultation Notes</Text>
            <TouchableOpacity 
              style={styles.toggleButton}
              onPress={() => setIsEditing(!isEditing)}
            >
              <Ionicons name={isEditing ? 'eye' : 'pencil'} size={18} color={Colors.primary} />
              <Text style={styles.toggleButtonText}>
                {isEditing ? 'View' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {isEditing ? (
            <View style={styles.editorContainer}>
              <TextInput
                style={styles.editor}
                value={editedNote}
                onChangeText={setEditedNote}
                multiline
                placeholder="Consultation notes will appear here..."
                placeholderTextColor={Colors.text.disabled}
                textAlignVertical="top"
              />
            </View>
          ) : (
            <View style={styles.markdownContainer}>
              <Markdown style={markdownStyles}>
                {editedNote || 'No consultation notes available'}
              </Markdown>
            </View>
          )}
          
          <Text style={styles.helperText}>
            {isEditing ? 'Editing mode - Tap View to see formatted notes' : 'Tap Edit to modify the notes'}
          </Text>
        </View>
      </ScrollView>

      {/* Footer Actions */}
      <View style={[styles.footer, { paddingBottom: bottom + Spacing.lg }]}>
        <TouchableOpacity
          style={styles.discardButton}
          onPress={handleDiscard}
          disabled={isSaving}
        >
          <Text style={styles.discardButtonText}>Discard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color={Colors.text.white} />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color={Colors.text.white} />
              <Text style={styles.saveButtonText}>Approve & Save</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    ...Shadows.sm,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    letterSpacing: -0.3,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xxxl,
  },
  sectionLabel: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  editorContainer: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.card,
    minHeight: 320,
    ...Shadows.sm,
  },
  editor: {
    fontSize: FontSizes.base,
    color: Colors.text.primary,
    padding: Spacing.xl,
    minHeight: 320,
    lineHeight: 24,
    fontWeight: FontWeights.regular,
  },
  helperText: {
    fontSize: FontSizes.sm,
    color: Colors.text.tertiary,
    marginTop: Spacing.md,
    fontStyle: 'italic',
    fontWeight: FontWeights.medium,
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing.lg,
    backgroundColor: Colors.background.primary,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    ...Shadows.lg,
  },
  discardButton: {
    flex: 1,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.border.medium,
    minHeight: 56,
  },
  discardButtonText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    letterSpacing: 0.2,
  },
  saveButton: {
    flex: 2,
    flexDirection: 'row',
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.success,
    minHeight: 56,
    ...Shadows.md,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: Colors.text.white,
    letterSpacing: 0.2,
  },
  loadingText: {
    fontSize: FontSizes.base,
    color: Colors.text.secondary,
    marginTop: Spacing.xl,
    fontWeight: FontWeights.medium,
  },
  errorText: {
    fontSize: FontSizes.lg,
    color: Colors.text.secondary,
    marginTop: Spacing.xl,
    fontWeight: FontWeights.medium,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.button,
    borderWidth: 1,
    borderColor: Colors.border.light,
    minHeight: 36,
  },
  toggleButtonText: {
    color: Colors.primary,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    letterSpacing: 0.2,
  },
  markdownContainer: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.card,
    padding: Spacing.xl,
    minHeight: 320,
    ...Shadows.sm,
  },
});

const markdownStyles = StyleSheet.create({
  body: {
    fontSize: FontSizes.base,
    lineHeight: 24,
    color: Colors.text.primary,
  },
  heading1: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.text.primary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
    letterSpacing: -0.4,
  },
  heading2: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
    letterSpacing: -0.3,
  },
  strong: {
    fontWeight: FontWeights.bold,
    color: Colors.text.primary,
  },
  bullet_list: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  bullet_list_icon: {
    color: Colors.primary,
    fontSize: FontSizes.base,
  },
  list_item: {
    marginBottom: Spacing.sm,
  },
  text: {
    fontSize: FontSizes.base,
    lineHeight: 24,
    color: Colors.text.primary,
  },
  paragraph: {
    marginBottom: Spacing.md,
  },
});
