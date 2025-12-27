/**
 * Screen 2: Patient Context & Action
 * Shows patient details before starting consultation
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from '@/constants/theme';
import { PatientCard } from '@/components/clinical/PatientCard';
import { usePatient } from '@/hooks';

export default function PatientDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { top, bottom } = useSafeAreaInsets();
  
  const {
    appointment,
    consultations: previousConsultations,
    loading,
    error,
  } = usePatient({ appointmentId: id });

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error || !appointment) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="alert-circle-outline" size={64} color={Colors.error} />
        <Text style={styles.errorText}>
          {error?.message || 'Appointment not found'}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push('/(doctor)/dashboard')}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{appointment.patient.name}</Text>
        <TouchableOpacity style={styles.infoButton}>
          <Ionicons name="information-circle-outline" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Patient Face Sheet */}
        <PatientCard patient={appointment.patient} />

        {/* Visit Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visit Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="calendar" size={20} color={Colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Scheduled Time</Text>
                <Text style={styles.infoValue}>
                  {new Date(appointment.scheduledTime).toLocaleString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="clipboard" size={20} color={Colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Reason for Visit</Text>
                <Text style={styles.infoValue}>{appointment.reason}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Previous Consultations */}
        {previousConsultations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Previous Consultations</Text>
            {previousConsultations.map((consultation, index) => (
              <TouchableOpacity
                key={consultation.id}
                style={styles.consultationCard}
                onPress={() => router.push({
                  pathname: '/(doctor)/review/[consultationId]',
                  params: { consultationId: consultation.id }
                })}
              >
                <View style={styles.consultationHeader}>
                  <Ionicons name="document-text" size={20} color={Colors.primary} />
                  <Text style={styles.consultationDate}>
                    {new Date(consultation.startedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
                <View style={styles.consultationBody}>
                  <Text style={styles.consultationDuration}>
                    Duration: {Math.floor(consultation.duration / 60)}:{(consultation.duration % 60).toString().padStart(2, '0')}
                  </Text>
                  {consultation.formattedNote && (
                    <Text style={styles.consultationPreview} numberOfLines={2}>
                      {consultation.formattedNote.substring(0, 100)}...
                    </Text>
                  )}
                </View>
                <View style={styles.consultationFooter}>
                  <Text style={styles.viewNoteText}>View Note</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Action Button (Sticky Footer) */}
      <View style={[styles.footer, { paddingBottom: bottom + Spacing.lg }]}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.push({
            pathname: '/(doctor)/recording/[appointmentId]',
            params: { appointmentId: appointment.id }
          })}
          activeOpacity={0.8}
        >
          <Ionicons name="mic" size={24} color={Colors.text.white} />
          <Text style={styles.startButtonText}>Start Consultation</Text>
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
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    flex: 1,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  infoButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.xl,
    paddingBottom: Spacing.huge,
  },
  section: {
    marginTop: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
    letterSpacing: -0.3,
  },
  infoCard: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.card,
    padding: Spacing.xl,
    ...Shadows.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
    fontWeight: FontWeights.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: FontSizes.base,
    color: Colors.text.primary,
    fontWeight: FontWeights.semibold,
    letterSpacing: -0.2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border.separator,
    marginVertical: Spacing.xl,
  },
  footer: {
    backgroundColor: Colors.background.primary,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    ...Shadows.lg,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.button,
    gap: Spacing.md,
    minHeight: 56,
    ...Shadows.md,
  },
  startButtonText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: Colors.text.white,
    letterSpacing: 0.2,
  },
  errorText: {
    fontSize: FontSizes.base,
    color: Colors.text.secondary,
    marginTop: Spacing.xl,
    fontWeight: FontWeights.medium,
  },
  consultationCard: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.card,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  consultationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  consultationDate: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    letterSpacing: -0.2,
  },
  consultationBody: {
    marginBottom: Spacing.md,
  },
  consultationDuration: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    fontWeight: FontWeights.medium,
  },
  consultationPreview: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  consultationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
    paddingTop: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border.separator,
  },
  viewNoteText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
  },
});
