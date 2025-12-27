/**
 * Screen 3: Active Recording (Focus Mode)
 * Recording screen with live waveform visualization
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from '@/constants/theme';
import { WaveformVisualizer } from '@/components/clinical/WaveformVisualizer';
import { ConsultationTimer } from '@/components/clinical/ConsultationTimer';
import { useRecording } from '@/hooks';

export default function RecordingScreen() {
  const { appointmentId } = useLocalSearchParams<{ appointmentId: string }>();
  const { top } = useSafeAreaInsets();
  
  const {
    isRecording,
    isPaused,
    startTime,
    metering,
    isInitializing,
    stop,
    pauseResume,
    cancel,
  } = useRecording({ appointmentId: appointmentId || '' });

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recording Consultation</Text>
      </View>

      {/* Center Content */}
      <View style={styles.centerContent}>
        {/* Timer */}
        <ConsultationTimer startTime={startTime || undefined} isRunning={isRecording && !isPaused} />

        {/* Waveform */}
        <View style={styles.waveformContainer}>
          <WaveformVisualizer metering={metering} isRecording={isRecording && !isPaused} />
        </View>

        {/* Status */}
        <Text style={styles.statusText}>
          {isInitializing 
            ? 'Initializing...'
            : isPaused 
              ? 'Recording Paused' 
              : 'Recording in Progress'
          }
        </Text>
        <Text style={styles.instructionText}>
          Speak naturally about the patient's condition
        </Text>
      </View>

      {/* Bottom Controls */}
      <View style={styles.controls}>
        <View style={styles.buttonRow}>
          {/* Cancel Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={cancel}
              activeOpacity={0.8}
              disabled={isInitializing}
            >
              <Ionicons name="close" size={32} color={Colors.text.white} />
            </TouchableOpacity>
            <Text style={styles.buttonLabel}>Cancel</Text>
          </View>

          {/* Pause/Resume Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.pauseButton}
              onPress={pauseResume}
              activeOpacity={0.8}
              disabled={isInitializing}
            >
              <Ionicons 
                name={isPaused ? 'play' : 'pause'} 
                size={36} 
                color={Colors.text.white} 
              />
            </TouchableOpacity>
            <Text style={styles.buttonLabel}>
              {isPaused ? 'Resume' : 'Pause'}
            </Text>
          </View>

          {/* Stop Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.stopButton}
              onPress={stop}
              activeOpacity={0.8}
              disabled={isInitializing}
            >
              <View style={styles.stopIcon}>
                <View style={styles.stopSquare} />
              </View>
            </TouchableOpacity>
            <Text style={styles.buttonLabel}>Stop</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.background.primary,
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text.primary,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  waveformContainer: {
    marginVertical: Spacing.xxxl,
    width: '100%',
  },
  statusText: {
    fontSize: FontSizes.lg,
    color: Colors.text.primary,
    marginTop: Spacing.xxxl,
    fontWeight: FontWeights.semibold,
    letterSpacing: -0.2,
  },
  instructionText: {
    fontSize: FontSizes.base,
    color: Colors.text.secondary,
    marginTop: Spacing.md,
    textAlign: 'center',
    fontWeight: FontWeights.medium,
  },
  controls: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.background.primary,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 400,
  },
  buttonContainer: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  cancelButton: {
    width: 68,
    height: 68,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  pauseButton: {
    width: 68,
    height: 68,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
  stopButton: {
    width: 76,
    height: 76,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.xl,
  },
  stopIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    borderWidth: 2.5,
    borderColor: Colors.text.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopSquare: {
    width: 20,
    height: 20,
    backgroundColor: Colors.text.white,
    borderRadius: BorderRadius.xs,
  },
  buttonLabel: {
    fontSize: FontSizes.sm,
    color: Colors.text.primary,
    fontWeight: FontWeights.semibold,
  },
});
