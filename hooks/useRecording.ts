/**
 * useRecording Hook
 * Manages audio recording lifecycle, state, and controls
 * 
 * Handles:
 * - Recording initialization with permissions
 * - Pause/Resume functionality
 * - Audio metering (real on native, simulated on web)
 * - Cleanup on unmount
 * - Haptic feedback
 */

import { useState, useEffect, useRef } from 'react';
import { Alert, Vibration, Platform } from 'react-native';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import { Consultation } from '@/types/clinical';
import { saveConsultation } from '@/services/PatientService';

interface UseRecordingOptions {
  appointmentId: string;
  onSuccess?: (consultationId: string) => void;
  onCancel?: () => void;
  onError?: (error: Error) => void;
}

export const useRecording = ({ appointmentId, onSuccess, onCancel, onError }: UseRecordingOptions) => {
  const router = useRouter();
  
  // Recording state
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [metering, setMetering] = useState(-160);
  const [isMounted, setIsMounted] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);

  // Start recording automatically on mount
  useEffect(() => {
    startRecording();
    
    return () => {
      console.log('🧹 Cleaning up recording hook...');
      setIsMounted(false);
    };
  }, []);

  // Cleanup recording on unmount
  useEffect(() => {
    return () => {
      if (recording) {
        console.log('🗑️ Stopping and unloading recording...');
        recording.stopAndUnloadAsync().catch(err =>
          console.error('Error cleaning up recording:', err)
        );
      }
    };
  }, [recording]);

  // Audio metering effect
  useEffect(() => {
    if (!recording || !isRecording || isPaused || !isMounted) return;

    const interval = setInterval(async () => {
      if (!isMounted) return;

      try {
        const status = await recording.getStatusAsync();

        // On web, expo-av doesn't provide metering, so simulate it
        if (Platform.OS === 'web') {
          // Simulate active audio levels for visual feedback
          const simulatedLevel = -50 + Math.random() * 30; // Range: -50 to -20 dB
          if (isMounted) setMetering(simulatedLevel);
        } else if (status.isRecording && status.metering !== undefined) {
          if (isMounted) setMetering(status.metering);
        }
      } catch (error) {
        console.error('Error getting metering:', error);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [recording, isRecording, isPaused, isMounted]);

  /**
   * Initialize and start recording
   */
  const startRecording = async () => {
    if (isInitializing) return;
    
    try {
      setIsInitializing(true);
      console.log('🎙️ Starting recording...');

      // Cleanup any existing recordings first
      if (recording) {
        try {
          await recording.stopAndUnloadAsync();
          console.log('✅ Stopped and unloaded existing recording');
        } catch (unloadError) {
          console.log('ℹ️ Error unloading existing recording:', unloadError);
        }
        setRecording(null);
      }

      // Request permissions
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission Required', 'Microphone access is required to record consultations.');
        router.back();
        return;
      }

      // Set audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Create new recording
      const { recording: newRecording } = await Audio.Recording.createAsync(
        {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
          isMeteringEnabled: true,
        }
      );

      console.log('✅ Recording started successfully');
      setRecording(newRecording);
      setIsRecording(true);
      setStartTime(new Date());
    } catch (error) {
      console.error('Failed to start recording:', error);
      const err = error as Error;
      Alert.alert('Error', 'Failed to start recording. Please try again.');
      onError?.(err);
      router.back();
    } finally {
      setIsInitializing(false);
    }
  };

  /**
   * Stop recording and save consultation
   */
  const stopRecording = async () => {
    console.log('🔴 stopRecording called');
    if (!recording) {
      console.log('⚠️ No recording object found');
      return;
    }

    try {
      console.log('📝 Starting stop process...');

      // Haptic feedback
      if (Platform.OS !== 'web') {
        Vibration.vibrate(50);
      }

      console.log('🛑 Stopping audio recording...');
      await recording.stopAndUnloadAsync();

      const uri = recording.getURI();
      console.log('📁 Recording URI:', uri);

      if (!uri) {
        throw new Error('Failed to get recording URI');
      }

      const duration = startTime
        ? Math.floor((new Date().getTime() - startTime.getTime()) / 1000)
        : 0;

      console.log('⏱️ Duration:', duration, 'seconds');

      // Create consultation record
      const consultation: Consultation = {
        id: Date.now().toString(),
        appointmentId: appointmentId || '',
        patientId: '', // Will be set from appointment data
        audioUri: uri,
        duration,
        startedAt: startTime?.toISOString() || new Date().toISOString(),
        status: 'processing',
      };

      console.log('💾 Saving consultation:', consultation.id);
      await saveConsultation(consultation);

      console.log('🔄 Navigating to review screen...');
      onSuccess?.(consultation.id);
      
      // Navigate to review screen
      router.replace({
        pathname: '/(doctor)/review/[consultationId]',
        params: { consultationId: consultation.id },
      });
    } catch (error) {
      console.error('❌ Error stopping recording:', error);
      Alert.alert('Error', 'Failed to save recording. Please try again.');
      onError?.(error as Error);
    }
  };

  /**
   * Toggle pause/resume recording
   */
  const pauseResume = async () => {
    if (!recording) return;

    try {
      if (isPaused) {
        console.log('▶️ Resuming recording...');
        await recording.startAsync();
        setIsPaused(false);
        if (Platform.OS !== 'web') {
          Vibration.vibrate(50);
        }
      } else {
        console.log('⏸️ Pausing recording...');
        await recording.pauseAsync();
        setIsPaused(true);
        setMetering(-160); // Reset metering when paused
        if (Platform.OS !== 'web') {
          Vibration.vibrate(50);
        }
      }
    } catch (error) {
      console.error('❌ Error pausing/resuming recording:', error);
      Alert.alert('Error', 'Failed to pause/resume recording.');
      onError?.(error as Error);
    }
  };

  /**
   * Cancel recording with confirmation
   */
  const cancel = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        'Are you sure you want to cancel? This recording will be discarded.'
      );
      if (confirmed) {
        cancelRecording();
      }
    } else {
      Alert.alert(
        'Cancel Recording',
        'Are you sure you want to cancel? This recording will be discarded.',
        [
          { text: 'No', style: 'cancel' },
          { text: 'Yes, Cancel', style: 'destructive', onPress: cancelRecording },
        ]
      );
    }
  };

  /**
   * Actually cancel the recording
   */
  const cancelRecording = async () => {
    console.log('🚫 Cancelling recording...');
    setIsMounted(false); // Stop all intervals immediately
    
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
        console.log('✅ Recording cancelled');
      } catch (error) {
        console.error('❌ Error cancelling recording:', error);
      }
    }

    onCancel?.();
    router.push({
      pathname: '/(doctor)/patient/[id]',
      params: { id: appointmentId || '' },
    });
  };

  return {
    // State
    recording,
    isRecording,
    isPaused,
    startTime,
    metering,
    isInitializing,
    
    // Actions
    stop: stopRecording,
    pauseResume,
    cancel,
  };
};
